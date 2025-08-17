// authMiddleware.js
// Middleware to protect routes using JWT authentication

// If there was previous code, it would be commented out here.

// import { verifyToken } from './jwtUtils.js';

// export function authenticateJWT(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Missing or invalid Authorization header' });
//   }
//   const token = authHeader.split(' ')[1];
//   const user = verifyToken(token);
//   if (!user) {
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
//   req.user = user;
//   next();
// }

import { verifyToken } from './jwtUtils.js';

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  // Check if Authorization header exists and is in Bearer format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  // Verify and decode token (will include role if stored during login)
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Store full user info (username + role) in req.user for later role-based checks
  req.user = {
    username: user.username,
    role: user.role
  };

  next();
}
