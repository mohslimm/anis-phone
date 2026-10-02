"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="bg-[#060610] text-[#f0ede8] flex items-center justify-center min-h-screen p-4 font-sans">
        <div className="text-center max-w-md bg-[#0f0f20] border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl">
          <div className="w-16 h-16 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#c5a059] font-serif text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-serif text-[#f0ede8] mb-3">Une anomalie est survenue</h2>
          <p className="text-xs text-[#f0ede8]/60 mb-8 leading-relaxed">
            Le service technique d&apos;ANIS PHONE a été alerté. Vous pouvez relancer l&apos;application ou contacter notre hotline en cas de persistance.
          </p>
          <button
            onClick={() => reset()}
            className="bg-[#c5a059] text-black font-semibold px-8 py-3 rounded-xl hover:bg-[#e8c77a] transition-all text-xs uppercase tracking-wider"
          >
            Réessayer la connexion
          </button>
        </div>
      </body>
    </html>
  );
}
