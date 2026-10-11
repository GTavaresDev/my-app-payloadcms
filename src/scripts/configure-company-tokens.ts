import pg from 'pg'
import { readFile, writeFile, chmod } from 'node:fs/promises'
import { createCompanyToken } from '../access/company-token'

// Explicit provisioning for existing installations. Never prints credentials.
const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
try {
  await db.connect()
  await db.query('BEGIN')
  await db.query('SELECT pg_advisory_xact_lock(2026101117)')
  await db.query('ALTER TABLE companies ADD COLUMN IF NOT EXISTS token varchar')
  const companies = await db.query('SELECT id FROM companies WHERE token IS NULL OR token = \'\'')
  for (const company of companies.rows) {
    await db.query('UPDATE companies SET token=$1 WHERE id=$2', [createCompanyToken(), company.id])
  }
  await db.query('CREATE UNIQUE INDEX IF NOT EXISTS companies_token_idx ON companies (token)')
  await db.query(`INSERT INTO payload_migrations (name, batch)
    SELECT '20261011_170000_company_tokens', COALESCE((SELECT MAX(batch) FROM payload_migrations WHERE batch >= 0), 0) + 1
    WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name='20261011_170000_company_tokens')`)
  await db.query('COMMIT')
  for (const slug of ['localize', 'rastrear']) {
    const result = await db.query('SELECT token FROM companies WHERE slug=$1', [slug])
    if (!result.rows[0]?.token) throw new Error(`Empresa não encontrada: ${slug}`)
    const path = new URL(`../../../${slug}/.env.local`, import.meta.url)
    let env = await readFile(path, 'utf8')
    env = env.replace(/^COMPANY_(?:SLUG|TOKEN)=.*\r?\n?/gm, '')
    await writeFile(path, `${env.trimEnd()}\nCOMPANY_TOKEN=${result.rows[0].token}\n`, { mode: 0o600 })
    await chmod(path, 0o600)
  }
  console.log('Tokens configurados no banco e nas variáveis privadas dos dois sites.')
} finally {
  await db.end()
}
