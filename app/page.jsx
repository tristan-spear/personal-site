import HomeContent from '@/components/home/HomeContent';
import { isEditor } from '@/lib/auth';
import { getCollectionItems, getPageContent } from '@/lib/content';
import './home.css';

async function Home() {
  const [content, timeline, canEdit] = await Promise.all([
    getPageContent('home'),
    getCollectionItems('timeline'),
    isEditor(),
  ]);

  return <HomeContent content={content} timeline={timeline} canEdit={canEdit} />;
}

export default Home;
