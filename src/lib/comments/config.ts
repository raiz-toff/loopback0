import { createGithubDiscussionsAdapter } from '@fuma-comment/github-discussions';
import { gitConfig, siteUrl } from '@/lib/shared';
import { getTokenFromRequest } from './github-oauth';
import { fromPageKey } from './page-key';

/** Node id of the public repo `raiz-toff/loopback0` (not a secret). */
const REPO_ID = 'R_kgDOVnvtpQ';
/** Discussions category that holds one thread per page. */
export const COMMENTS_CATEGORY = 'Comments';

/** Storage + auth for fuma-comment: each page's comments live in one GitHub Discussion. */
export const github = createGithubDiscussionsAdapter({
  repo: `${gitConfig.user}/${gitConfig.repo}`,
  repoId: REPO_ID,
  categoryId: process.env.COMMENTS_GITHUB_CATEGORY_ID ?? '',
  category: COMMENTS_CATEGORY,
  ownerLogins: [gitConfig.user],
  readToken: process.env.COMMENTS_GITHUB_READ_TOKEN,
  // Discussion titles are site paths (e.g. /blog/foo), so they stay unique.
  pageToTitle: (page) => fromPageKey(page),
  pageToUrl: (page) => new URL(fromPageKey(page), siteUrl).toString(),
  getToken: getTokenFromRequest,
});
