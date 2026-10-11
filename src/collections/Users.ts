import { APIError, type Access, type CollectionConfig, type Where } from 'payload'
import { companyID, isSuperAdmin, superAdmin, superAdminField } from '../access/tenant'

const manageCompanyUsers: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  const company = companyID(user)
  if (!company) return false
  const where: Where = { and: [
    { company: { equals: company } },
    { roles: { not_in: ['super-admin'] } },
  ] }
  return where
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email'],
    group: 'Opções',
  },
  auth: true,
  access: {
    read: manageCompanyUsers,
    update: manageCompanyUsers,
    create: ({ req: { user } }) => Boolean(user && (isSuperAdmin(user) || companyID(user))),
    delete: superAdmin,
  },
  hooks: {
    beforeValidate: [({ data, originalDoc, operation, req }) => {
      if (!data || isSuperAdmin(req.user)) return data
      const company = companyID(req.user)
      if (!company) throw new APIError('Usuário sem empresa não pode gerenciar usuários.', 403)
      if (operation === 'create') {
        // Server-owned values override even a forged API request.
        return { ...data, company, roles: ['user'] }
      }
      const targetCompany = typeof originalDoc?.company === 'object' ? originalDoc.company?.id : originalDoc?.company
      if (targetCompany !== company || isSuperAdmin(originalDoc)) {
        throw new APIError('Você só pode gerenciar usuários comuns da sua empresa.', 403)
      }
      // Preserve existing identity and permissions on updates, including requests
      // made through the Local API with access overrides.
      return { ...data, company: targetCompany, roles: originalDoc.roles }
    }],
  },
  fields: [
    {
      name: 'roles',
      label: 'Permissões',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        { label: 'Administrador geral', value: 'super-admin' },
        { label: 'Administrador da empresa', value: 'company-admin' },
        { label: 'Usuário', value: 'user' },
      ],
      access: { read: superAdminField, create: superAdminField, update: superAdminField },
      admin: {
        position: 'sidebar',
        condition: (_data, _siblingData, { user }) => isSuperAdmin(user),
      },
    },
    {
      name: 'company',
      label: 'Empresa',
      type: 'relationship',
      relationTo: 'companies',
      access: { create: superAdminField, update: superAdminField },
      admin: {
        position: 'sidebar',
        condition: (_data, _siblingData, { user }) => isSuperAdmin(user),
      },
    },
  ],
}
