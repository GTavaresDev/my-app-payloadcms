import { Camera } from "lucide-react";
import type { Media } from "@/payload-types";

type PhotoCardProps = {
  item: Media;
};

export default function PhotoCard({ item }: PhotoCardProps) {
  return (
    <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200/80 shadow-sm hover:shadow-xl hover:border-red-500/40 transition-all duration-300">
      {item.url ? (
        <img
          src={item.url}
          alt={item.alt || 'Foto do Flamengo'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
          <Camera className="w-8 h-8 text-zinc-600" />
          <span className="text-xs">Sem imagem disponível</span>
        </div>
      )}

      {/* Gradiente e Legenda */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end">
        <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1">
          Flamengo
        </span>
        <p className="text-white text-sm sm:text-base font-semibold leading-snug line-clamp-2">
          {item.alt || 'Registro do Mais Querido'}
        </p>
      </div>
    </div>
  );
}
