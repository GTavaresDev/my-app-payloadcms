import { Camera } from "lucide-react";

export default function PhotosHeader() {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider mb-3">
        <Camera className="w-3.5 h-3.5" />
        Galeria Oficial
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
        Mural de Fotos do Clube
      </h1>
      <p className="mt-3 text-zinc-600 text-sm sm:text-base leading-relaxed">
        Confira os registros oficiais, bastidores e a energia inconfundível da Nação Rubro-Negra em cada detalhe.
      </p>
    </div>
  );
}
