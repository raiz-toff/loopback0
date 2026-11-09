export const appName = 'Labs';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// Canonical origin for absolute URLs (sitemap, RSS, OG images, canonicals).
// NEXT_PUBLIC_SITE_URL wins; on Vercel the production domain is used; local
// builds fall back to localhost.
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000'),
);

// One sentence used by <meta name="description">, Open Graph and the Person JSON-LD.
export const siteDescription =
  'Network Support Technician in Toronto. CCNA & CCST certified. ' +
  'Built from the board up — labs every day in Proxmox, EVE-NG, and Cisco CML.';

export const author = {
  name: 'Rajkumar Neupane',
  url: 'https://rajkumarneupane.com',
  linkedin: 'https://www.linkedin.com/in/rjneupane',
};

// Public source repo, used for "Edit on GitHub" / "Report an issue" links.
export const gitConfig = {
  user: 'raiz-toff',
  repo: 'loopback0',
  branch: 'main',
};

export const githubRepoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

/**
 * Builds a GitHub URL for a file in the public repo.
 *
 * @param path - Repo-relative file path, e.g. `content/blog/foo/index.mdx`.
 * @param mode - `blob` to view the file, `edit` to open GitHub's editor.
 * @returns Absolute GitHub URL.
 */
export function githubFileUrl(path: string, mode: 'blob' | 'edit' = 'blob'): string {
  return `${githubRepoUrl}/${mode}/${gitConfig.branch}/${path}`;
}

/**
 * Builds a prefilled "new issue" URL using the content-feedback form.
 *
 * @param title - Page title, placed in the issue title.
 * @param pageUrl - Site-relative page URL, placed in the form.
 * @returns Absolute GitHub new-issue URL.
 */
export function githubIssueUrl(title: string, pageUrl: string): string {
  const params = new URLSearchParams({
    template: 'content-feedback.yml',
    title: `[Content] ${title}`,
    page: new URL(pageUrl, siteUrl).toString(),
  });
  return `${githubRepoUrl}/issues/new?${params}`;
}
