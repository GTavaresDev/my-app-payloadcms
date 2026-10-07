import { Newspaper } from "lucide-react";

export default function NewsHeader() {
  return (
    <div className="mb-10 text-center sm:text-left border-b border-zinc-200/80 pb-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider mb-3">
        <Newspaper className="w-3.5 h-3.5" />
        Central de Notícias
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
        Notícias do Mengão
      </h1>
      <p className="mt-2 text-zinc-600 text-sm sm:text-base max-w-2xl">
        Acompanhe em primeira mão os resultados, bastidores e novidades do Clube de Regatas do Flamengo.
      </p>
    </div>
  );
}
