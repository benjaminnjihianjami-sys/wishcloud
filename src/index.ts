import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import { securityHeaders } from './security-headers.js';
import { tenantContext } from './tenant-middleware.js';
import { requireAuth } from './auth-guard.js';
import { wishesRouter } from './wish-routes.js';
import { rateLimit } from './rate-limit.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(compression());
app.use(morgan('tiny'));
app.use(securityHeaders);

// Tenant resolution (subdomain or /t/:slug)
app.use(tenantContext);

// Rate limiting (per-tenant/IP; in-memory demo)
app.use(rateLimit());

// Healthcheck
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// Example protected route
app.get('/me', requireAuth(), (req, res) => {
  res.json({ user: (req as any).user, tenant: (req as any).tenant });
});

// Wishes
app.use('/wishes', wishesRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`wishcloud api listening on ${port}`);
});
