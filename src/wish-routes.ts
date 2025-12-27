import express from 'express';
import { requireAuth } from './auth-guard.js';
import { pool } from './db.js';
import { sanitize } from 'isomorphic-dompurify';
import { auditLog } from './audit.js';

export const wishesRouter = express.Router();

wishesRouter.post('/', requireAuth(['tenant_admin', 'creator']), async (req, res, next) => {
  try {
    const tenantId = (req as any).tenant.id;
    const user = (req as any).user;
    const { message, emoji = '🎂', visibility = 'public' } = req.body;

    if (!message || message.length > 240) return res.status(400).json({ error: 'invalid message' });
    const clean = sanitize(message, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    const { rows } = await pool.query(
      `INSERT INTO wishes (tenant_id, author_user_id, message, emoji, visibility)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [tenantId, user.id, clean, emoji, visibility]
    );

    await auditLog({
      tenant_id: tenantId,
      actor_user_id: user.id,
      action: 'wish.create',
      target_type: 'wish',
      target_id: rows[0].id,
      metadata: { visibility }
    });

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});
