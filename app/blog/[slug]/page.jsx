import { notFound } from 'next/navigation';
import BlogFeed from '@/components/blog/BlogFeed';
import { isEditor } from '@/lib/auth';
import { getCollectionItems } from '@/lib/content';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blogs = await getCollectionItems('blogs');
  const blog = blogs.find((item) => item.slug === slug);
  return { title: blog ? `${blog.title} · Tristan Spear` : 'Blog · Tristan Spear' };
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  const [blogs, posts, canEdit] = await Promise.all([
    getCollectionItems('blogs'),
    getCollectionItems('blog_posts'),
    isEditor(),
  ]);
  const blog = blogs.find((item) => item.slug === slug);
  if (!blog) notFound();

  return (
    <BlogFeed
      blog={blog}
      posts={posts.filter((post) => post.blog_slug === slug)}
      canEdit={canEdit}
    />
  );
}
