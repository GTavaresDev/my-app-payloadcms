import type { News } from "@/payload-types";
import NewsCard from "./NewsCard";

type NewsGridProps = {
  news: News[];
};

export default function NewsGrid({ news }: NewsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
