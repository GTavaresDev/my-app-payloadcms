import { pathToFileURL, fileURLToPath } from 'node:url'
import { getPayload, type Payload } from 'payload'
import type { SiteSetting } from '../payload-types'
import config from '../payload.config'
import sections from '../companys/home-sections'
import { sitePages } from '../companys/site-pages'

/** Copy legacy content into page documents without overwriting existing edits. */
export async function seedPages(payload: Payload) {
  for (const page of sitePages) {
    const companies = await payload.find({
      collection: 'companies',
      where: { slug: { equals: page.company } },
      limit: 1,
    })
    const company =
      companies.docs[0] ??
      (await payload.create({
        collection: 'companies',
        data: {
          slug: page.company,
          name: page.company === 'localize' ? 'Localize' : 'Rastrear',
        },
      }))
    const found = await payload.find({
      collection: 'site-settings',
      where: {
        and: [
          { company: { equals: company.id } },
          { pageSlug: { equals: page.slug } },
        ],
      },
      limit: 1,
      depth: 0,
    })
    const document = found.docs[0]
    const content: Record<string, Record<string, unknown>> = {}
    let changed = false
    for (const variant of page.sections) {
      const section = sections.find((s) => s.variant === variant)!
      const current =
        document?.content?.[
          variant as keyof NonNullable<SiteSetting['content']>
        ] ?? {}
      const values: Record<string, unknown> = { ...current }
      for (const field of section.fields) {
        // Explicit null/empty values are edits too and must survive migration.
        if (Object.hasOwn(current, field.name)) continue
        if (field.type !== 'upload')
          values[field.name] = field.defaultValue
        else {
          const image = field as typeof field & {
            defaultFilename?: string
            defaultAlt?: string
          }
          if (!image.defaultFilename)
            throw new Error(`Imagem inicial ausente: ${variant}.${field.name}`)
          const foundMedia = await payload.find({
            collection: 'media',
            where: {
              and: [
                { company: { equals: company.id } },
                { filename: { equals: image.defaultFilename } },
              ],
            },
            limit: 1,
            depth: 0,
          })
          const media =
            foundMedia.docs[0] ??
            (await payload.create({
              collection: 'media',
              data: {
                company: company.id,
                alt: image.defaultAlt || section.label,
              },
              filePath: fileURLToPath(
                new URL(
                  `../companys/assets/${image.defaultFilename}`,
                  import.meta.url,
                ),
              ),
            }))
          values[field.name] = media.id
        }
        changed = true
      }
      content[variant] = values
    }
    if (!document)
      await payload.create({
        collection: 'site-settings',
        data: {
          name: page.name,
          company: company.id,
          pageKey: page.key,
          pageSlug: page.slug,
          route: page.route,
          content,
        },
      })
    else if (changed)
      await payload.update({
        collection: 'site-settings',
        id: document.id,
        data: { content },
      })
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.env.PAYLOAD_MIGRATING = 'true'
  const payload = await getPayload({ config })
  let exitCode = 0
  try {
    await seedPages(payload)
  } catch (error) {
    console.error(error)
    exitCode = 1
  } finally {
    await payload.destroy()
  }
  process.exit(exitCode)
}
