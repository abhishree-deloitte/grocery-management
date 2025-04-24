import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const prisma = new PrismaClient();
export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateJWT = async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader:any = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  const blacklisted = await prisma.blacklistedToken.findUnique({ where: { token } });
  if (blacklisted) res.status(401).json({ error: 'Token has been invalidated' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
