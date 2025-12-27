import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const limiter = new RateLimiterMemory({
  points: 60,
  duration: 60
});

export function rateLimit() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const tenant = (req as any).tenant?.id || 'public';
      await limiter.consume(`${tenant}:${ip}`);
      next();
    } catch {
      res.status(429).json({ error: 'rate limit' });
    }
  };
}
