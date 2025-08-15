// // authController.js
// // Auth controller for /register, /login, /logout using JWT

// import express from 'express';
// import { Sequelize, DataTypes } from 'sequelize';
// import sequelize from '../parcel/parcelModel.js';
// import { generateToken } from './jwtUtils.js';

// // If there was previous code, it would be commented out here.

// const router = express.Router();

// // Minimal User model (for demo, can be extended)
// export const User = sequelize.define('User', {
//   username: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   }
// }, {
//   timestamps: false
// });

// // /register route
// router.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
//   try {
//     // In production, hash the password!
//     const user = await User.create({ username, password });
//     res.status(201).json({ message: 'User registered', user: { username: user.username } });
//   } catch (err) {
//     res.status(400).json({ error: 'Username already exists' });
//   }
// });

// // /login route
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
//   const user = await User.findOne({ where: { username, password } });
//   if (!user) return res.status(401).json({ error: 'Invalid credentials' });
//   const token = generateToken({ username: user.username });
//   res.json({ token });
// });

// // /logout route (stateless, client should delete token)
// router.post('/logout', (req, res) => {
//   // No server-side action needed for JWT logout
//   res.json({ message: 'Logged out (client should delete token)' });
// });

// export default router;







// authController.js
import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../parcel/parcelModel.js';
import { generateToken } from './jwtUtils.js';

const router = express.Router();

// Updated User model with role field
export const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Vendor'),
    allowNull: false,
    defaultValue: 'Vendor' // 👈 Default so old rows don't break
  }
}, {
  timestamps: false
});


// /register route
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, and role are required' });
  }
  if (!['Admin', 'Vendor'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be Admin or Vendor' });
  }
  try {
    // In production, hash the password!
    const user = await User.create({ username, password, role });
    res.status(201).json({ message: 'User registered', user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// /login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const user = await User.findOne({ where: { username, password } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = generateToken({ username: user.username, role: user.role });
  res.json({ token });
});

// /logout route (stateless, client should delete token)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out (client should delete token)' });
});

export default router;
