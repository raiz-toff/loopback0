import type { Metadata } from 'next';
import { siteDescription } from '@/lib/shared';

/** Default page title: name plus the target-role headline (not a job title held). */
export const siteTitle = 'Rajkumar Neupane — CCNA · Network Support & NOC';

/**
 * Site-wide Open Graph defaults. Used by the root layout, and spread by any page
 * that sets its own `openGraph` (a page's openGraph replaces the layout's whole
 * object, so it must carry these fields itself).
 */
export const siteOpenGraph = {
  type: 'website',
  siteName: 'Rajkumar Neupane',
  title: siteTitle,
  description: siteDescription,
  images: [
    {
      url: '/social.png',
      width: 2848,
      height: 1504,
      alt: 'RN monogram built from the 8 twisted-pair conductors in T568B order — Rajkumar Neupane, CCNA · Network Support',
    },
  ],
} satisfies NonNullable<Metadata['openGraph']>;
