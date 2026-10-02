import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060610] text-[#f0ede8] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-[#0f0f20] border border-white/10 rounded-2xl p-10 shadow-2xl">
        <div className="w-16 h-16 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#c5a059]">
          <Compass className="w-8 h-8" />
        </div>
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#c5a059] uppercase block mb-2">
          Erreur 404
        </span>
        <h1 className="font-serif text-3xl text-[#f0ede8] mb-3">
          Destination Introuvable
        </h1>
        <p className="text-xs text-[#f0ede8]/60 leading-relaxed mb-8">
          La page ou la pièce que vous recherchez a été déplacée ou n&apos;est plus référencée au catalogue.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[#c5a059] hover:bg-[#e8c77a] text-black font-semibold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Retourner au Showroom
        </Link>
      </div>
    </div>
  );
}
