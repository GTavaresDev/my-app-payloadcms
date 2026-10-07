import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Flame } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 mb-6 rounded-2xl bg-red-950/60 border border-red-600/40 flex items-center justify-center text-red-500 shadow-xl shadow-red-950/50">
        <Flame className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-white tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-bold text-red-500 mb-4">Página não encontrada no Ninho</h2>
      <p className="text-zinc-400 max-w-md mb-8 text-sm">
        O lance foi anulado pelo VAR ou esta página não existe mais. Retorne para a página inicial e continue acompanhando o Mengão.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Página Inicial
      </Link>
    </div>
  )
}
