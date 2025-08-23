// jwtUtils.js
// Utility functions for JWT token generation and verification

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // Use env or fallback
const JWT_EXP = '7d';

// Generate JWT token for a user
export function generateToken(payload, expiresIn = JWT_EXP) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}