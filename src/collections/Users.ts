import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'company', 'roles'],
  },
  auth: true,
  access: {
    // Super-admin pode listar todos os usuários, usuário comum só vê o próprio
    read: ({ req: { user } }: { req: { user?: any } }) => {
      if (!user) return false
      if (user.roles?.includes('super-admin')) return true
      return {
        id: {
          equals: user.id,
        },
      }
    },
    update: ({ req: { user } }: { req: { user?: any } }) => {
      if (!user) return false
      if (user.roles?.includes('super-admin')) return true
      return {
        id: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }: { req: { user?: any } }) => Boolean(user?.roles?.includes('super-admin')),
    create: ({ req: { user } }: { req: { user?: any } }) => Boolean(user?.roles?.includes('super-admin')),
  },
  fields: [
    {
      name: 'roles',
      label: 'Permissões',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Company Admin', value: 'company-admin' },
        { label: 'Usuário', value: 'user' },
      ],
      access: {
        update: ({ req: { user } }: { req: { user?: any } }) => Boolean(user?.roles?.includes('super-admin')),
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'company',
      label: 'Empresa',
      type: 'relationship',
      relationTo: 'companies',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
