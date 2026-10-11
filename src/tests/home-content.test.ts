import { getPayloadUrl, resolveMediaUrl } from '../../../localize/src/lib/cms-url'
import assert from 'node:assert/strict'
import test from 'node:test'
import { tenantRead, tenantUpdate, superAdmin } from '../access/tenant'
import { SiteSettings } from '../collections/SiteSettings'
import { createCompanyToken, siteContentRead } from '../access/company-token'
import { Companies } from '../collections/Companies'
import { Users } from '../collections/Users'
import { seedPages } from '../scripts/seed-pages'
import { sitePages } from '../companys/site-pages'
import type {
  Payload,
  PayloadRequest,
  CollectionBeforeValidateHook,
} from 'payload'
import { getHomeData as localizeHome } from '../../../localize/src/lib/payload'
import {
  getHomeData as rastrearHome,
  getLogisticsData,
} from '../../../rastrear/src/lib/payload'
import {
  contentText,
  contentImage,
  contentAlt,
} from '../../../localize/src/lib/site-content'

const user = { id: 7, roles: ['user'], company: 1 }
const req = (u: unknown) => ({ user: u }) as PayloadRequest

test('page access isolates companies and protects page structure', async () => {
  assert.equal(await tenantRead({ req: req(null) }), true)
  assert.deepEqual(await tenantRead({ req: req(user) }), {
    company: { equals: 1 },
  })
  assert.equal(await tenantUpdate({ req: req(null) }), false)
  assert.equal(SiteSettings.access?.create, superAdmin)
  assert.equal(SiteSettings.access?.delete, superAdmin)
  assert.deepEqual(SiteSettings.indexes, [
    { fields: ['company', 'pageSlug'], unique: true },
  ])
  for (const name of ['name', 'company', 'pageKey', 'pageSlug', 'route']) {
    const field = SiteSettings.fields.find(
      (f) => 'name' in f && f.name === name,
    )
    assert.ok(field && 'access' in field)
    assert.equal(
      await field.access!.update!({ req: req(user) } as never),
      false,
    )
  }
})

test('page validation rejects foreign components, companies, routes and media', async () => {
  const hook = SiteSettings.hooks!
    .beforeValidate![0] as CollectionBeforeValidateHook
  const originalDoc = {
    name: 'Logística',
    company: 1,
    pageKey: 'rastrear-logistica',
    pageSlug: 'logistica',
    route: '/logistica',
  }
  const request = {
    ...req(user),
    payload: {
      findByID: async ({ collection }: { collection: string }) =>
        collection === 'companies'
          ? { id: 1, slug: 'rastrear' }
          : { id: 4, company: 2 },
    },
  }
  const invoke = (data: object) =>
    hook({ data, originalDoc, req: request, operation: 'update' } as never)
  await assert.rejects(async () => invoke({ route: '/' }), /restrita/)
  await assert.rejects(
    async () => invoke({ pageKey: 'rastrear-home' }),
    /restrita/,
  )
  await assert.rejects(async () => invoke({ company: 2 }), /restrita/)
  await assert.rejects(
    async () => invoke({ content: { rasHero: { title1: 'wrong page' } } }),
    /não pertence à página/,
  )
  await assert.rejects(
    async () => invoke({ content: { rasTower: { image1: 4 } } }),
    /imagem deve pertencer/,
  )
  await assert.rejects(
    async () =>
      hook({
        operation: 'create',
        req: request,
        data: { company: 1, pageKey: 'localize-home' },
      } as never),
    /não pertence à empresa/,
  )
  const data = {
    content: {
      rasTower: { title1: 'Updated' },
      rasGallery: { title1: 'Gallery' },
    },
  }
  assert.deepEqual(await invoke(data), data)
})

test('seed three pages preserving all content and edits', async () => {
  const companies = [
    { id: 1, slug: 'localize' },
    { id: 2, slug: 'rastrear' },
  ]
  type Document = Record<string, unknown>
  const mediaDocs: Document[] = []
  const pages: Document[] = []
  const match = (doc: Document, where: Record<string, unknown>): boolean =>
    Object.entries(where).every(([key, value]) =>
      key === 'and'
        ? (value as Record<string, unknown>[]).every((term) => match(doc, term))
        : doc[key] === (value as { equals: unknown }).equals,
    )
  const payload = {
    find: async ({
      collection,
      where,
    }: {
      collection: string
      where: Record<string, unknown>
    }) => ({
      docs: (collection === 'companies'
        ? companies
        : collection === 'media'
          ? mediaDocs
          : pages
      ).filter((doc) => match(doc, where)),
    }),
    create: async ({ collection, data }: { collection: string; data: Document }) => {
      if (collection === 'media') {
        const doc = { id: mediaDocs.length + 100, ...data }
        mediaDocs.push(doc)
        return doc
      }
      const doc = { id: pages.length + 1, ...data }
      pages.push(doc)
      return doc
    },
    update: async ({ id, data }: { id: number; data: Document }) =>
      Object.assign(
        pages.find((p) => p.id === id)!,
        data,
      ),
  } as unknown as Payload

  await seedPages(payload)
  assert.equal(pages.length, 3)
  for (const page of sitePages) {
    const saved = pages.find((p) => p.pageKey === page.key)!
    assert.deepEqual(Object.keys(saved.content as object), [...page.sections])
  }
  const home = pages.find((p) => p.pageKey === 'localize-home')!
  ;(home.content as Record<string, Record<string, unknown>>).locHero.title1 =
    'Page CMS edit'
  const snapshot = structuredClone(pages)
  await seedPages(payload)
  assert.deepEqual(pages, snapshot)
})

test('each route fetches one page and returns only its components', async () => {
  const original = globalThis.fetch
  const previousToken = process.env.COMPANY_TOKEN
  process.env.COMPANY_TOKEN = 'cmp_' + 'a'.repeat(64)
  try {
    for (const [company, slug, fetchPage, expected] of [
      ['localize', 'home', localizeHome, 7],
      ['rastrear', 'home', rastrearHome, 4],
      ['rastrear', 'logistica', getLogisticsData, 2],
    ] as const) {
      let calls = 0
      const page = sitePages.find(
        (p) => p.company === company && p.slug === slug,
      )!
      globalThis.fetch = async (input, init) => {
        calls++
        const url = new URL(String(input))
        assert.equal(url.pathname, '/api/site-settings')
        assert.equal(
          url.searchParams.get('where[company.slug][equals]'),
          null,
        )
        assert.equal(new Headers(init?.headers).get('authorization'), `Bearer ${process.env.COMPANY_TOKEN}`)
        assert.equal(url.searchParams.get('where[pageSlug][equals]'), slug)
        assert.equal(url.searchParams.get('limit'), '1')
        assert.equal(url.searchParams.get('depth'), '1')
        assert.equal(
          (init as { next: { revalidate: number } }).next.revalidate,
          60,
        )
        return Response.json({
          docs: [
            {
              pageSlug: slug,
              content: Object.fromEntries(
                page.sections.map((variant) => [
                  variant,
                  {
                    title1: 'CMS title',
                    image1: {
                      id: 2,
                      url: '/media/example.jpg',
                      alt: 'CMS image',
                    },
                  },
                ]),
              ),
            },
          ],
        })
      }
      const data = await fetchPage()
      assert.equal(calls, 1)
      assert.equal(Object.keys(data).length, expected)
      for (const content of Object.values(data))
        assert.match(
          (content.image1 as { url: string }).url,
          /^http.*\/media\/example.jpg$/,
        )
      if (slug === 'home' && company === 'rastrear')
        assert.equal('gallery' in data, false)
      if (slug === 'logistica') assert.equal('hero' in data, false)
    }
    globalThis.fetch = async () => Response.json({ docs: [] })
    assert.deepEqual(await getLogisticsData(), {})
    globalThis.fetch = async () => new Response('', { status: 503 })
    assert.deepEqual(await localizeHome(), {})
  } finally {
    globalThis.fetch = original
    if (previousToken === undefined) delete process.env.COMPANY_TOKEN
    else process.env.COMPANY_TOKEN = previousToken
  }
})

test('empty fields do not restore hardcoded text or images', () => {
  assert.equal(contentText(undefined), '')
  assert.equal(contentText(''), '')
  assert.equal(contentText('CMS'), 'CMS')
  assert.equal(contentImage(5), undefined)
  assert.equal(contentAlt(undefined), '')
})
test('tenant users can create and manage users only in their company', async () => {
  assert.equal(await Users.access!.create!({ req: req(user) }), true)
  assert.equal(await Users.access!.create!({ req: req(null) }), false)
  assert.equal(
    await Users.access!.create!({ req: req({ ...user, company: null }) }),
    false,
  )
  assert.deepEqual(await Users.access!.read!({ req: req(user) }), {
    and: [{ company: { equals: 1 } }, { roles: { not_in: ['super-admin'] } }],
  })
  assert.deepEqual(
    await Users.access!.update!({ req: req(user) }),
    await Users.access!.read!({ req: req(user) }),
  )
  assert.equal(await Users.access!.delete!({ req: req(user) }), false)
  const hook = Users.hooks!.beforeValidate![0] as CollectionBeforeValidateHook
  const create = await hook({
    operation: 'create',
    req: req(user),
    data: { email: 'test@example.com', company: 2, roles: ['super-admin'] },
  } as never)
  assert.deepEqual(create, {
    email: 'test@example.com',
    company: 1,
    roles: ['user'],
  })
  const originalDoc = { id: 8, company: 1, roles: ['user'] }
  const update = await hook({
    operation: 'update',
    req: req(user),
    originalDoc,
    data: { company: 2, roles: ['super-admin'] },
  } as never)
  assert.deepEqual(update, { company: 1, roles: ['user'] })
  for (const target of [
    { ...originalDoc, company: 2 },
    { ...originalDoc, roles: ['super-admin'] },
  ]) {
    await assert.rejects(
      async () =>
        hook({
          operation: 'update',
          req: req(user),
          originalDoc: target,
          data: { password: 'changed' },
        } as never),
      /usuários comuns/,
    )
  }
  const adminReq = req({ ...user, roles: ['super-admin'] })
  assert.equal(await Users.access!.read!({ req: adminReq }), true)
  const adminData = { company: 2, roles: ['super-admin'] }
  assert.deepEqual(
    await hook({
      operation: 'create',
      req: adminReq,
      data: adminData,
    } as never),
    adminData,
  )
  const roles = Users.fields.find((f) => 'name' in f && f.name === 'roles')
  assert.ok(roles && 'access' in roles && 'admin' in roles)
  for (const operation of ['read', 'create', 'update'] as const) {
    assert.equal(
      await roles.access![operation]!({ req: req(user) } as never),
      false,
    )
    assert.equal(
      await roles.access![operation]!({ req: adminReq } as never),
      true,
    )
  }
  assert.equal(roles.admin!.condition!({}, {}, { user } as never), false)
  assert.equal(
    roles.admin!.condition!({}, {}, { user: adminReq.user } as never),
    true,
  )
})


test('company tokens are random and constrain anonymous reads', async () => {
  const token = createCompanyToken()
  assert.match(token, /^cmp_[a-f0-9]{64}$/)
  assert.notEqual(token, createCompanyToken())
  for (const authorization of ['', 'Bearer invalid']) {
    assert.equal(await siteContentRead({ req: { headers: new Headers({ authorization }) } as PayloadRequest }), false)
  }
  const request = {
    headers: new Headers({ authorization: `Bearer ${token}` }),
    payload: { find: async (args: { where: unknown; overrideAccess: boolean }) => {
      assert.deepEqual(args.where, { token: { equals: token } })
      assert.equal(args.overrideAccess, true)
      return { docs: [{ id: 4 }] }
    } },
  } as unknown as PayloadRequest
  assert.deepEqual(await siteContentRead({ req: request }), { company: { equals: 4 } })
  request.payload.find = (async () => ({ docs: [] })) as unknown as Payload['find']
  assert.equal(await siteContentRead({ req: request }), false)
})


test('company creation generates its token and updates preserve it', async () => {
  const hook = Companies.hooks!.beforeValidate![0] as CollectionBeforeValidateHook
  const data = await hook({ data: { name: 'Test', slug: 'test', token: 'forged' }, operation: 'create' } as Parameters<CollectionBeforeValidateHook>[0])
  assert.match(data!.token, /^cmp_[a-f0-9]{64}$/)
  const updated = await hook({ data: { token: 'forged' }, originalDoc: data, operation: 'update' } as Parameters<CollectionBeforeValidateHook>[0])
  assert.equal(updated!.token, data!.token)
})


test('production CMS configuration and media URLs avoid local fallbacks', () => {
  assert.throws(() => getPayloadUrl({ NODE_ENV: 'production' }), /PAYLOAD_URL/)
  assert.equal(getPayloadUrl({ NODE_ENV: 'development' }), 'http://localhost:3000')
  assert.equal(getPayloadUrl({ PAYLOAD_URL: ' https://cms.example.com/ ' }), 'https://cms.example.com')
  assert.equal(resolveMediaUrl('http://localhost:3000/media/logo.svg', 'https://cms.example.com'), 'https://cms.example.com/media/logo.svg')
  assert.equal(resolveMediaUrl('/media/logo.svg', 'https://cms.example.com'), 'https://cms.example.com/media/logo.svg')
  assert.equal(resolveMediaUrl('https://cdn.example.com/logo.svg', 'https://cms.example.com'), 'https://cdn.example.com/logo.svg')
  assert.equal(resolveMediaUrl('javascript:alert(1)', 'https://cms.example.com'), undefined)
  assert.equal(resolveMediaUrl('http://[invalid', 'https://cms.example.com'), undefined)
})
