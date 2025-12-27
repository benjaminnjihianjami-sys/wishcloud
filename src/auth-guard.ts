import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type Role = 'super_admin' | 'tenant_admin' | 'creator' | 'viewer';

export function requireAuth(roles?: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: verify JWT & check roles
    next();
  };
}
