import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from '@/components/docs/docs-variant';
import { notFound } from 'next/navigation';
import { CheckIcon } from 'lucide-react';
import { getMDXComponents } from '@/components/docs/mdx';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { createRelativeLink } from '@fumadocs/base-ui/mdx';
import { githubFileUrl, githubIssueUrl } from '@/lib/shared';
import { Topology } from '@/components/docs/topology';
import { CautionFrame } from '@/components/docs/hazard';
import { Lightbox } from '@fumadocs/base-ui/components/image-zoom';
export default async function Page(props: PageProps<'/docs/[...slug]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const topology = page.data.topology;
  // Lab pages open with a facts line (build date, tags) and, when the
  // frontmatter lists `covers`, a checklist of what the lab covers.
  const isLab = page.slugs[0] === 'labs' || page.slugs[0] === 'ccna-labs';
  const tags = page.data.tags ?? [];
  const covers = page.data.covers ?? [];
  const built = page.data.date
    ? new Date(page.data.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
    : null;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      {isLab && (built || tags.length > 0) ? (
        // facts line: when the lab was built and what it touches
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-fd-muted-foreground">
          {built ? <span>Built {built}</span> : null}
          {tags.map((tag) => (
            <span key={tag} className="rounded-md border border-fd-border bg-fd-card px-2 py-0.5 font-mono text-[11px]">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      {covers.length > 0 ? (
        <ul className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          {covers.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-fd-primary" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <hr className="border-fd-border" />
      <DocsBody>
        {page.data.construction ? (
          <CautionFrame title="This section is being built.">
            {typeof page.data.construction === 'string'
              ? page.data.construction
              : 'Labs land here as they are written. Check back soon.'}
          </CautionFrame>
        ) : null}
        {topology ? (
          <Topology
            src={topology}
            title={`${page.data.title} — Topology`}
            madeWithMarrow={page.data.marrowNote ?? undefined}
          />
        ) : null}
        <Lightbox>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
        </Lightbox>
      </DocsBody>
      <div className="mt-8 flex flex-row flex-wrap items-center gap-2 border-t pt-6">
        <EditOnGitHub href={githubFileUrl(`content/docs/${page.path}`, 'edit')} />
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={githubFileUrl(`content/docs/${page.path}`)}
        />
        <a
          href={githubIssueUrl(page.data.title, page.url)}
          target="_blank"
          rel="noreferrer noopener"
          className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        >
          Report an issue
        </a>
      </div>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[...slug]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      images: getPageImage(page).url,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: getPageImage(page).url,
    },
  };
}
