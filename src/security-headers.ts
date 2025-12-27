import helmet from 'helmet';

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'"],
      "img-src": ["'self'", "data:"]
    }
  }
});
