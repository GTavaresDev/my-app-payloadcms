import { getNewsById } from "@/lib/payload";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

type Props = {
    params: Promise<{ title: string }>;
};

export default async function NoticiaPage({ params }: Props) {
    const { title } = await params;
    const decodedTitle = decodeURIComponent(title);
    const item = await getNewsById(decodedTitle);

    if (!item) {
        notFound();
    }

    const imagem = typeof item.imagem === "object" ? item.imagem : null;
    const dataFormatada = item.createdAt
        ? new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(new Date(item.createdAt))
        : null;

    return (
        <article className="min-h-[70vh] bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Voltar */}
                <Link
                    href="/noticias"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-red-600 transition-colors mb-6 font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Notícias
                </Link>

                {/* Data e Tag */}
                <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4">
                    <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
                        Flamengo
                    </span>
                    {dataFormatada && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                            <time dateTime={item.createdAt}>{dataFormatada}</time>
                        </div>
                    )}
                </div>

                {/* Título */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-8">
                    {item.title}
                </h1>

                {/* Imagem */}
                {imagem?.url && (
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-md bg-zinc-900 mb-8">
                        <img
                            src={imagem.url}
                            alt={imagem.alt || item.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Conteúdo */}
                <div className="text-zinc-700 text-lg leading-relaxed whitespace-pre-line border-t border-zinc-100 pt-6">
                    {item.content}
                </div>
            </div>
        </article>
    );
}
