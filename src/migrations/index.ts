import * as tokens from './20261011_170000_company_tokens'
import * as migration from './20261011_154045_site_pages'

export const migrations = [{ name: '20261011_154045_site_pages', up: migration.up, down: migration.down }, { name: '20261011_170000_company_tokens', up: tokens.up, down: tokens.down }]
