import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * POST /api/resume — streams the resume PDF to the site's own download button.
 *
 * The PDF is not in the repo or in `public/`, so no crawlable URL exists.
 * It is fetched server-side from `RESUME_PDF_URL` (a private GitHub repo file
 * via the contents API, or any private URL), authenticated with
 * `RESUME_PDF_TOKEN` when set. In `next dev` without those variables, it falls
 * back to `private/Rajkumar_Neupane_Resume.pdf`.
 *
 * Requests must be same-origin and carry the `X-Resume-Request` header that
 * `downloadResume()` sets, which link-following scrapers do not send.
 *
 * @returns 200 with the PDF as an attachment; 403 for cross-site or
 *   header-less requests; 503 when no source is configured or reachable.
 */
export async function POST(request: Request): Promise<Response> {
  if (!isFromOwnButton(request)) {
    return new Response('Forbidden', { status: 403 });
  }

  const pdf = await loadPdf();
  if (!pdf) {
    return new Response('Resume unavailable', { status: 503 });
  }

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Rajkumar_Neupane_Resume.pdf"',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  });
}

/**
 * @param request - Incoming request.
 * @returns `true` when the request is same-origin and has the marker header.
 */
function isFromOwnButton(request: Request): boolean {
  if (request.headers.get('x-resume-request') !== '1') return false;

  const site = request.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin';

  // Older browsers without Fetch Metadata: compare Origin with Host.
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * @returns The PDF bytes, or `null` when no source is configured or it fails.
 */
async function loadPdf(): Promise<ArrayBuffer | null> {
  const url = process.env.RESUME_PDF_URL;
  if (url) {
    const headers: Record<string, string> = {};
    const token = process.env.RESUME_PDF_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    // GitHub's contents API returns the raw file only with this media type.
    if (new URL(url).hostname === 'api.github.com') {
      headers.Accept = 'application/vnd.github.raw';
    }
    const res = await fetch(url, { headers, cache: 'no-store' });
    return res.ok ? res.arrayBuffer() : null;
  }

  if (process.env.NODE_ENV === 'development') {
    try {
      const file = await readFile(path.join(process.cwd(), 'private', 'Rajkumar_Neupane_Resume.pdf'));
      return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
    } catch {
      return null;
    }
  }

  return null;
}
