import type { Media } from "@/payload-types";
import PhotoCard from "./PhotoCard";

type PhotosGridProps = {
  photos: Media[];
};

export default function PhotosGrid({ photos }: PhotosGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {photos.map((item) => (
        <PhotoCard key={item.id} item={item} />
      ))}
    </div>
  );
}
