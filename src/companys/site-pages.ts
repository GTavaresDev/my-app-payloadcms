import { localizePages } from './localize/site-pages'
import { rastrearPages } from './rastrear/site-pages'

export const sitePages = [
  ...localizePages,
  ...rastrearPages,
] as const

export { localizePages, rastrearPages }
