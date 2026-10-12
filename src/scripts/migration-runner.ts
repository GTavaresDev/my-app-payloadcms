import type pg from 'pg'
import { PgDialect } from 'drizzle-orm/pg-core'
import type { SQL } from 'drizzle-orm'
import type { MigrateUpArgs } from '@payloadcms/db-postgres'

/** Run an existing migration through a caller-owned PostgreSQL transaction. */
export async function runMigration(db: pg.Client, up: (args: MigrateUpArgs) => Promise<void>) {
  const dialect = new PgDialect()
  await up({ db: { execute: (statement: SQL) => {
    const query = dialect.sqlToQuery(statement)
    return db.query(query.sql, query.params)
  } } } as unknown as MigrateUpArgs)
}
