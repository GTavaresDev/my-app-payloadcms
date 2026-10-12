import pg from 'pg'
import { readFile, writeFile, chmod } from 'node:fs/promises'
import { up } from '../migrations/20261011_170000_company_tokens'
import { runMigration } from './migration-runner'

// Explicit provisioning for existing installations. Never prints credentials.
const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
try {
  await db.connect()
  await db.query('BEGIN')
  await db.query('SELECT pg_advisory_xact_lock(2026101117)')
  await runMigration(db, up)
  await db.query(`INSERT INTO payload_migrations (name, batch)
    SELECT '20261011_170000_company_tokens', COALESCE((SELECT MAX(batch) FROM payload_migrations WHERE batch >= 0), 0) + 1
    WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name='20261011_170000_company_tokens')`)
  await db.query('COMMIT')
  const companiesResult = await db.query('SELECT slug, token FROM companies')
  for (const row of companiesResult.rows) {
    const { slug, token } = row
    if (!token) continue
    const path = new URL(`../../../${slug}/.env.local`, import.meta.url)
    try {
      let env = await readFile(path, 'utf8')
      env = env.replace(/^COMPANY_(?:SLUG|TOKEN)=.*\r?\n?/gm, '')
      await writeFile(path, `${env.trimEnd()}\nCOMPANY_TOKEN=${token}\n`, { mode: 0o600 })
      await chmod(path, 0o600)
    } catch {
      // Projeto do cliente pode não estar neste repositório local
    }
  }
  console.log('Tokens configurados no banco e nas variáveis privadas dos dois sites.')
} catch (error) {
  await db.query('ROLLBACK')
  throw error
} finally {
  await db.end()
}
