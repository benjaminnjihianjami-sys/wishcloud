import { Request, Response, NextFunction } from 'express';
import { pool } from './db.js';

export async function tenantContext(req: Request, res: Response, next: NextFunction) {
  try {
    const host = req.headers.host || '';
    const path = req.path || '';
    const [subdomain] = host.split('.');
    const slugFromSub = subdomain && subdomain !== 'www' ? subdomain : null;
    const match = path.match(/^\/t\/([^/]+)/);
    const slugFromPath = match ? match[1] : null;
    const slug = slugFromSub || slugFromPath;
    if (!slug) return res.status(400).json({ error: 'tenant not provided' });

    const { rows } = await pool.query('SELECT id, slug, name FROM tenants WHERE slug = $1', [slug]);
    if (!rows.length) return res.status(404).json({ error: 'tenant not found' });

    (req as any).tenant = rows[0];
    // In per-request connections you would set: set_config('app.tenant_id', tenant.id, false)
    next();
  } catch (err) {
    next(err);
  }
}
