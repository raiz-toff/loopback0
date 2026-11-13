import { githubRepoUrl } from '@/lib/shared';
import { toPageKey } from '@/lib/comments/page-key';
import { CommentsClient } from './comments-client';

/**
 * Comment section for a blog post or lab page. Renders nothing until the
 * GitHub sign-in and Discussions category are configured (see `.env.example`).
 *
 * @param page - The page's site path (e.g. `/blog/my-post`). One GitHub Discussion per path.
 */
export function PageComments({ page, className }: { page: string; className?: string }) {
  if (!process.env.COMMENTS_GITHUB_CLIENT_ID || !process.env.COMMENTS_GITHUB_CATEGORY_ID) return null;

  return (
    <section id="comments" aria-labelledby="comments-heading" className={className}>
      <CommentsClient page={toPageKey(page)} discussionsUrl={`${githubRepoUrl}/discussions/categories/comments`} />
    </section>
  );
}
