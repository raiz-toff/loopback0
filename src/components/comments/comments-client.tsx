'use client';

import { useSyncExternalStore } from 'react';
import { Comments } from '@fuma-comment/react';

const SIGNED_IN_COOKIE = 'fc_gh_signed_in';

// The cookie only changes across a full-page redirect, so there is nothing to subscribe to.
const noSubscribe = () => () => {};
const readSignedIn = () => document.cookie.split('; ').includes(`${SIGNED_IN_COOKIE}=1`);

/** Whether the reader is signed in (from the readable flag cookie; `false` during SSR). */
function useSignedIn(): boolean {
  return useSyncExternalStore(noSubscribe, readSignedIn, () => false);
}

/** Full-page load of a sign-in route: these are API routes that redirect to and from GitHub. */
function goToAuth(action: 'login' | 'logout') {
  const url = new URL(`/api/comments/oauth/${action}`, window.location.origin);
  url.searchParams.set('return', window.location.href);
  window.location.assign(url);
}

const label = 'font-mono text-[11px] uppercase tracking-[0.14em] text-fd-muted-foreground';
const action = `${label} transition-colors hover:text-fd-foreground`;

/**
 * Comment section: one label row (COMMENTS · GitHub ↗ · Sign out) over the widget.
 * Formatting buttons stay hidden until the editor is used (see `.rn-comments` in globals.css).
 *
 * @param page - Thread key from `toPageKey`.
 * @param discussionsUrl - Link to the Discussions category on GitHub.
 */
export function CommentsClient({ page, discussionsUrl }: { page: string; discussionsUrl: string }) {
  const signedIn = useSignedIn();

  return (
    <div className="rn-comments flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="comments-heading" className={label}>
          Comments
        </h2>
        <div className="flex items-baseline gap-4">
          <a href={discussionsUrl} target="_blank" rel="noreferrer noopener" className={action}>
            GitHub ↗
          </a>
          {signedIn ? (
            <button type="button" onClick={() => goToAuth('logout')} className={action}>
              Sign out
            </button>
          ) : null}
        </div>
      </div>
      <Comments
        page={page}
        apiUrl="/api/comments"
        mention={{ enabled: true }}
        auth={{ type: 'api', signIn: () => goToAuth('login') }}
        editor={{ placeholder: 'Leave a comment…' }}
        className="w-full"
      />
    </div>
  );
}
