import express from 'express';
import { requireAuth } from './auth-guard.js';
import { pool } from './db.js';
import { sanitize } from 'isomorphic-dompurify';

export const wishesRouter = express.Router();

// Example route
wishesRouter.get('/', requireAuth(['viewer']), async (req, res) => {
  res.json({ message: 'wishes endpoint' });
});
