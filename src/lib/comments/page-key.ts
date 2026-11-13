/**
 * fuma-comment puts `page` into API URLs unencoded (`/api/comments/<page>/...`),
 * so the thread key must be one path segment. Site paths swap `/` for `~`,
 * which never appears in slugs.
 */
const SEP = '~';

/**
 * @param path - Site path, e.g. `/docs/labs/campus-network`.
 * @returns Thread key, e.g. `docs~labs~campus-network`.
 */
export function toPageKey(path: string): string {
  return path.replace(/^\/+|\/+$/g, '').split('/').join(SEP);
}

/**
 * @param key - Thread key from {@link toPageKey}.
 * @returns The site path, e.g. `/docs/labs/campus-network`.
 */
export function fromPageKey(key: string): string {
  return `/${key.split(SEP).join('/')}`;
}
