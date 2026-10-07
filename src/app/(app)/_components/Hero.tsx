import React from 'react'

type HeroProps = {
  logoUrl?: string | null
  logoAlt?: string | null
}

export function Hero({ logoUrl, logoAlt }: HeroProps) {
  return (
    <section className="w-full flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
      {logoUrl ? (
        <div className="relative group">
          <div className="absolute -inset-6 bg-gradient-to-r from-red-600 to-amber-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition duration-500 pointer-events-none" />
          <img
            src={logoUrl}
            alt={logoAlt || 'Logo do Flamengo'}
            className="relative w-48 h-48 sm:w-64 sm:h-64 object-contain mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-[#c3281e] via-[#8c1a13] to-black flex items-center justify-center text-white font-serif font-black text-5xl shadow-2xl">
          CRF
        </div>
      )}
    </section>
  )
}
