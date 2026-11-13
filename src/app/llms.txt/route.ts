import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';
import { markdownResponse } from '@/lib/markdown-response';
import { getPosts } from '@/lib/blog-posts';
import { identity } from '@/data/profile';
import { author, githubRepoUrl, siteDescription, siteUrl } from '@/lib/shared';

export const revalidate = false;

const abs = (path: string) => new URL(path, siteUrl).toString();

/**
 * `/llms.txt` (llmstxt.org format): who the site belongs to, then every blog
 * post, then the docs index (labs, CCNA labs, projects) from fumadocs.
 *
 * @returns Markdown with absolute links, so it reads the same out of context.
 */
export function GET() {
  const posts = getPosts()
    .map((post) => `- [${post.title}](${abs(post.url)})${post.description ? `: ${post.description}` : ''}`)
    .join('\n');

  const docsIndex = llms(source)
    .index()
    .replace(/^# Docs\s*/, '')
    .replace(/\]\((\/[^)]*)\)/g, (_, path: string) => `](${abs(path)})`);

  const body = [
    `# ${identity.name}`,
    '',
    `> ${identity.name}: ${identity.role}. ${siteDescription}`,
    '',
    `Personal site of ${identity.name} (${identity.location}): lab guides, CCNA labs, projects and blog posts, all written from his own home lab.`,
    `Every docs page is also available as Markdown at its URL + \`.md\` (for example ${abs('/docs/labs.md')}).`,
    '',
    '## Profiles',
    '',
    `- [Website](${abs('/')})`,
    `- [About](${abs('/about')})`,
    `- [LinkedIn](${author.linkedin})`,
    `- [GitHub: this site's source](${githubRepoUrl})`,
    '',
    '## Blog',
    '',
    posts,
    '',
    '## Docs',
    '',
    docsIndex.trim(),
    '',
  ].join('\n');

  return markdownResponse(body);
}
