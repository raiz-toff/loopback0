import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

// Every /docs URL can answer with HTML or Markdown depending on Accept, so
// shared caches (Vercel's CDN included) must key on it or a browser can be
// handed an agent's Markdown copy.
function varyOnAccept(response: NextResponse) {
  response.headers.append('Vary', 'Accept');
  return response;
}

export default function proxy(request: NextRequest) {
  const result = rewriteSuffix(request.nextUrl.pathname);
  if (result) {
    // Explicit .md URLs are their own resource; no negotiation involved.
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(request.nextUrl.pathname);

    if (result) {
      return varyOnAccept(NextResponse.rewrite(new URL(result, request.nextUrl)));
    }
  }

  return varyOnAccept(NextResponse.next());
}

// Only docs URLs are negotiated. Without a matcher the proxy runs on every
// request, including /_next/static, /_next/image, and public/ assets.
// Must stay a literal (no imports): keep in sync with docsRoute in lib/shared.
export const config = {
  matcher: ['/docs', '/docs/:path*'],
};
