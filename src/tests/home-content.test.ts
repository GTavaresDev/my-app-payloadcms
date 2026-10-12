import { getPayloadUrl, resolveMediaUrl } from '../../../localize/src/lib/cms-url'
import assert from 'node:assert/strict'
import test from 'node:test'
import { tenantRead, tenantUpdate, superAdmin } from '../access/tenant'
import { SiteComponents } from '../collections/SiteComponents'
import { createCompanyToken, siteContentRead } from '../access/company-token'
import { Companies } from '../collections/Companies'
import { Users } from '../collections/Users'
import { seedComponents } from '../scripts/seed-components'
import type {
  Payload,
  PayloadRequest,
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

test('component access isolates companies and protects identifiers', async () => {
  assert.equal(await tenantRead({ req: req(null) }), true)
  assert.deepEqual(await tenantRead({ req: req(user) }), {
    company: { equals: 1 },
  })
  assert.equal(await tenantUpdate({ req: req(null) }), false)
  assert.equal(SiteComponents.access?.create, superAdmin)
  assert.equal(SiteComponents.access?.delete, superAdmin)
  assert.deepEqual(SiteComponents.indexes, [
    { fields: ['company', 'pageSlug', 'slug'], unique: true },
  ])
  for (const name of ['slug', 'company', 'pageSlug']) {
    const field = SiteComponents.fields.find(
      (f) => 'name' in f && f.name === name,
    )
    assert.ok(field && 'access' in field)
    assert.equal(
      await field.access!.update!({ req: req(user) } as never),
      false,
    )
  }
})

test('seed initial components into site-components collection', async () => {
  const companies = [
    { id: 1, slug: 'localize' },
    { id: 2, slug: 'rastrear' },
  ]
  type Document = Record<string, unknown>
  const mediaDocs: Document[] = []
  const components: Document[] = []
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
          : components
      ).filter((doc) => match(doc, where)),
    }),
    create: async ({ collection, data }: { collection: string; data: Document }) => {
      if (collection === 'media') {
        const doc = { id: mediaDocs.length + 100, ...data }
        mediaDocs.push(doc)
        return doc
      }
      const doc = { id: components.length + 1, ...data }
      components.push(doc)
      return doc
    },
    update: async ({ id, data }: { id: number; data: Document }) =>
      Object.assign(
        components.find((p) => p.id === id)!,
        data,
      ),
  } as unknown as Payload

  await seedComponents(payload)
  assert.equal(components.length, 13)
  const hero = components.find((c) => c.slug === 'hero' && c.company === 1)!
  assert.ok(hero.title)
})

test('each route fetches one page and returns only its components', async () => {
  const previousToken = process.env.COMPANY_TOKEN
  process.env.COMPANY_TOKEN = 'cmp_' + 'a'.repeat(64)
  try {
    for (const [slug, fetchPage, expected] of [
      ['home', localizeHome, 7],
      ['home', rastrearHome, 4],
      ['logistica', getLogisticsData, 2],
    ] as const) {
      let calls = 0
      globalThis.fetch = async (input, init) => {
        calls++
        const url = new URL(String(input))
        assert.equal(url.pathname, '/api/site-components')
        assert.equal(
          url.searchParams.get('where[company.slug][equals]'),
          null,
        )
        assert.equal(new Headers(init?.headers).get('authorization'), `Bearer ${process.env.COMPANY_TOKEN}`)
        assert.equal(url.searchParams.get('where[pageSlug][equals]'), slug)
        assert.equal(url.searchParams.get('limit'), '100')
        assert.equal(url.searchParams.get('depth'), '1')
        assert.equal(
          (init as { next: { revalidate: number } }).next.revalidate,
          60,
        )
        const mockDocs = Array.from({ length: expected }).map((_, i) => ({
          slug: `comp-${i}`,
          title: `Title ${i}`,
          content: `Content ${i}`,
          image: { id: 2, url: '/media/example.jpg', alt: 'Image' },
          fields: [{ key: 'text1', value: 'Value 1' }],
        }))
        return Response.json({
          docs: mockDocs,
        })
      }
      const data = await fetchPage()
      assert.equal(calls, 1)
      assert.equal(Object.keys(data).length, expected)
      for (const content of Object.values(data)) {
        assert.ok(content.title)
      }
    }
  } finally {
    process.env.COMPANY_TOKEN = previousToken
  }
})

test('empty fields do not restore hardcoded text or images', () => {
  assert.equal(contentText(''), '')
  assert.equal(contentText('   '), '')
  assert.equal(contentText(undefined), '')
  assert.equal(contentText(null), '')
  assert.equal(contentText('Texto real do CMS'), 'Texto real do CMS')

  assert.equal(contentImage(null), undefined)
  assert.equal(contentImage(undefined), undefined)
  assert.equal(contentImage(12), undefined)
  assert.equal(contentImage({ id: 1, url: '   ' } as never), undefined)
  assert.equal(
    contentImage({ id: 1, url: '/media/hero.jpg' } as never),
    '/media/hero.jpg',
  )

  assert.equal(contentAlt(null), '')
  assert.equal(contentAlt(undefined), '')
  assert.equal(contentAlt({ id: 1, alt: 'Banner' } as never), 'Banner')
})

test('tenant users can create and manage users only in their company', async () => {
  const superAdminUser = { id: 1, roles: ['super-admin'] }
  const tenantUser = { id: 2, roles: ['user'], company: 5 }
  const otherTenantUser = { id: 3, roles: ['user'], company: 9 }

  assert.equal(await Users.access?.create?.({ req: req(superAdminUser) } as never), true)
  assert.equal(await Users.access?.create?.({ req: req(tenantUser) } as never), true)
  assert.equal(await Users.access?.create?.({ req: req(null) } as never), false)

  assert.equal(await Users.access?.read?.({ req: req(superAdminUser) } as never), true)
  assert.deepEqual(await Users.access?.read?.({ req: req(tenantUser) } as never), {
    and: [{ company: { equals: 5 } }, { roles: { not_in: ['super-admin'] } }],
  })

  assert.equal(await Users.access?.update?.({ req: req(superAdminUser) } as never), true)
  assert.deepEqual(await Users.access?.update?.({ req: req(tenantUser) } as never), {
    and: [{ company: { equals: 5 } }, { roles: { not_in: ['super-admin'] } }],
  })

  const hook = Users.hooks!.beforeValidate![0]
  const createdByTenant = await hook({
    operation: 'create',
    req: req(tenantUser),
    data: { email: 'colab@tenant.com', roles: ['super-admin'], company: 99 },
  } as never)
  assert.equal(createdByTenant.company, 5)
  assert.deepEqual(createdByTenant.roles, ['user'])

  await assert.rejects(
    async () =>
      hook({
        operation: 'update',
        req: req(tenantUser),
        originalDoc: otherTenantUser,
        data: { email: 'hack@other.com' },
      } as never),
    /Você só pode gerenciar usuários comuns da sua empresa\./,
  )

  await assert.rejects(
    async () =>
      hook({
        operation: 'update',
        req: req(tenantUser),
        originalDoc: { id: 4, roles: ['super-admin'], company: 5 },
        data: { email: 'hack@super.com' },
      } as never),
    /Você só pode gerenciar usuários comuns da sua empresa\./,
  )
})

test('company tokens are random and constrain anonymous reads', async () => {
  const tokenA = createCompanyToken()
  const tokenB = createCompanyToken()
  assert.match(tokenA, /^cmp_[0-9a-f]{64}$/)
  assert.match(tokenB, /^cmp_[0-9a-f]{64}$/)
  assert.notEqual(tokenA, tokenB)

  const payloadWithCompany = {
    find: async ({ where }: { where: { token: { equals: string } } }) => ({
      docs: where.token.equals === tokenA ? [{ id: 42, slug: 'empresa-a' }] : [],
    }),
  } as unknown as Payload

  const reqWithToken = {
    headers: new Headers({ authorization: `Bearer ${tokenA}` }),
    payload: payloadWithCompany,
    user: null,
  } as unknown as PayloadRequest

  const reqWithBadToken = {
    headers: new Headers({ authorization: 'Bearer cmp_invalido' }),
    payload: payloadWithCompany,
    user: null,
  } as unknown as PayloadRequest

  const reqWithNoToken = {
    headers: new Headers(),
    payload: payloadWithCompany,
    user: null,
  } as unknown as PayloadRequest

  assert.deepEqual(await siteContentRead({ req: reqWithToken } as never), {
    company: { equals: 42 },
  })
  assert.equal(await siteContentRead({ req: reqWithBadToken } as never), false)
  assert.equal(await siteContentRead({ req: reqWithNoToken } as never), false)
})

test('company creation generates its token and updates preserve it', async () => {
  const hook = Companies.hooks!.beforeValidate![0]
  const created = await hook({
    operation: 'create',
    data: { name: 'Nova Empresa', slug: 'nova' },
  } as never)
  assert.match(created.token, /^cmp_[0-9a-f]{64}$/)

  const existingToken = createCompanyToken()
  const updated = await hook({
    operation: 'update',
    originalDoc: { id: 10, token: existingToken },
    data: { name: 'Novo Nome' },
  } as never)
  assert.equal(updated.token, existingToken)
})

test('production CMS configuration and media URLs avoid local fallbacks', () => {
  const previousEnv = { ...process.env }
  try {
    delete process.env.PAYLOAD_URL
    delete process.env.NEXT_PUBLIC_PAYLOAD_URL
    process.env.NODE_ENV = 'production'
    assert.throws(
      () => getPayloadUrl(),
      /Configure PAYLOAD_URL com a URL do CMS antes do build de produção/,
    )

    process.env.NODE_ENV = 'development'
    assert.equal(getPayloadUrl(), 'http://localhost:3000')

    assert.equal(
      resolveMediaUrl('/media/foto.jpg', 'https://cms.exemplo.com'),
      'https://cms.exemplo.com/media/foto.jpg',
    )
    assert.equal(
      resolveMediaUrl(
        'http://localhost:3000/media/foto.jpg',
        'https://cms.exemplo.com',
      ),
      'https://cms.exemplo.com/media/foto.jpg',
    )
    assert.equal(
      resolveMediaUrl(
        'https://cdn.externo.com/foto.jpg',
        'https://cms.exemplo.com',
      ),
      'https://cdn.externo.com/foto.jpg',
    )
  } finally {
    process.env = previousEnv
  }
})
