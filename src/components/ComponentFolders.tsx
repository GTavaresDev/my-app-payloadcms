'use client'

import { useState } from 'react'
import { Folder, ArrowLeft, ChevronRight } from 'lucide-react'
import sections from '../companys/home-sections'

/** Navigation only: content remains in its original page fields. */
export function ComponentFolders() {
  const [value, setValue] = useState('')
  const components = sections.filter((section) => section.company === 'localize')
  const selected = components.find((section) => section.variant === value)

  if (selected) {
    return (
      <div style={{ marginBottom: 24 }}>
        <style>{components.filter((section) => section.variant !== value).map((section) => `#field-content__${section.variant} { display: none; }`).join("\n")}</style>
        <button type="button" onClick={() => setValue('')} style={buttonStyle}>
          <ArrowLeft size={18} aria-hidden /> Voltar aos componentes
        </button>
        <p style={{ color: 'var(--theme-elevation-600)' }}>
          Página inicial / {selected.label}
        </p>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 24, paddingBottom: 40 }}>
      <style>{`#field-content { display: none; }`}</style>
      <p style={{ marginBottom: 24 }}>
        Abra uma pasta para editar os textos e as imagens do componente.
      </p>
      <div style={{ display: 'grid', gap: 8 }}>
        {components.map((section) => (
          <button
            key={section.variant}
            type="button"
            onClick={() => setValue(section.variant)}
            style={{ ...buttonStyle, width: '100%', padding: '18px 20px', textAlign: 'left' }}
          >
            <Folder size={22} aria-hidden />
            <span style={{ flex: 1 }}>{section.label}</span>
            <ChevronRight size={18} aria-hidden />
          </button>
        ))}
      </div>
    </div>
  )
}

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 14px',
  color: 'var(--theme-text)',
  background: 'var(--theme-elevation-50)',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 4,
  cursor: 'pointer',
  font: 'inherit',
} as const
