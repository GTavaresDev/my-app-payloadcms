'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Newspaper, Menu, X } from 'lucide-react'

type HeaderProps = {
  logoUrl?: string | null
  logoAlt?: string | null
}

function Logo({ logoUrl, logoAlt }: { logoUrl?: string; logoAlt?: string }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={logoAlt || 'Logo'}
        className="w-12 h-12 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform"
      />
    )
  }

  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c3281e] via-[#8c1a13] to-black flex items-center justify-center border border-red-500/40 text-white font-serif font-black">
      CRF
    </div>
  )
}

export function Header({ logoUrl, logoAlt }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo logoUrl={logoUrl ?? undefined} logoAlt={logoAlt ?? undefined} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-zinc-900 group-hover:text-red-600 transition-colors">
                  FLAMENGO
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                  ★ 1895
                </span>
              </div>
              <p className="text-xs text-zinc-500 tracking-wider uppercase font-medium">
                Clube de Regatas do Flamengo
              </p>
            </div>
          </Link>

          {/* Navegação apenas para /noticias */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link
              href="/noticias"
              className="text-zinc-700 hover:text-red-600 transition-colors flex items-center gap-2 font-semibold"
            >
              <Newspaper className="w-4 h-4 text-red-600" />
              Notícias
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/noticias"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-100 hover:text-red-600"
          >
            <Newspaper className="w-4 h-4 text-red-600" />
            Notícias
          </Link>
        </div>
      )}
    </header>
  )
}