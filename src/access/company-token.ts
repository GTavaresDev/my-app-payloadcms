import { randomBytes } from 'node:crypto'
import type { Access } from 'payload'
import { tenantRead } from './tenant'

export const createCompanyToken = () => `cmp_${randomBytes(32).toString('hex')}`

/** Tokens select the tenant on the server; URL filters cannot widen access. */
export const siteContentRead: Access = async ({ req }) => {
  if (req.user) return tenantRead({ req })
  const authorization = req.headers.get('authorization') ?? ''
  const match = /^Bearer (cmp_[a-f0-9]{64})$/.exec(authorization)
  if (!match) return false
  const companies = await req.payload.find({
    collection: 'companies',
    where: { token: { equals: match[1] } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const company = companies.docs[0]
  return company ? { company: { equals: company.id } } : false
}
