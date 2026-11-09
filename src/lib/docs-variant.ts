import { headers } from 'next/headers';
import { userAgent } from 'next/server';

/**
 * Docs layout family for the current request. Phones get Flux (minimal,
 * bottom navigation panel); everything else gets Spacious (inset page panel
 * beside the sidebar). Decided on the server from the User-Agent so the first
 * paint is already right, at the cost of rendering docs pages per request.
 */
export type DocsVariant = 'spacious' | 'flux';

export async function getDocsVariant(): Promise<DocsVariant> {
  const { device } = userAgent({ headers: await headers() });
  return device.type === 'mobile' ? 'flux' : 'spacious';
}
