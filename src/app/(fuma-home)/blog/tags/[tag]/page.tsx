import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts, getTagPosts, getTags } from '@/lib/blog-posts';
import { BlogBackLink, BlogCards, BlogDescription, BlogHeader, BlogTitle } from '@/components/blog';

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const { tag } = await props.params;
  const result = getTagPosts(getPosts(), tag);
  if (!result) notFound();

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 px-4 py-12">
      <BlogHeader>
        <BlogBackLink href="/blog/tags">All tags</BlogBackLink>
        <BlogTitle>{result.tag.name}</BlogTitle>
        <BlogDescription>{result.posts.length} matching posts.</BlogDescription>
      </BlogHeader>
      <BlogCards posts={result.posts} />
    </div>
  );
}

export async function generateMetadata(props: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await props.params;
  const result = getTagPosts(getPosts(), tag);
  if (!result) notFound();
  return {
    title: `${result.tag.name} · Blog`,
    description: `Posts tagged ${result.tag.name}.`,
  };
}

export function generateStaticParams(): { tag: string }[] {
  return getTags(getPosts()).map((tag) => ({ tag: tag.slug }));
}
