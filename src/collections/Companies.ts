import { companyID, isSuperAdmin } from '../access/tenant'
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
    group: 'Opções',
    hidden: ({ user }: { user?: any }) => !user?.roles?.includes('super-admin'),
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user || isSuperAdmin(user)) return true
      const id = companyID(user)
      return id ? { id: { equals: id } } : false
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
      label: 'Identificador',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
