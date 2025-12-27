import { Request, Response, NextFunction } from 'express';

export async function tenantContext(req: Request, res: Response, next: NextFunction) {
  const host = req.headers.host || '';
  // TODO: map host to tenant
  req['tenant'] = { id: host };
  next();
}
