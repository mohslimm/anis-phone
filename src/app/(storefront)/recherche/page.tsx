import { ProductCard } from "@/components/ui/product-card";
import { PackageSearch } from "lucide-react";
import { DataService } from "@/lib/data-service";

export const metadata = {
  title: "Recherche | Anis Phone — Haute Technologie",
  description: "Recherchez nos smartphones, laptops et accessoires d'exception en Algérie.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  // Recherche résiliente via DataService
  const products = query ? await DataService.getProducts({ search: query }) : [];

  return (
    <div className="pt-32 pb-24 min-h-[70vh] bg-luxury-offwhite">
      <div className="container mx-auto px-6 max-w-6xl">
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
          Catalogue & Pièces Disponibles
        </span>
        <h1 className="text-3xl md:text-4xl font-outfit font-light text-luxury-charcoal uppercase mb-2">
          Résultats de Recherche
        </h1>
        <p className="text-luxury-gray text-xs mb-10">
          {query ? (
            <>
              {products.length} résultat(s) pour &quot;<span className="font-semibold text-black">{query}</span>&quot;
            </>
          ) : (
            "Veuillez saisir un nom d'appareil ou une marque dans la barre de recherche."
          )}
        </p>

        {query && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={product.base_price}
                promoPrice={product.promo_price || undefined}
                image={product.images[0] || "/hero/phone-aesthetic.jpg"}
                brand={product.brand?.name || "Maison"}
                condition={product.condition}
                stockQty={product.totalStock ?? 5}
                specs={product.specs}
              />
            ))}
          </div>
        ) : query ? (
          <div className="bg-white border border-black/10 p-16 text-center max-w-lg mx-auto">
            <PackageSearch className="w-12 h-12 text-luxury-gray/40 mx-auto mb-4 stroke-[1.5]" />
            <h3 className="text-lg font-outfit font-semibold text-luxury-charcoal mb-1">
              Aucun modèle trouvé
            </h3>
            <p className="text-xs text-luxury-gray">
              Aucun article ne correspond à votre recherche. Essayez un autre mot-clé ou parcourez nos catégories.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
