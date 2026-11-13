import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import { NextResponse } from 'next/server';
import type { CustomRequest } from '@fuma-comment/server/custom';

/**
 * GitHub sign-in for comments. Adapted from fuma-comment's
 * `apps/example-github-discussions/lib/github-oauth.ts` (MIT, © Fuma Nama).
 *
 * The reader's GitHub token is kept in an httpOnly, AES-256-GCM-encrypted
 * cookie, so it never reaches page scripts. A second, readable cookie
 * (`SIGNED_IN_COOKIE`) only tells the widget to show "Sign out".
 *
 * Works with a GitHub App (recommended: the reader grants access to the one
 * repo the app is installed on) or an OAuth App (asks for `public_repo`).
 */

const TOKEN_COOKIE = 'fc_gh_token';
const STATE_COOKIE = 'fc_gh_state';
/** Readable by the client; holds no secret. */
export const SIGNED_IN_COOKIE = 'fc_gh_signed_in';
/** Ignored by GitHub Apps; an OAuth App needs it to write Discussions. */
const SCOPE = 'public_repo';
const ONE_YEAR = 60 * 60 * 24 * 365;
const STATE_TTL = 10 * 60 * 1000;
const CALLBACK_PATH = '/api/comments/oauth/callback';
const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_ACCESS_TOKEN = 'https://github.com/login/oauth/access_token';

let cachedKey: Buffer | undefined;

function key(): Buffer {
  if (cachedKey) return cachedKey;
  const secret = process.env.COMMENTS_TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('COMMENTS_TOKEN_SECRET must be a random string of at least 32 characters.');
  }
  cachedKey = createHash('sha256').update(secret).digest();
  return cachedKey;
}

function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), enc]).toString('base64url');
}

function decrypt(payload: string): string {
  const buf = Buffer.from(payload, 'base64url');
  const decipher = createDecipheriv('aes-256-gcm', key(), buf.subarray(0, 12));
  decipher.setAuthTag(buf.subarray(12, 28));
  return Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString('utf8');
}

function encodeState(returnUrl: string, nonce: string): string {
  return encrypt(JSON.stringify({ r: returnUrl, n: nonce, e: Date.now() + STATE_TTL }));
}

function decodeState(state: string): { returnUrl: string; nonce: string } {
  const { r, n, e } = JSON.parse(decrypt(state)) as { r: string; n: string; e: number };
  if (typeof e !== 'number' || Date.now() > e) throw new Error('State expired');
  return { returnUrl: r, nonce: n };
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() !== name) continue;
    return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return null;
}

function cookie(name: string, value: string, maxAge: number, httpOnly = true): string {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', `Max-Age=${maxAge}`, 'SameSite=Lax'];
  if (httpOnly) parts.push('HttpOnly');
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  return parts.join('; ');
}

/**
 * Reads and decrypts the reader's GitHub token from the request cookie.
 *
 * @param request - The fuma-comment request wrapper.
 * @returns The GitHub access token, or `null` when signed out or the cookie is invalid.
 */
export function getTokenFromRequest(request: CustomRequest): string | null {
  const header = request.headers.get('cookie');
  const value = readCookie(Array.isArray(header) ? (header[0] ?? null) : (header ?? null), TOKEN_COOKIE);
  if (!value) return null;
  try {
    return decrypt(value);
  } catch {
    return null;
  }
}

function origin(request: Request): string {
  const h = request.headers;
  const proto = h.get('x-forwarded-proto') ?? new URL(request.url).protocol.replace(':', '');
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? new URL(request.url).host;
  return `${proto}://${host}`;
}

/** Returns `candidate` only when it is on this site; otherwise the home page. */
function sameOrigin(candidate: string | null, self: string): string {
  if (!candidate) return `${self}/`;
  try {
    const parsed = new URL(candidate, self);
    return parsed.origin === self ? parsed.href : `${self}/`;
  } catch {
    return `${self}/`;
  }
}

/**
 * `GET /api/comments/oauth/login?return=<url>` — redirects to GitHub's consent screen.
 *
 * @param request - Incoming request.
 * @returns A redirect that also sets the CSRF nonce cookie.
 */
export function login(request: Request): NextResponse {
  const self = origin(request);
  const returnUrl = sameOrigin(new URL(request.url).searchParams.get('return'), self);
  const nonce = randomBytes(16).toString('base64url');
  const params = new URLSearchParams({
    client_id: process.env.COMMENTS_GITHUB_CLIENT_ID ?? '',
    redirect_uri: `${self}${CALLBACK_PATH}`,
    scope: SCOPE,
    state: encodeState(returnUrl, nonce),
  });

  const response = NextResponse.redirect(`${GITHUB_AUTHORIZE}?${params.toString()}`);
  response.headers.append('Set-Cookie', cookie(STATE_COOKIE, nonce, STATE_TTL / 1000));
  return response;
}

/**
 * `GET /api/comments/oauth/callback` — exchanges the code for a token and stores it.
 *
 * @param request - Incoming request from GitHub's redirect.
 * @returns A redirect back to the page the reader started on; `400` on a bad state, `500` when GitHub fails.
 */
export async function callback(request: Request): Promise<NextResponse> {
  const self = origin(request);
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  const nonce = readCookie(request.headers.get('cookie'), STATE_COOKIE);

  let returnUrl: string;
  try {
    if (!state) throw new Error('Missing state');
    const decoded = decodeState(state);
    // `state` only protects against CSRF when bound to the browser that started the flow.
    const sent = Buffer.from(decoded.nonce ?? '');
    const held = Buffer.from(nonce ?? '');
    if (sent.length !== held.length || !timingSafeEqual(sent, held)) throw new Error('State mismatch');
    returnUrl = sameOrigin(decoded.returnUrl, self);
  } catch {
    return NextResponse.json({ message: 'Invalid or expired sign-in state' }, { status: 400 });
  }

  const code = url.searchParams.get('code');
  if (url.searchParams.get('error') || !code) {
    const response = NextResponse.redirect(returnUrl);
    response.headers.append('Set-Cookie', cookie(STATE_COOKIE, '', 0));
    return response;
  }

  let accessToken: string;
  try {
    const res = await fetch(GITHUB_ACCESS_TOKEN, {
      method: 'POST',
      headers: { Accept: 'application/json', 'User-Agent': 'site-comments' },
      body: new URLSearchParams({
        client_id: process.env.COMMENTS_GITHUB_CLIENT_ID ?? '',
        client_secret: process.env.COMMENTS_GITHUB_CLIENT_SECRET ?? '',
        code,
      }),
    });
    const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
    if (!data.access_token) {
      throw new Error(data.error ? `${data.error}: ${data.error_description ?? ''}` : 'no access_token');
    }
    accessToken = data.access_token;
  } catch (error) {
    // GitHub's error code only (e.g. incorrect_client_credentials); never the secret or the code.
    console.error('[comments] GitHub token exchange failed:', error instanceof Error ? error.message : error);
    // 500, not 502: Cloudflare replaces origin 502s with its own "Bad gateway" page.
    return NextResponse.json({ message: 'GitHub sign-in failed' }, { status: 500 });
  }

  const response = NextResponse.redirect(returnUrl);
  response.headers.append('Set-Cookie', cookie(STATE_COOKIE, '', 0));
  response.headers.append('Set-Cookie', cookie(TOKEN_COOKIE, encrypt(accessToken), ONE_YEAR));
  response.headers.append('Set-Cookie', cookie(SIGNED_IN_COOKIE, '1', ONE_YEAR, false));
  return response;
}

/**
 * `GET /api/comments/oauth/logout?return=<url>` — clears the token cookies.
 *
 * @param request - Incoming request.
 * @returns A redirect back to `return` (same origin only).
 */
export function logout(request: Request): NextResponse {
  const self = origin(request);
  const returnUrl = sameOrigin(new URL(request.url).searchParams.get('return'), self);
  const response = NextResponse.redirect(returnUrl);
  response.headers.append('Set-Cookie', cookie(TOKEN_COOKIE, '', 0));
  response.headers.append('Set-Cookie', cookie(SIGNED_IN_COOKIE, '', 0, false));
  return response;
}
