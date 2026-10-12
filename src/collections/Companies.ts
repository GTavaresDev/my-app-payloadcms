import { companyID, isSuperAdmin } from '../access/tenant'
import type { CollectionConfig } from 'payload'
import { superAdmin, superAdminField } from '../access/tenant'
import { createCompanyToken } from '../access/company-token'

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
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user || isSuperAdmin(user)) return true
      const id = companyID(user)
      return id ? { id: { equals: id } } : false
    },
    create: superAdmin,
    update: superAdmin,
    delete: superAdmin,
  },
  hooks: {
    beforeValidate: [({ data, originalDoc, operation }) => {
      if (data) data.token = operation === 'create' ? createCompanyToken() : originalDoc?.token || createCompanyToken()
      return data
    }],
  },
  fields: [
    {
      name: 'token',
      label: 'Token de acesso do site',
      type: 'text',
      unique: true,
      access: { read: superAdminField, create: () => false, update: () => false },
      admin: {
        readOnly: true,
        description: 'Gerado automaticamente. Configure como COMPANY_TOKEN no servidor do site. Não compartilhe.',
        condition: (_data, _siblings, { user }) => isSuperAdmin(user),
      },
    },
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
