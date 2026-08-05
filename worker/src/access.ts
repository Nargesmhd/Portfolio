/*
 * Cloudflare Access JWT verification.
 *
 * Access already blocks unauthenticated requests at the edge, so in the happy
 * path this code never rejects anything. It exists for the unhappy path: if the
 * Worker route is ever reachable by some path that does not pass through the
 * Access application - a misconfigured route, a workers.dev subdomain left on,
 * an Access policy edited in a hurry - the edge check is gone and this is the
 * only thing standing between the internet and the stats.
 *
 * Checking the header is present is not enough, because a header is trivially
 * forged by anyone talking to the origin directly. The signature is the part
 * that cannot be faked, so the signature is what we check.
 */

interface JsonWebKey_ {
  kid: string;
  kty: string;
  alg: string;
  use?: string;
  n: string;
  e: string;
}

interface AccessClaims {
  aud: string[] | string;
  email?: string;
  exp: number;
  iat: number;
  nbf?: number;
  iss: string;
}

/** Verified identity of the caller. */
export interface AccessIdentity {
  email: string;
}

export class AccessError extends Error {}

/* Keys rotate rarely; refetching them on every request would add a round trip
   to the critical path and hammer the certs endpoint. One hour is well inside
   Cloudflare's rotation window. */
const JWKS_TTL_MS = 60 * 60 * 1000;

let jwksCache: { url: string; keys: Map<string, CryptoKey>; at: number } | null =
  null;

function base64UrlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, '='));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlToJson<T>(input: string): T {
  return JSON.parse(new TextDecoder().decode(base64UrlToBytes(input))) as T;
}

async function loadKeys(teamDomain: string): Promise<Map<string, CryptoKey>> {
  const certsUrl = `https://${teamDomain}/cdn-cgi/access/certs`;

  if (
    jwksCache &&
    jwksCache.url === certsUrl &&
    Date.now() - jwksCache.at < JWKS_TTL_MS
  ) {
    return jwksCache.keys;
  }

  const response = await fetch(certsUrl);
  if (!response.ok) {
    throw new AccessError(
      `Could not fetch Access signing keys (${response.status}). Check ACCESS_TEAM_DOMAIN.`,
    );
  }

  const { keys } = (await response.json()) as { keys: JsonWebKey_[] };
  const imported = new Map<string, CryptoKey>();

  for (const key of keys) {
    if (key.kty !== 'RSA') continue;
    imported.set(
      key.kid,
      await crypto.subtle.importKey(
        'jwk',
        { kty: key.kty, n: key.n, e: key.e, alg: 'RS256', ext: true },
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify'],
      ),
    );
  }

  jwksCache = { url: certsUrl, keys: imported, at: Date.now() };
  return imported;
}

/**
 * Verifies the Access token on a request and returns the caller's identity.
 * Throws {@link AccessError} for anything that is not a valid, current token
 * issued for this application.
 */
export async function verifyAccessJwt(
  request: Request,
  teamDomain: string,
  expectedAud: string,
): Promise<AccessIdentity> {
  const token =
    request.headers.get('Cf-Access-Jwt-Assertion') ??
    /* Browsers navigating directly carry the token as a cookie rather than a
       header, so a fetch() from the admin page needs the cookie path too. */
    getCookie(request, 'CF_Authorization');

  if (!token) {
    throw new AccessError('No Cloudflare Access token on the request.');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new AccessError('Malformed Access token.');
  }
  const [rawHeader, rawPayload, rawSignature] = parts;

  const header = base64UrlToJson<{ alg: string; kid: string }>(rawHeader);
  if (header.alg !== 'RS256') {
    /* Refusing anything but RS256 closes the "alg: none" family of bypasses,
       where an attacker strips the signature and names an algorithm we would
       otherwise happily accept. */
    throw new AccessError(`Unexpected token algorithm: ${header.alg}`);
  }

  const keys = await loadKeys(teamDomain);
  const key = keys.get(header.kid);
  if (!key) {
    throw new AccessError('Access token was signed by an unknown key.');
  }

  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    base64UrlToBytes(rawSignature),
    new TextEncoder().encode(`${rawHeader}.${rawPayload}`),
  );
  if (!valid) {
    throw new AccessError('Access token signature is not valid.');
  }

  const claims = base64UrlToJson<AccessClaims>(rawPayload);
  const now = Math.floor(Date.now() / 1000);

  if (claims.exp <= now) throw new AccessError('Access token has expired.');
  if (claims.nbf && claims.nbf > now) {
    throw new AccessError('Access token is not valid yet.');
  }

  /* The audience check is what makes this token *this* application's token.
     Without it, a valid token minted for any other app in the same Access
     account would sail through. */
  const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audience.includes(expectedAud)) {
    throw new AccessError('Access token was issued for a different app.');
  }

  if (claims.iss !== `https://${teamDomain}`) {
    throw new AccessError('Access token came from a different team.');
  }

  return { email: claims.email ?? 'unknown' };
}

function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie');
  if (!header) return null;
  for (const pair of header.split(';')) {
    const index = pair.indexOf('=');
    if (index === -1) continue;
    if (pair.slice(0, index).trim() === name) {
      return pair.slice(index + 1).trim();
    }
  }
  return null;
}
