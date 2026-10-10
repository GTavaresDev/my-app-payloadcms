import type { CollectionConfig } from 'payload'

export const Companies: CollectionConfig = {
  slug: 'companies',
  labels: {
    singular: 'Empresa',
    plural: 'Empresas',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Coleções',
    hidden: ({ user }: { user?: any }) => !user?.roles?.includes('super-admin'),
  },
  access: {
    read: ({ req: { user } }: { req: { user?: any } }) => {
      // Requisições públicas (frontends dos sites) podem ler para identificar o tenant
      if (!user) return true
      // No painel administrativo, apenas super-admin pode visualizar empresas
      return Boolean(user?.roles?.includes('super-admin'))
    },
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
