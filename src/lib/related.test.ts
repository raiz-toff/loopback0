import { describe, expect, it } from 'vitest';
import { isRealUpdate, relatedPages, type RelatedCandidate } from './related';

const page = (url: string, title: string, extra: Partial<RelatedCandidate> = {}): RelatedCandidate => ({
  url,
  title,
  kind: 'Post',
  ...extra,
});

describe('relatedPages', () => {
  const pages = [
    page('/blog/eve-ng-setup', 'How to Set Up EVE-NG Community Edition in Proxmox', { tags: ['EVE-NG', 'Proxmox'] }),
    page('/blog/iol-nodes', "Troubleshooting Cisco IOL: Why Your Nodes Won't Start in EVE-NG", { tags: ['Cisco', 'EVE-NG'] }),
    page('/blog/comma', 'Comma: An Earnings Tracker I Built for Gig Workers', { tags: ['Gig Economy'] }),
    page('/docs/labs/vlan-labs/vlan-trunk', 'Trunk Port', { kind: 'Lab', group: '/docs/labs/vlan-labs', description: '802.1Q trunk between two switches' }),
    page('/docs/labs/vlan-labs/access-vlan', 'Access VLAN', { kind: 'Lab', group: '/docs/labs/vlan-labs', description: 'Assign switch ports to VLANs' }),
  ];

  it('ranks pages sharing rare words first and skips the target', () => {
    const result = relatedPages(pages[0], pages, 2).map((p) => p.url);
    expect(result[0]).toBe('/blog/iol-nodes');
    expect(result).not.toContain('/blog/eve-ng-setup');
  });

  it('gives siblings in the same folder a bonus', () => {
    expect(relatedPages(pages[3], pages, 1)[0].url).toBe('/docs/labs/vlan-labs/access-vlan');
  });

  it('returns nothing when no page is related', () => {
    expect(relatedPages(page('/x', 'Kathmandu bakery menu'), pages)).toEqual([]);
  });
});

describe('isRealUpdate', () => {
  const start = new Date('2026-11-09');
  it('ignores the history import date', () => {
    expect(isRealUpdate(new Date('2024-01-01'), new Date('2026-11-09T15:00:00Z'), start)).toBe(false);
  });
  it('ignores edits within a week of publishing', () => {
    expect(isRealUpdate(new Date('2026-11-11'), new Date('2026-11-13'), start)).toBe(false);
  });
  it('shows a later real edit', () => {
    expect(isRealUpdate(new Date('2026-07-23'), new Date('2026-11-13'), start)).toBe(true);
  });
});
