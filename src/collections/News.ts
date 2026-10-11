import { superAdmin } from '../access/tenant'
import type { CollectionConfig } from 'payload'

const getCompanyId = (user: any) => {
  if (!user?.company) return null
  return typeof user.company === 'object' ? user.company.id : user.company
}

const isSuperAdmin = (user: any) => Boolean(user?.roles?.includes('super-admin'))

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: 'Notícia',
    plural: 'Notícias',
  },
  admin: {
    group: 'Coleções',
    hidden: true,
  },
  access: { read: superAdmin, create: superAdmin, update: superAdmin, delete: superAdmin },
  hooks: {
    beforeChange: [
      ({ req, data, operation }: any) => {
        // Ao cadastrar nova notícia, vincula automaticamente à empresa do usuário
        if (operation === 'create' && req.user) {
          const companyId = getCompanyId(req.user)
          if (companyId && (!isSuperAdmin(req.user) || !data.company)) {
            return {
              ...data,
              company: companyId,
            }
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      label: 'Conteúdo',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      label: 'Empresa',
      type: 'relationship',
      relationTo: 'companies',
      admin: {
        position: 'sidebar',
      },
      access: {
        update: ({ req: { user } }: { req: { user?: any } }) => isSuperAdmin(user),
      },
    },
    {
      name: 'imagem',
      label: 'Imagem de Capa',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
