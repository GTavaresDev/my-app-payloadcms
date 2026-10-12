import pg from 'pg'
import { runMigration } from './migration-runner'
import { migrations } from '../migrations'
import snapshot from '../migrations/20261011_154045_site_pages.json'

// Additive transition for an existing database, including dev schema-push installs.
const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
try {
  await db.connect()
  await db.query('BEGIN')
  await db.query('SELECT pg_advisory_xact_lock(2026101115)')
  const exists = await db.query(
    "SELECT to_regclass('public.site_settings') AS table_name",
  )
  if (!exists.rows[0].table_name) {
    await runMigration(db, migrations[0].up)
  }
  const columns = await db.query(
    "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings'",
  )
  const actual = new Set(columns.rows.map((row) => row.column_name))
  for (const name of Object.keys(
    snapshot.tables['public.site_settings'].columns,
  )) {
    if (!actual.has(name))
      throw new Error(`A tabela de páginas está incompleta: ${name}`)
  }
  const index = await db.query(
    "SELECT indexname FROM pg_indexes WHERE tablename='site_settings' AND indexname='company_pageSlug_idx'",
  )
  if (!index.rowCount)
    throw new Error('Índice único de empresa e página ausente.')
  await db.query(
    `INSERT INTO payload_migrations (name, batch)
    SELECT $1::varchar, COALESCE((SELECT MAX(batch) FROM payload_migrations WHERE batch >= 0), 0) + 1
    WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name=$1::varchar)`,
    [migrations[0].name],
  )
  await db.query('COMMIT')
  console.log('Estrutura de páginas preparada; conteúdo legado preservado.')
} catch (error) {
  await db.query('ROLLBACK')
  throw error
} finally {
  await db.end()
}
