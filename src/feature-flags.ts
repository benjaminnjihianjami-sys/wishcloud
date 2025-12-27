import { pool } from './db.js';

export async function isFeatureEnabled(tenantId: string, name: string): Promise<boolean> {
  const { rows } = await pool.query(
    'SELECT enabled FROM feature_flags WHERE tenant_id = $1 AND name = $2',
    [tenantId, name]
  );
  return rows[0]?.enabled ?? false;
}
