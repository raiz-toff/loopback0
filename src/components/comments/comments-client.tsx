'use client';

import { useSyncExternalStore } from 'react';
import { Comments } from '@fuma-comment/react';

const SIGNED_IN_COOKIE = 'fc_gh_signed_in';

// The cookie only changes across a full-page redirect, so there is nothing to subscribe to.
const noSubscribe = () => () => {};
const readSignedIn = () => document.cookie.split('; ').includes(`${SIGNED_IN_COOKIE}=1`);

/** Full-page load of a sign-in route: these are API routes that redirect to and from GitHub. */
function goToAuth(action: 'login' | 'logout') {
  const url = new URL(`/api/comments/oauth/${action}`, window.location.origin);
  url.searchParams.set('return', window.location.href);
  window.location.assign(url);
}

/**
 * fuma-comment widget wired to the GitHub sign-in routes under `/api/comments/oauth`.
 *
 * @param page - Thread key; the page's site path, e.g. `/blog/my-post`.
 * @param discussionsUrl - Link to the Discussions category on GitHub.
 */
export function CommentsClient({ page, discussionsUrl }: { page: string; discussionsUrl: string }) {
  const signedIn = useSyncExternalStore(noSubscribe, readSignedIn, () => false);

  return (
    <>
      <Comments
        page={page}
        apiUrl="/api/comments"
        mention={{ enabled: true }}
        auth={{
          type: 'api',
          signIn: () => goToAuth('login'),
        }}
        className="w-full"
      />
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fd-muted-foreground">
        <span>Comments are stored in GitHub Discussions. Sign in with GitHub to post.</span>
        <a href={discussionsUrl} target="_blank" rel="noreferrer noopener" className="underline underline-offset-4 transition-colors hover:text-fd-foreground">
          View on GitHub
        </a>
        {signedIn ? (
          <button
            type="button"
            onClick={() => goToAuth('logout')}
            className="underline underline-offset-4 transition-colors hover:text-fd-foreground"
          >
            Sign out
          </button>
        ) : null}
      </p>
    </>
  );
}
