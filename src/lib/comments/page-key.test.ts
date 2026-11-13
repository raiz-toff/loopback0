import { describe, expect, it } from 'vitest';
import { fromPageKey, toPageKey } from './page-key';

describe('comment page keys', () => {
  it('turns a site path into one URL segment and back', () => {
    for (const path of ['/blog/ccna-journey', '/docs/labs/campus-network', '/docs/ccna-labs/vlans/trunking']) {
      const key = toPageKey(path);
      expect(key).not.toContain('/');
      expect(fromPageKey(key)).toBe(path);
    }
  });

  it('ignores trailing slashes', () => {
    expect(toPageKey('/blog/x/')).toBe('blog~x');
  });
});
