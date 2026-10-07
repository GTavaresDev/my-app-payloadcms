import { getNews } from "@/lib/payload";
import NotNews from "./_components/NotNews";
import NewsHeader from "./_components/NewsHeader";
import NewsGrid from "./_components/NewsGrid";

export const dynamic = 'force-dynamic'

export default async function NoticiasPage() {
  const news = await getNews();

  if (!news || news.length === 0) {
    return <NotNews />;
  }

  return (
    <div className="min-h-[70vh] bg-zinc-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <NewsHeader />
        <NewsGrid news={news} />
      </div>
    </div>
  );
}


