import type { CollectionConfig } from "payload";

export const News: CollectionConfig = {
  slug: "news",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "content",
      type: "text",
      required: true,
    },
    {
      name: "imagem",
      label: "imagem",
      type: "relationship",
      relationTo: "media",
      hasMany: false,
      admin: {
        position: "sidebar",
      },
    },
  ],
};
