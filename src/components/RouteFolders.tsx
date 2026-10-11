'use client'

import Link from 'next/link'
import { useConfig, useListQuery } from '@payloadcms/ui'
import { Folder, ChevronRight } from 'lucide-react'
import type { SiteSetting } from '../payload-types'

/** Reuse the authorized, filtered list rather than fetching a second copy. */
export function RouteFolders() {
  const { data } = useListQuery()
  const { config } = useConfig()
  const pages = (data?.docs ?? []) as SiteSetting[]

  return (
    <div className="site-route-folders" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <style>{`
        .collection-list:has(.site-route-folders) .collection-list__tables {
          display: none;
        }
        .site-route-folder:hover, .site-route-folder:focus-visible {
          background: var(--theme-elevation-100) !important;
        }
      `}</style>
      <p style={{ marginBottom: 24 }}>Abra uma pasta para editar os componentes da página.</p>
      <div style={{ display: 'grid', gap: 8 }}>
        {pages.map((page) => (
          <Link
            key={page.id}
            className="site-route-folder"
            href={`${config.routes.admin}/collections/site-settings/${encodeURIComponent(page.id)}`}
            style={{
              display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr) 18px',
              alignItems: 'center', columnGap: 12, rowGap: 4,
              padding: '18px 20px', color: 'var(--theme-text)',
              background: 'var(--theme-elevation-50)',
              border: '1px solid var(--theme-elevation-150)', borderRadius: 4,
              textDecoration: 'none',
            }}
          >
            <Folder size={22} aria-hidden />
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, lineHeight: '22px' }}>
              <span>{page.name}</span>
              <span style={{ color: 'var(--theme-elevation-600)', fontSize: 13 }}>
                {page.route}
                {typeof page.company === 'object' && page.company?.name ? ` · ${page.company.name}` : ''}
              </span>
            </span>
            <ChevronRight size={18} aria-hidden />
          </Link>
        ))}
      </div>
    </div>
  )
}
