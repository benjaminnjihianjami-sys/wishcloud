const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789'; // no confusing chars

function rand(n: number) {
  let out = '';
  for (let i = 0; i < n; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

// Generates human-short slug; distinct even with similar names
export function generateTenantSlug(base: string): string {
  const normalized = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 12);
  const suffix = rand(4);
  return normalized ? `${normalized}-${suffix}` : `wish-${suffix}`;
}
