import BlogIndex from '@/components/blog/BlogIndex';
import { isEditor } from '@/lib/auth';
import { getCollectionItems } from '@/lib/content';

export const metadata = {
  title: 'Blogs · Tristan Spear',
};

export default async function BlogsPage() {
  const [blogs, canEdit] = await Promise.all([getCollectionItems('blogs'), isEditor()]);

  return <BlogIndex blogs={blogs} canEdit={canEdit} />;
}
