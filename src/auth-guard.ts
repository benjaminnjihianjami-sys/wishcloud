import { Request, Response, NextFunction } from 'express';
import { verifyJwt, AuthToken } from './jwt.js';

type Role = 'super_admin' | 'tenant_admin' | 'creator' | 'viewer';

export function requireAuth(roles?: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'unauthorized' });
    const token = header.slice(7);

    try {
      const payload: AuthToken = await verifyJwt(token);
      const { sub, tenant_id, role } = payload;
      const ctxTenant = (req as any).tenant?.id;
      if (ctxTenant && tenant_id !== ctxTenant) return res.status(403).json({ error: 'tenant mismatch' });
      if (roles && !roles.includes(role)) return res.status(403).json({ error: 'forbidden' });
      (req as any).user = { id: sub, tenant_id, role };
      next();
    } catch (e) {
      return res.status(401).json({ error: 'unauthorized' });
    }
  };
}
