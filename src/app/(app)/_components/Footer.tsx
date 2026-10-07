import React from 'react'
import Link from 'next/link'
import { Heart, Flame } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
          
          {/* Bloco da Esquerda */}
          <div className="max-w-lg">
            {/* Linha do Título com altura fixa (h-10) para alinhar perfeitamente com a direita */}
            <div className="h-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c3281e] to-black flex items-center justify-center border border-red-500/40 shadow-sm shrink-0">
                <span className="font-serif font-black text-white text-lg">CRF</span>
              </div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-900">
                CLUBE DE REGATAS DO FLAMENGO
              </span>
            </div>

            <p className="mt-4 text-zinc-600 text-sm leading-relaxed">
              O Mais Querido do Brasil. Fundado em 17 de novembro de 1895. Uma paixão que move mais de 48 milhões de corações em todos os cantos do planeta.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
              <Flame className="w-4 h-4 text-red-600" />
              <span>Raça, Amor e Paixão.</span>
            </div>
          </div>

          {/* Bloco da Direita (Navegação) */}
          <div className="min-w-[160px]">
            {/* Linha do Título com a mesma altura fixa (h-10) da esquerda */}
            <div className="h-10 flex items-center">
              <h4 className="font-bold text-zinc-900 text-xs sm:text-sm uppercase tracking-wider text-red-600">
                Navegação
              </h4>
            </div>

            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              <li>
                <Link href="/" className="hover:text-red-600 transition-colors font-medium">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="hover:text-red-600 transition-colors font-medium">
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-red-600 transition-colors font-medium">
                  Painel
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Linha inferior de copyright */}
        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Clube de Regatas do Flamengo. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600 inline" /> para a Nação Rubro-Negra.
          </p>
        </div>
      </div>
    </footer>
  )
}
