import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/docs/mdx';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { githubFileUrl, githubIssueUrl } from '@/lib/shared';
import { Topology } from '@/components/docs/topology';
import { Lightbox } from 'fumadocs-ui/components/image-zoom';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { PublishBottomNav, type BottomNavAction, type BottomNavLink } from '@/components/bottom-nav/context';

type FrontmatterLink = { name?: string; url?: string };

function toNavLink(item: { name: ReactNode; url: string } | undefined): BottomNavLink | undefined {
  if (!item) return undefined;
  return { label: typeof item.name === 'string' ? item.name : 'Page', href: item.url };
}

function primaryAction(links: unknown): BottomNavAction | undefined {
  const first = Array.isArray(links) ? (links[0] as FrontmatterLink | undefined) : undefined;
  if (!first?.url || !first.name) return undefined;
  const isFile = /\.(ya?ml|pkt|zip|pdf|json|txt)$/i.test(first.url);
  return { kind: 'link', label: first.name, href: first.url, icon: isFile ? 'download' : 'external' };
}

export default async function Page(props: PageProps<'/docs/[...slug]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const topology = page.data.topology;
  const neighbours = findNeighbour(source.pageTree, page.url);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <PublishBottomNav
        toc={page.data.toc}
        prev={toNavLink(neighbours.previous)}
        next={toNavLink(neighbours.next)}
        primary={primaryAction(page.data.links)}
        showSearch={false}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={githubFileUrl(`content/docs/${page.path}`)}
        />
      </div>
      <DocsBody>
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
      <div className="mt-8 flex flex-row items-center gap-2 border-t pt-6">
        <EditOnGitHub href={githubFileUrl(`content/docs/${page.path}`, 'edit')} />
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
