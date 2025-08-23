// import { verifyToken } from './jwtUtils.js';

// export function authenticateJWT(req, res, next) {
//   // 1. First, try to read from cookie
//   let token = req.cookies?.auth_token;

//   // 2. Fallback: also support Bearer token in header (optional, keeps flexibility)
//   if (!token) {
//     const authHeader = req.headers['authorization'];
//     if (authHeader && authHeader.startsWith('Bearer ')) {
//       token = authHeader.split(' ')[1];
//     }
//   }
//   // If no token found
//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }
//   // 3. Verify token
//   const user = verifyToken(token);
//   if (!user) {
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
//   // 4. Attach decoded user to request for later use
//   req.user = {
//     username: user.username,
//     role: user.role
//   };
//   next();
// }





// auth/authMiddleware.js
import { verifyToken } from './jwtUtils.js';

export function authenticateJWT(req, res, next) {
  // 1. First, try to read from cookie
  let token = req.cookies?.auth_token;
  // 2. Fallback: also support Bearer token in header (optional, keeps flexibility)
  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) token = authHeader.split(' ')[1];
  }
  // If no token found
  if (!token) return res.status(401).json({ error: 'No token provided' });

  // 3. Verify token
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Invalid or expired token' });

  // 4. Attach decoded user to request for later use
  // user: { id, username, role: 'Admin'|'Vendor', type: 'admin'|'vendor' }
  req.user = { id: user.id, username: user.username, role: user.role, type: user.type };
  next();
}
