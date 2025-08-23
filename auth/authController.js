// authController.js
import express from 'express';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import { DataTypes } from 'sequelize';
import sequelize from '../parcel/parcelModel.js';
import { generateToken } from './jwtUtils.js';
import { Vendor } from '../vendor/vendorModel.js';

const router = express.Router();
router.use(cookieParser());

// Admin-only user table
export const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM('Admin'),
    allowNull: false,
    defaultValue: 'Admin'
  }
}, { timestamps: false });

// -------- REGISTER --------
router.post('/register', async (req, res) => {
  const { username, password, role, vendorName, subscriptionType } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'username, password, role are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'Admin') {
      // prevent collision with vendor usernames
      const vendorExists = await Vendor.findOne({ where: { username } });
      if (vendorExists) return res.status(409).json({ error: 'Username already used by a Vendor' });

      const admin = await User.create({ username, password: hashedPassword, role: 'Admin' });
      return res.status(201).json({ message: 'Admin created', user: { username: admin.username, role: 'Admin' } });
    }

    if (role === 'Vendor') {
      // vendor requires vendorName
      if (!vendorName) {
        return res.status(400).json({ error: 'vendorName is required for Vendor registration' });
      }

      // prevent collision with admin usernames
      const adminExists = await User.findOne({ where: { username } });
      if (adminExists) return res.status(409).json({ error: 'Username already used by an Admin' });

      const vendor = await Vendor.create({
        vendorName,
        subscriptionType: subscriptionType || 'NORMAL',
        username,
        password: hashedPassword
      });
      return res.status(201).json({
        message: 'Vendor registered',
        vendor: { id: vendor.id, vendorName: vendor.vendorName, subscriptionType: vendor.subscriptionType }
      });
    }

    return res.status(400).json({ error: 'Invalid role. Allowed: Admin | Vendor' });
  } catch (err) {
    return res.status(400).json({ error: 'Registration failed', details: err?.message });
  }
});

// -------- LOGIN --------
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });

  try {
    // If role provided, use it; else try Admin then Vendor
    if (role === 'Admin') {
      const admin = await User.findOne({ where: { username } });
      if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, admin.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

      const token = generateToken({ id: admin.id, username: admin.username, role: 'Admin', type: 'admin' });
      res.cookie('auth_token', token, { httpOnly: true, sameSite: 'strict' });
      return res.json({ message: 'Login successful', role: 'Admin' });
    }

    if (role === 'Vendor') {
      const vendor = await Vendor.findOne({ where: { username } });
      if (!vendor) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, vendor.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

      const token = generateToken({ id: vendor.id, username: vendor.username, role: 'Vendor', type: 'vendor' });
      res.cookie('auth_token', token, { httpOnly: true, sameSite: 'strict' });
      return res.json({ message: 'Login successful', role: 'Vendor' });
    }

    // No role supplied: try Admin then Vendor
    const admin = await User.findOne({ where: { username } });
    if (admin && await bcrypt.compare(password, admin.password)) {
      const token = generateToken({ id: admin.id, username: admin.username, role: 'Admin', type: 'admin' });
      res.cookie('auth_token', token, { httpOnly: true, sameSite: 'strict' });
      return res.json({ message: 'Login successful', role: 'Admin' });
    }
    const vendor = await Vendor.findOne({ where: { username } });
    if (vendor && await bcrypt.compare(password, vendor.password)) {
      const token = generateToken({ id: vendor.id, username: vendor.username, role: 'Vendor', type: 'vendor' });
      res.cookie('auth_token', token, { httpOnly: true, sameSite: 'strict' });
      return res.json({ message: 'Login successful', role: 'Vendor' });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    return res.status(400).json({ error: 'Login failed', details: err?.message });
  }
});

// -------- LOGOUT --------
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out' });
});

export default router;
