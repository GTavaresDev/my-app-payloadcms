import type { CollectionConfig } from 'payload'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }: { req: { user?: any } }) => Boolean(user?.roles?.includes('super-admin')),
    update: ({ req: { user } }: { req: { user?: any } }) => Boolean(user?.roles?.includes('super-admin')),
    delete: ({ req: { user } }: { req: { user?: any } }) => Boolean(user?.roles?.includes('super-admin')),
  },
  fields: [
    {
      name: 'name',
      label: 'Nome da Empresa',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Identificador (Slug)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
