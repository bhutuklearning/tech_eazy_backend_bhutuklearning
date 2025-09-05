// authController.js
import express from "express";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import { ddbDocClient } from "../db/dynamoClient.js";
import {
  GetCommand,
  PutCommand,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { generateToken } from "./jwtUtils.js";

const router = express.Router();
router.use(cookieParser());

// DynamoDB table names
const ADMINS_TABLE = "UsersTable";
const VENDORS_TABLE = "VendorsTable";

/**
 * 🔹 Helper: Find Admin by username
 */
async function findAdminByUsername(username) {
  const cmd = new QueryCommand({
    TableName: ADMINS_TABLE,
    KeyConditionExpression: "username = :u",
    ExpressionAttributeValues: { ":u": username },
  });
  const res = await ddbDocClient.send(cmd);
  return res.Items?.[0];
}

/**
 * 🔹 Helper: Find Vendor by username
 */
async function findVendorByUsername(username) {
  const cmd = new ScanCommand({
    TableName: VENDORS_TABLE,
    FilterExpression: "username = :u",
    ExpressionAttributeValues: { ":u": username },
  });
  const res = await ddbDocClient.send(cmd);
  return res.Items?.[0];
}

// ================== REGISTER ==================
router.post("/register", async (req, res) => {
  const { username, password, role, vendorName, subscriptionType } = req.body;
  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ error: "username, password, role are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "Admin") {
      // prevent collision with vendor usernames
      const vendorExists = await findVendorByUsername(username);
      if (vendorExists) {
        return res
          .status(409)
          .json({ error: "Username already used by a Vendor" });
      }

      // also check admin table
      const adminExists = await findAdminByUsername(username);
      if (adminExists) {
        return res
          .status(409)
          .json({ error: "Username already used by another Admin" });
      }

      const admin = {
        id: uuidv4(),
        username,
        password: hashedPassword,
        role: "Admin",
      };

      await ddbDocClient.send(
        new PutCommand({ TableName: ADMINS_TABLE, Item: admin })
      );

      return res.status(201).json({
        message: "Admin created",
        user: { username: admin.username, role: "Admin" },
      });
    }

    if (role === "Vendor") {
      if (!vendorName) {
        return res
          .status(400)
          .json({ error: "vendorName is required for Vendor registration" });
      }

      // prevent collision with admin usernames
      const adminExists = await findAdminByUsername(username);
      if (adminExists) {
        return res
          .status(409)
          .json({ error: "Username already used by an Admin" });
      }

      const vendor = {
        id: uuidv4(),
        vendorName,
        subscriptionType: subscriptionType || "NORMAL",
        username,
        password: hashedPassword,
        role: "Vendor",
      };

      await ddbDocClient.send(
        new PutCommand({ TableName: VENDORS_TABLE, Item: vendor })
      );

      return res.status(201).json({
        message: "Vendor registered",
        vendor: {
          id: vendor.id,
          vendorName: vendor.vendorName,
          subscriptionType: vendor.subscriptionType,
        },
      });
    }

    return res
      .status(400)
      .json({ error: "Invalid role. Allowed: Admin | Vendor" });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Registration failed", details: err?.message });
  }
});

// ================== LOGIN ==================
router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "username and password are required" });
  }

  try {
    // ADMIN LOGIN
    if (role === "Admin") {
      const admin = await findAdminByUsername(username);
      if (!admin) return res.status(401).json({ error: "Invalid credentials" });

      const ok = await bcrypt.compare(password, admin.password);
      if (!ok) return res.status(401).json({ error: "Invalid credentials" });

      const token = generateToken({
        id: admin.id,
        username: admin.username,
        role: "Admin",
        type: "admin",
      });
      res.cookie("auth_token", token, { httpOnly: true, sameSite: "strict" });
      return res.json({ message: "Login successful", role: "Admin" });
    }

    // VENDOR LOGIN
    if (role === "Vendor") {
      const vendor = await findVendorByUsername(username);
      if (!vendor)
        return res.status(401).json({ error: "Invalid credentials" });

      const ok = await bcrypt.compare(password, vendor.password);
      if (!ok) return res.status(401).json({ error: "Invalid credentials" });

      const token = generateToken({
        id: vendor.id,
        username: vendor.username,
        role: "Vendor",
        type: "vendor",
      });
      res.cookie("auth_token", token, { httpOnly: true, sameSite: "strict" });
      return res.json({ message: "Login successful", role: "Vendor" });
    }

    // No role given → try both
    const admin = await findAdminByUsername(username);
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = generateToken({
        id: admin.id,
        username: admin.username,
        role: "Admin",
        type: "admin",
      });
      res.cookie("auth_token", token, { httpOnly: true, sameSite: "strict" });
      return res.json({ message: "Login successful", role: "Admin" });
    }

    const vendor = await findVendorByUsername(username);
    if (vendor && (await bcrypt.compare(password, vendor.password))) {
      const token = generateToken({
        id: vendor.id,
        username: vendor.username,
        role: "Vendor",
        type: "vendor",
      });
      res.cookie("auth_token", token, { httpOnly: true, sameSite: "strict" });
      return res.json({ message: "Login successful", role: "Vendor" });
    }

    return res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    return res.status(400).json({ error: "Login failed", details: err?.message });
  }
});

// ================== LOGOUT ==================
router.post("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out" });
});

export default router;