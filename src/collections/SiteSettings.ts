import { APIError, type CollectionConfig, type Field } from 'payload'
import sections from '../content/home-sections.json'
import { sitePages } from '../content/site-pages'
import {
  isSuperAdmin,
  superAdmin,
  superAdminField,
  tenantRead,
  tenantUpdate,
} from '../access/tenant'

const immutable = { create: superAdminField, update: superAdminField }
export const SiteSettings: CollectionConfig = {
  slug: 'site-settings',
  labels: { singular: 'Página do site', plural: 'Configurações do site' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'route', 'company'],
    group: 'Coleções',
    components: {
      beforeListTable: ['/components/RouteFolders#RouteFolders'],
    },
  },
  access: {
    read: tenantRead,
    update: tenantUpdate,
    create: superAdmin,
    delete: superAdmin,
  },
  indexes: [{ fields: ['company', 'pageSlug'], unique: true }],
  fields: [
    {
      name: 'name',
      label: 'Página',
      type: 'text',
      required: true,
      access: immutable,
    },
    {
      name: 'company',
      label: 'Empresa',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      access: immutable,
      admin: { position: 'sidebar' },
    },
    {
      name: 'pageKey',
      label: 'Página do site',
      type: 'select',
      required: true,
      access: immutable,
      options: sitePages.map((p) => ({
        label: `${p.company === 'localize' ? 'Localize' : 'Rastrear'} — ${p.name}`,
        value: p.key,
      })),
      admin: {
        position: 'sidebar',
        condition: (_data, _siblings, { user }) => isSuperAdmin(user),
      },
    },
    {
      name: 'pageSlug',
      label: 'Identificador da página',
      type: 'text',
      required: true,
      access: immutable,
      admin: {
        position: 'sidebar',
        condition: (_data, _siblings, { user }) => isSuperAdmin(user),
      },
    },
    {
      name: 'route',
      label: 'Rota',
      type: 'text',
      required: true,
      access: immutable,
      admin: { position: 'sidebar' },
    },
    {
      name: 'componentView',
      label: 'Componentes da página',
      type: 'ui',
      admin: {
        condition: (data) => data.pageKey === 'localize-home',
        components: { Field: '/components/ComponentFolders#ComponentFolders' },
      },
    },
    {
      name: 'content',
      label: false,
      type: 'group',
      fields: sections.map((section) => ({
        name: section.variant,
        label:
          section.variant === 'rasGallery'
            ? 'Galeria operacional'
            : section.label,
        type: 'group',
        admin: {
          condition: (data) =>
            sitePages.some(
              (p) =>
                p.key === data.pageKey &&
                p.sections.includes(section.variant as never),
            ),
        },
        fields: section.fields.map((field) =>
          field.type === 'upload'
            ? {
                name: field.name,
                label: field.label,
                type: 'upload',
                relationTo: 'media',
                filterOptions: ({ data }) =>
                  data.company
                    ? {
                        company: {
                          equals:
                            typeof data.company === 'object'
                              ? data.company.id
                              : data.company,
                        },
                      }
                    : false,
              }
            : { name: field.name, label: field.label, type: field.type },
        ) as Field[],
      })) as Field[],
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, operation, req }) => {
        if (!data) return data
        if (operation === 'update' && req.user && !isSuperAdmin(req.user)) {
          for (const field of [
            'name',
            'company',
            'pageKey',
            'pageSlug',
            'route',
          ]) {
            if (!(field in data)) continue
            const incoming =
              typeof data[field] === 'object' ? data[field]?.id : data[field]
            const previous =
              typeof originalDoc?.[field] === 'object'
                ? originalDoc[field]?.id
                : originalDoc?.[field]
            if (incoming !== previous)
              throw new APIError(
                'A estrutura da página é restrita ao administrador geral.',
                403,
              )
          }
        }
        const key = data.pageKey ?? originalDoc?.pageKey
        const page = sitePages.find((p) => p.key === key)
        if (!page) throw new APIError('Página inválida.', 400)
        const company = data.company ?? originalDoc?.company
        const id = typeof company === 'object' ? company?.id : company
        if (!id) throw new APIError('Empresa obrigatória.', 400)
        const tenant = await req.payload.findByID({
          collection: 'companies',
          id,
          depth: 0,
          req,
        })
        if (tenant.slug !== page.company)
          throw new APIError(
            'A página não pertence à empresa selecionada.',
            400,
          )
        if (operation === 'create') {
          data.pageSlug = page.slug
          data.route = page.route
          data.name ??= page.name
        } else if (
          (data.pageSlug ?? originalDoc?.pageSlug) !== page.slug ||
          (data.route ?? originalDoc?.route) !== page.route
        ) {
          throw new APIError(
            'A rota deve corresponder à página configurada.',
            400,
          )
        }
        for (const [variant, incoming] of Object.entries(data.content ?? {})) {
          if (
            !page.sections.includes(variant as never) &&
            incoming &&
            Object.values(incoming as object).some((v) => v != null && v !== '')
          ) {
            throw new APIError('Este componente não pertence à página.', 400)
          }
        }
        for (const variant of page.sections) {
          const content = {
            ...originalDoc?.content?.[variant],
            ...data.content?.[variant],
          }
          for (const field of sections
            .find((s) => s.variant === variant)!
            .fields.filter((f) => f.type === 'upload')) {
            const value = content[field.name]
            if (value == null) continue
            const media = await req.payload.findByID({
              collection: 'media',
              id: typeof value === 'object' ? value.id : value,
              depth: 0,
              req,
            })
            const owner =
              typeof media.company === 'object'
                ? media.company?.id
                : media.company
            if (owner !== id)
              throw new APIError(
                'A imagem deve pertencer à empresa da página.',
                400,
              )
          }
        }
        return data
      },
    ],
  },
}
