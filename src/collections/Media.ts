import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'folder',
      label: "Pasta",
      type: 'relationship',
      relationTo: 'folders',
      hasMany: false,
      admin: {
        position: "sidebar"
      }
    }
  ],
  upload: true,
}
