import { NextComment } from '@fuma-comment/server/next';
import { github } from '@/lib/comments/config';

// role "database" lets ownerLogins delete any comment.
export const { GET, POST, PATCH, DELETE } = NextComment({
  role: 'database',
  mention: { enabled: true },
  ...github,
});
