import { ProductSkeleton } from "@/components/ui/product-skeleton";

export default function SearchLoading() {
  return (
    <div className="pt-24 pb-20 min-h-[60vh]">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-outfit font-light tracking-[0.2em] text-luxury-charcoal uppercase mb-2">
          Résultats de recherche
        </h1>
        <div className="h-5 w-48 bg-black/5 rounded-none mb-12 animate-pulse"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
