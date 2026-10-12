import type { CollectionConfig } from 'payload'

import { companyID, isSuperAdmin, tenantRead, tenantUpdate, superAdminField } from '../access/tenant'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Mídia',
    plural: 'Mídias',
  },
  admin: {
    group: 'Opções',
    hidden: true,
  },
  access: {
    read: tenantRead,
    update: tenantUpdate,
    delete: tenantUpdate,
    create: ({ req: { user } }) => Boolean(user?.company || isSuperAdmin(user)),
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        // Ao cadastrar nova mídia, vincula automaticamente à empresa do usuário logado
        if (operation === 'create' && req.user) {
          const companyId = companyID(req.user)
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
      label: 'Texto Alternativo',
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
        update: superAdminField,
      },
    },
  ],
  upload: {
    staticDir: 'public/media',
  },
}
