import Link from "next/link";
import { Newspaper, Calendar } from "lucide-react";
import type { News } from "@/payload-types";

type NewsCardProps = {
  item: News;
};

export default function NewsCard({ item }: NewsCardProps) {
  const imagem = typeof item.imagem === "object" ? item.imagem : null;
  const dataFormatada = item.createdAt
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(item.createdAt))
    : null;

  return (
    <Link
      href={`/noticias/${encodeURIComponent(item.title)}`}
      className="group flex flex-col bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-500/30 transition-all duration-300"
    >
      {/* Imagem com container em proporção 16:9 */}
      <div className="relative w-full aspect-[16/10] bg-zinc-900 overflow-hidden flex items-center justify-center">
        {imagem?.url ? (
          <img
            src={imagem.url}
            alt={imagem.alt || item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-500 gap-2">
            <Newspaper className="w-8 h-8 text-zinc-600" />
            <span className="text-xs">Sem imagem</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
          Flamengo
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-6 flex flex-col flex-1">
        {dataFormatada && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-3">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <time dateTime={item.createdAt}>{dataFormatada}</time>
          </div>
        )}

        <h2 className="text-xl font-bold text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-3">
          {item.title}
        </h2>

        <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line line-clamp-3 flex-1">
          {item.content}
        </p>
      </div>
    </Link>
  );
}
