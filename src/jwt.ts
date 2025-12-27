import { createRemoteJWKSet, jwtVerify, JWTVerifyResult } from 'jose';

const jwksUri = process.env.SUPABASE_JWKS_URL;
if (!jwksUri) {
  throw new Error('SUPABASE_JWKS_URL not set');
}
const JWKS = createRemoteJWKSet(new URL(jwksUri));

type Role = 'super_admin' | 'tenant_admin' | 'creator' | 'viewer';

export type AuthToken = {
  sub: string;
  tenant_id: string;
  role: Role;
  exp: number;
  iat: number;
};

export async function verifyJwt(token: string): Promise<AuthToken> {
  const { payload }: JWTVerifyResult = await jwtVerify(token, JWKS, {
    algorithms: ['RS256']
  });
  const { sub, tenant_id, role } = payload as any;
  if (!sub || !tenant_id || !role) {
    throw new Error('invalid token claims');
  }
  return { sub, tenant_id, role, exp: payload.exp!, iat: payload.iat! };
}
