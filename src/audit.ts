import { pool } from './db.js';

export async function auditLog(params: {
  tenant_id: string | null;
  actor_user_id: string | null;
  action: string;
  target_type?: string;
  target_id?: string;
  metadata?: any;
}) {
  const { tenant_id, actor_user_id, action, target_type, target_id, metadata } = params;
  await pool.query(
    `INSERT INTO audit_logs (tenant_id, actor_user_id, action, target_type, target_id, metadata)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [tenant_id, actor_user_id, action, target_type || null, target_id || null, metadata || null]
  );
}
