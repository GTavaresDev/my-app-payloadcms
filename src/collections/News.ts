import type { Access, CollectionConfig } from 'payload'

const getCompanyId = (user: any) => {
  if (!user?.company) return null
  return typeof user.company === 'object' ? user.company.id : user.company
}

const isSuperAdmin = (user: any) => Boolean(user?.roles?.includes('super-admin'))

const canAccessByCompany: Access = ({ req: { user } }) => {
  // Leitura pública permitida para os portais/blogs
  if (!user) return true

  // Super Admin vê todas as notícias
  if (isSuperAdmin(user)) return true

  // Usuário comum autenticado só vê notícias da sua empresa
  const companyId = getCompanyId(user)
  if (!companyId) return false

  return {
    company: {
      equals: companyId,
    },
  }
}

export const News: CollectionConfig = {
  slug: 'news',
  access: {
    read: canAccessByCompany,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (isSuperAdmin(user)) return true
      const companyId = getCompanyId(user)
      if (!companyId) return false
      return {
        company: {
          equals: companyId,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (isSuperAdmin(user)) return true
      const companyId = getCompanyId(user)
      if (!companyId) return false
      return {
        company: {
          equals: companyId,
        },
      }
    },
    create: ({ req: { user } }) => Boolean(user?.company || isSuperAdmin(user)),
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
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
        update: ({ req: { user } }) => isSuperAdmin(user),
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
