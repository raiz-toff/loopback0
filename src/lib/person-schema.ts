import { certInterfaces, identity, links } from '@/data/profile';
import { author, siteDescription, siteUrl } from '@/lib/shared';

// One Person entity for the whole site. Every JSON-LD block that names the
// author points at PERSON_ID, so search engines and AI engines merge the home
// page, /about, posts and labs into one person.
//
// No jobTitle: identity.role is a target-role headline, and schema.org jobTitle
// means a job currently held (the user's current job is not a network role).

/** Stable node id of the site owner. */
export const PERSON_ID = new URL('/#person', siteUrl).toString();
/** Stable node id of the website. */
export const WEBSITE_ID = new URL('/#website', siteUrl).toString();

/** Compact reference used as `author` / `publisher` / `mainEntity` elsewhere. */
export const personRef = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: identity.name,
  url: siteUrl.toString(),
} as const;

const CISCO = { '@type': 'Organization', name: 'Cisco', url: 'https://www.cisco.com' } as const;

/** The CCNA and CCST certifications, from the same data the home page shows. */
const credentials = certInterfaces
  .filter((c) => c.issuer === 'cisco' && /^(CCNA|CCST)\b/.test(c.desc))
  .map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    name: c.desc,
    credentialCategory: 'certification',
    recognizedBy: CISCO,
    ...(c.href ? { url: c.href } : {}),
  }));

/** Full Person node (home page and /about). */
export const personNode = {
  ...personRef,
  image: new URL('/img/portrait.jpg', siteUrl).toString(),
  description: siteDescription,
  address: { '@type': 'PostalAddress', addressLocality: 'Toronto', addressRegion: 'ON', addressCountry: 'CA' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Canadore College' },
  hasCredential: credentials,
  knowsAbout: [
    'Cisco IOS',
    'Routing and switching',
    'VLANs and 802.1Q trunking',
    'Network troubleshooting',
    'Network operations (NOC)',
    'Proxmox VE',
    'EVE-NG',
    'Cisco Modeling Labs',
    'MikroTik RouterOS',
    'Windows Server',
  ],
  sameAs: [links.github, author.linkedin, links.credly],
};

/** WebSite node; its publisher is the person. */
export const websiteNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: siteUrl.toString(),
  name: identity.name,
  description: siteDescription,
  inLanguage: 'en-CA',
  publisher: { '@id': PERSON_ID },
};

/**
 * Serialises a JSON-LD object for a `<script type="application/ld+json">`.
 *
 * @param data - Any JSON-LD node or graph.
 * @returns JSON with `<` escaped so the script element cannot be closed early.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
