import pg from 'pg'
import sections from '../companys/home-sections'

// Change only the original seeded names; preserve custom names and site content.
const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
try {
  await db.connect()
  await db.query('BEGIN')
  let updated = 0
  for (const section of sections) {
    const result = await db.query(
      'UPDATE site_sections SET name = $1, updated_at = NOW() WHERE section_key = $2 AND name = $3',
      [section.label, section.variant, section.previousLabel],
    )
    updated += result.rowCount ?? 0
  }
  await db.query('COMMIT')
  console.log(`Nomes de componentes traduzidos: ${updated}`)
} catch (error) {
  await db.query('ROLLBACK')
  throw error
} finally {
  await db.end()
}
