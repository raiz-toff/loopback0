export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';

type MarkdownResponseInit = ResponseInit & {
  /**
   * Set when the same URL also serves HTML through Accept-based negotiation
   * (proxy.ts, next.config rewrites), so shared caches keep the variants apart.
   */
  negotiated?: boolean;
};

/**
 * Builds a `text/markdown` response.
 *
 * @param body - Markdown document.
 * @param init - Standard ResponseInit plus `negotiated`.
 * @returns Response with the Markdown content type and, when negotiated, `Vary: Accept`.
 */
export function markdownResponse(
  body: string,
  { negotiated = false, headers, ...init }: MarkdownResponseInit = {},
): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set('Content-Type', MARKDOWN_CONTENT_TYPE);
  if (negotiated) responseHeaders.append('Vary', 'Accept');
  return new Response(body, { ...init, headers: responseHeaders });
}
