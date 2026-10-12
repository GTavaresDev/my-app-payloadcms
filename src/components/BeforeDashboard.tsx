import { relationshipID } from '../utilities/relationship-id'
import React from 'react'
import type { ServerProps } from 'payload'

export async function BeforeDashboard({ user, payload }: ServerProps) {
  let companyName = ''

  if (user?.company) {
    if (typeof user.company === 'object' && 'name' in user.company && user.company.name) {
      companyName = String(user.company.name)
    } else {
      try {
        const id = relationshipID(user.company)
        if (id) {
          const company = await payload.findByID({
            collection: 'companies',
            id,
            depth: 0,
          })
          companyName = company?.name || company?.slug || ''
        }
      } catch {
        companyName = ''
      }
    }
  }

  const displayName = companyName || 'GTech'

  return (
    <div
      style={{
        marginTop: '1.5rem',
        marginBottom: '2rem',
        padding: '1.5rem 1.75rem',
        borderRadius: '12px',
        background: 'var(--theme-elevation-50, rgba(255, 255, 255, 0.03))',
        border: '1px solid var(--theme-elevation-150, rgba(255, 255, 255, 0.08))',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--theme-elevation-1000, #ffffff)',
          letterSpacing: '-0.02em',
        }}
      >
        Bem-vindo ao CMS da {displayName}
      </h2>
      <p
        style={{
          margin: '0.4rem 0 0 0',
          fontSize: '0.9rem',
          color: 'var(--theme-elevation-500, #94a3b8)',
        }}
      >
        Gerencie as páginas, componentes e mídias da sua aplicação.
      </p>
    </div>
  )
}
