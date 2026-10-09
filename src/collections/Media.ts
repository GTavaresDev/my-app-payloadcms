import type { CollectionConfig } from 'payload'

const getCompanyId = (user: any) => {
  if (!user?.company) return null
  return typeof user.company === 'object' ? user.company.id : user.company
}

const isSuperAdmin = (user: any) => Boolean(user?.roles?.includes('super-admin'))

const canAccessByCompany = ({ req: { user } }: { req: { user?: any } }) => {
  // Se não estiver autenticado (ex: requisição pública do blog/site), permite leitura
  if (!user) return true

  // Super Admin tem acesso irrestrito
  if (isSuperAdmin(user)) return true

  // Usuário associado a uma empresa só vê mídias da sua empresa
  const companyId = getCompanyId(user)
  if (!companyId) return false

  return {
    company: {
      equals: companyId,
    },
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: canAccessByCompany,
    update: ({ req: { user } }: { req: { user?: any } }) => {
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
    delete: ({ req: { user } }: { req: { user?: any } }) => {
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
    create: ({ req: { user } }: { req: { user?: any } }) => Boolean(user?.company || isSuperAdmin(user)),
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }: any) => {
        // Ao cadastrar nova mídia, vincula automaticamente à empresa do usuário logado
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
      name: 'alt',
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
      name: 'folder',
      label: 'Pasta',
      type: 'relationship',
      relationTo: 'folders',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  upload: {
    staticDir: 'public/media',
  },
}
