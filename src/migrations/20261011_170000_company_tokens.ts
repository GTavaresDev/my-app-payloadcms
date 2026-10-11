import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'
import { createCompanyToken } from '../access/company-token'

export async function up({ db }: MigrateUpArgs) {
  await db.execute(sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS token varchar`)
  const result = await db.execute(sql`SELECT id FROM companies WHERE token IS NULL OR token = ''`)
  for (const row of result.rows) {
    await db.execute(sql`UPDATE companies SET token = ${createCompanyToken()} WHERE id = ${row.id}`)
  }
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS companies_token_idx ON companies (token)`)
}

export async function down({ db }: MigrateDownArgs) {
  await db.execute(sql`ALTER TABLE companies DROP COLUMN IF EXISTS token`)
}
