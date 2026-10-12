import type { CollectionConfig } from 'payload'
import { superAdmin, superAdminField, tenantRead, tenantUpdate } from '../access/tenant'
import { relationshipID } from '../utilities/relationship-id'

export const SiteComponents: CollectionConfig = {
  slug: 'site-components',
  labels: {
    singular: 'Componente do Site',
    plural: 'Componentes do Site',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'company', 'pageSlug', 'updatedAt'],
    group: 'Conteúdo',
  },
  access: {
    read: tenantRead,
    create: superAdmin,
    delete: superAdmin,
    update: tenantUpdate,
  },
  indexes: [
    {
      fields: ['company', 'pageSlug', 'slug'],
      unique: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const companyId = relationshipID(doc.company)
        if (!companyId) return

        const mediaIds = new Set<number | string>()
        const mainImageId = relationshipID(doc.image)
        if (mainImageId) mediaIds.add(mainImageId)

        if (Array.isArray(doc.fields)) {
          for (const field of doc.fields) {
            const fieldImgId = relationshipID(field?.image)
            if (fieldImgId) mediaIds.add(fieldImgId)
          }
        }

        for (const mId of mediaIds) {
          try {
            const media = await req.payload.findByID({
              collection: 'media',
              id: mId,
              depth: 0,
            })
            if (media && !media.company) {
              await req.payload.update({
                collection: 'media',
                id: mId,
                data: { company: companyId },
              })
            }
          } catch {
            // Silently continue
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      label: 'Nome do Componente',
      type: 'text',
      required: true,
      admin: {
        description: 'Nome legível no painel (ex: Hero Principal, Benefícios, FAQ)',
      },
    },
    {
      name: 'slug',
      label: 'Identificador (Slug)',
      type: 'text',
      required: true,
      access: {
        update: superAdminField,
      },
      admin: {
        description: 'Slug utilizado pelo front-end no código (ex: hero, benefits, contact-form)',
      },
    },
    {
      name: 'pageSlug',
      label: 'Página',
      type: 'text',
      required: true,
      defaultValue: 'home',
      access: {
        update: superAdminField,
      },
      admin: {
        position: 'sidebar',
        description: 'Identificador da página onde este componente aparece (ex: home, logistica)',
      },
    },
    {
      name: 'company',
      label: 'Empresa',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      access: {
        update: superAdminField,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      label: 'Título',
      type: 'text',
    },
    {
      name: 'subtitle',
      label: 'Subtítulo / Pré-título',
      type: 'text',
    },
    {
      name: 'content',
      label: 'Conteúdo / Descrição',
      type: 'textarea',
    },
    {
      name: 'image',
      label: 'Imagem Principal',
      type: 'upload',
      relationTo: 'media',
      filterOptions: ({ data, siblingData }) => {
        const company = (data as Record<string, unknown> | undefined)?.company ?? (siblingData as Record<string, unknown> | undefined)?.company
        const companyId = relationshipID(company as string | number | { id?: string | number } | null | undefined)
        if (!companyId) return true
        return {
          or: [
            { company: { equals: companyId } },
            { company: { exists: false } },
          ],
        }
      },
    },
    {
      name: 'fields',
      label: 'Campos Extras (Opcional)',
      type: 'array',
      labels: {
        singular: 'Campo',
        plural: 'Campos Extras',
      },
      fields: [
        {
          name: 'key',
          label: 'Identificador (Chave)',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          label: 'Nome de Exibição',
          type: 'text',
        },
        {
          name: 'value',
          label: 'Texto / Valor',
          type: 'textarea',
        },
        {
          name: 'image',
          label: 'Imagem',
          type: 'upload',
          relationTo: 'media',
          filterOptions: ({ data }) => {
            const company = (data as Record<string, unknown> | undefined)?.company
            const companyId = relationshipID(company as string | number | { id?: string | number } | null | undefined)
            if (!companyId) return true
            return {
              or: [
                { company: { equals: companyId } },
                { company: { exists: false } },
              ],
            }
          },
        },
      ],
      admin: {
        description: 'Permite cadastrar textos e imagens complementares para este componente sem alterar o código do CMS.',
      },
    },
  ],
}
