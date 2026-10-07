import { Newspaper } from "lucide-react";

export default function NotNews() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Newspaper className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-800">Nenhuma notícia encontrada</h2>
            <p className="text-zinc-500 mt-2 text-sm max-w-sm">
                Fique ligado! Em breve traremos novidades e atualizações sobre o Mengão.
            </p>
        </div>
    )
}