import { APIError, type CollectionConfig, type Field } from "payload";
import sections from "../content/home-sections.json";
import {
  isSuperAdmin,
  superAdmin,
  superAdminField,
} from "../access/tenant";

const immutable = { create: superAdminField, update: superAdminField };

export const SiteSections: CollectionConfig = {
  slug: "site-sections",
  labels: { singular: "Configuração do site", plural: "Componentes legados" },
  admin: {
    useAsTitle: "name",
    hidden: true,
    defaultColumns: ["name", "company", "pageSlug", "sectionKey"],
    group: "Coleções",
  },
  access: {
    read: superAdmin,
    update: superAdmin,
    create: superAdmin,
    delete: superAdmin,
  },
  indexes: [{ fields: ["company", "pageSlug", "sectionKey"], unique: true }],
  fields: [
    {
      name: "name",
      label: "Componente",
      type: "text",
      required: true,
      access: immutable,
    },
    {
      name: "company",
      label: "Empresa",
      type: "relationship",
      relationTo: "companies",
      required: true,
      access: immutable,
      admin: { position: "sidebar" },
    },
    {
      name: "pageSlug",
      label: "Página",
      type: "text",
      required: true,
      defaultValue: "home",
      access: immutable,
      admin: {
        position: "sidebar",
        condition: (_data, _siblings, { user }) => isSuperAdmin(user),
        components: { Cell: "/components/PageCell#PageCell" },
        description: "Identificador interno da página. home corresponde à Página inicial.",
      },
    },
    {
      name: "sectionKey",
      label: "Tipo de componente",
      type: "select",
      required: true,
      access: immutable,
      options: sections.map((s) => ({
        label: `${s.company === "localize" ? "Localize" : "Rastrear"} — ${s.label}`,
        value: s.variant,
      })),
      admin: { position: "sidebar" },
    },
    {
      name: "content",
      label: "Conteúdo",
      type: "group",
      fields: sections.map((section) => ({
        name: section.variant,
        label: section.label,
        type: "group",
        admin: { condition: (data) => data.sectionKey === section.variant },
        fields: section.fields.map((field) =>
          field.type === "upload"
            ? {
                name: field.name,
                label: field.label,
                type: "upload",
                relationTo: "media",
                filterOptions: ({ data }) =>
                  data.company
                    ? {
                        company: {
                          equals:
                            typeof data.company === "object"
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
      async ({ data, originalDoc, req, operation }) => {
        if (!data) return data;
        if (operation === 'update' && !isSuperAdmin(req.user)) {
          for (const field of ["company", "pageSlug", "sectionKey", "name"]) {
            if (!(field in data)) continue;
            const incoming =
              typeof data[field] === "object" ? data[field]?.id : data[field];
            const previous =
              typeof originalDoc[field] === "object"
                ? originalDoc[field]?.id
                : originalDoc[field];
            if (incoming !== previous)
              throw new APIError(
                "Identificadores da seção são restritos ao super-admin.",
                403,
              );
          }
        }
        const company = data.company ?? originalDoc?.company;
        const id = typeof company === "object" ? company.id : company;
        const key = data.sectionKey ?? originalDoc?.sectionKey;
        const section = sections.find((s) => s.variant === key);
        if (!section || !id)
          throw new APIError("Empresa ou seção inválida.", 400);
        const tenant = await req.payload.findByID({
          collection: "companies",
          id,
          depth: 0,
          req,
        });
        if (tenant.slug !== section.company)
          throw new APIError(
            "Esta seção não pertence à empresa selecionada.",
            400,
          );
        // Reject writes to hidden variants too: admin conditions are presentation only.
        for (const [variant, content] of Object.entries(data.content ?? {})) {
          if (
            variant !== key &&
            content &&
            Object.values(content as object).some((v) => v != null && v !== "")
          ) {
            throw new APIError(
              "Conteúdo de outro componente não permitido.",
              400,
            );
          }
        }
        const content = {
          ...originalDoc?.content?.[key],
          ...data.content?.[key],
        };
        for (const field of section.fields.filter((f) => f.type === "upload")) {
          const value = content[field.name];
          if (value == null) continue;
          const media = await req.payload.findByID({
            collection: "media",
            id: typeof value === "object" ? value.id : value,
            depth: 0,
            req,
          });
          const mediaCompany =
            typeof media.company === "object"
              ? media.company?.id
              : media.company;
          if (mediaCompany !== id)
            throw new APIError(
              "A imagem deve pertencer à empresa da seção.",
              400,
            );
        }
        return data;
      },
    ],
  },
};
