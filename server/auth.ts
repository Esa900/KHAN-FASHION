import { Request, Response, NextFunction } from 'express';
import { db, CustomerUser } from './db';

export interface AuthenticatedRequest extends Request {
  user?: CustomerUser;
}

// Generate simple secure token encoding userId, role, and expiry
export function generateToken(user: CustomerUser): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifyToken(token: string): { userId: string; email: string; role: 'admin' | 'customer' } | null {
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf8');
    const data = JSON.parse(jsonStr);
    if (data.exp && data.exp < Date.now()) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

// Middleware to extract user if token is present
export function extractUserMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded) {
      const user = db.findUserByEmail(decoded.email);
      if (user) {
        req.user = user;
      }
    }
  }
  next();
}

// Middleware to protect routes that need authentication
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please login.' });
  }
  next();
}

// Middleware to protect Admin-only routes
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Access restricted to administrators only.' });
  }
  next();
}
