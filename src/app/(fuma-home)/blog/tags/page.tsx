import type { Metadata } from 'next';
import { getPosts, getTags } from '@/lib/blog-posts';
import { BlogBackLink, BlogDescription, BlogHeader, BlogTagCards, BlogTitle } from '@/components/blog';

export const metadata: Metadata = {
  title: 'Blog tags',
  description: 'Every tag used across the blog.',
};

export default function TagsPage() {
  const tags = getTags(getPosts());

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 px-4 py-12">
      <BlogHeader>
        <BlogBackLink href="/blog" />
        <BlogTitle>All tags</BlogTitle>
        <BlogDescription>{tags.length} tags in total.</BlogDescription>
      </BlogHeader>
      <BlogTagCards tags={tags} />
    </div>
  );
}
