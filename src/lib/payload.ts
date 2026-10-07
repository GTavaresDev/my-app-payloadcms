import config from "@/payload.config";
import { getPayload } from "payload";

export async function getMedia(slug?: string) {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "media",
    where: slug
      ? {
          "folder.slug": {
            equals: slug,
          },
        }
      : undefined,
    limit: 100,
  });
  return docs;
}

export async function getNews() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "news",
    depth: 1,
    limit: 100,
  });

  return docs;
}

export async function getNewsById(title: string) {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "news",
    depth: 1,
    where: {
      title: {
        equals: title,
      },
    },
    limit: 1,
  });

  return docs[0] || null;
}

