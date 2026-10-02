"use client";

import { useEffect, useState, use, useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/product-card";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductSkeleton } from "@/components/ui/product-skeleton";
import { DataService, Product, Category } from "@/lib/data-service";

export default function CategoryPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.slug?.[0] || "smartphones";
  const brandSlug = resolvedParams.slug?.[1];

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          DataService.getCategories(),
          DataService.getProducts({ categorySlug }),
        ]);

        const currentCat = cats.find((c) => c.slug === categorySlug);
        setCategory(currentCat || { id: `c-${categorySlug}`, name: categorySlug, slug: categorySlug, order: 99 });
        setProducts(prods);

        if (brandSlug) {
          setSelectedBrand(brandSlug.toLowerCase());
        }
      } catch (e) {
        console.error("Error loading category products:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug, brandSlug]);

  // Extract available brands in this category
  const availableBrands = useMemo(() => {
    const bSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand?.name) bSet.add(p.brand.name);
    });
    return Array.from(bSet);
  }, [products]);

  // Filtered & Sorted products
  const displayedProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchBrand = selectedBrand === "all" || p.brand?.name.toLowerCase() === selectedBrand.toLowerCase();
      const matchCondition = selectedCondition === "all" || p.condition === selectedCondition;
      return matchBrand && matchCondition;
    });

    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.promo_price ?? a.base_price) - (b.promo_price ?? b.base_price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.promo_price ?? b.base_price) - (a.promo_price ?? a.base_price));
    }

    return result;
  }, [products, selectedBrand, selectedCondition, sortBy]);

  return (
    <div className="bg-luxury-offwhite min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header / Breadcrumb */}
        <div className="mb-10 text-center md:text-left border-b border-black/5 pb-8">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-luxury-gray mb-3 justify-center md:justify-start">
            <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-black font-semibold">{category?.name || "Collection"}</span>
            {brandSlug && (
              <>
                <span>/</span>
                <span className="text-[#c5a059] font-semibold">{brandSlug.toUpperCase()}</span>
              </>
            )}
          </nav>

          <h1 className="text-3xl md:text-5xl font-outfit font-light tracking-tight text-luxury-charcoal">
            {category?.name || "Nos Collections"}
          </h1>
          <p className="text-xs text-luxury-gray max-w-2xl mt-2 font-light">
            {category?.description || "Explorez notre sélection méticuleusement sélectionnée d'appareils neufs sous blister et d'occasions certifiées."}
          </p>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white border border-black/5 p-4">
          {/* Brand Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-luxury-gray mr-2 font-semibold">Marque:</span>
            <button
              onClick={() => setSelectedBrand("all")}
              className={`px-3 py-1.5 text-xs transition-all ${
                selectedBrand === "all"
                  ? "bg-luxury-charcoal text-white"
                  : "bg-black/5 hover:bg-black/10 text-luxury-charcoal"
              }`}
            >
              Toutes ({products.length})
            </button>
            {availableBrands.map((bName) => (
              <button
                key={bName}
                onClick={() => setSelectedBrand(bName.toLowerCase())}
                className={`px-3 py-1.5 text-xs transition-all ${
                  selectedBrand.toLowerCase() === bName.toLowerCase()
                    ? "bg-[#c5a059] text-black font-semibold"
                    : "bg-black/5 hover:bg-black/10 text-luxury-charcoal"
                }`}
              >
                {bName}
              </button>
            ))}
          </div>

          {/* Condition & Sort */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Condition Toggle */}
            <div className="flex items-center border border-black/10">
              <button
                onClick={() => setSelectedCondition("all")}
                className={`px-3 py-1 text-xs ${selectedCondition === "all" ? "bg-luxury-charcoal text-white font-medium" : "text-luxury-gray"}`}
              >
                Tous
              </button>
              <button
                onClick={() => setSelectedCondition("new")}
                className={`px-3 py-1 text-xs ${selectedCondition === "new" ? "bg-luxury-charcoal text-white font-medium" : "text-luxury-gray"}`}
              >
                Neuf
              </button>
              <button
                onClick={() => setSelectedCondition("used")}
                className={`px-3 py-1 text-xs ${selectedCondition === "used" ? "bg-[#c5a059] text-black font-semibold" : "text-luxury-gray"}`}
              >
                Occasion Héritage
              </button>
            </div>

            {/* Price Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border border-black/10 text-xs px-3 py-1.5 text-luxury-charcoal focus:outline-none"
            >
              <option value="featured">Tri : Recommandés</option>
              <option value="price-asc">Prix : Croissant</option>
              <option value="price-desc">Prix : Décroissant</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                brand={product.brand?.name || "Maison"}
                price={product.base_price}
                promoPrice={product.promo_price || undefined}
                image={product.images[0] || "/hero/phone-aesthetic.jpg"}
                condition={product.condition}
                stockQty={product.totalStock ?? 5}
                specs={product.specs}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-black/10 p-16 text-center max-w-md mx-auto">
            <PackageX className="w-12 h-12 text-luxury-gray/30 mx-auto mb-4" />
            <h3 className="text-base font-outfit font-semibold text-luxury-charcoal mb-1">
              Aucun modèle dans cette sélection
            </h3>
            <p className="text-xs text-luxury-gray mb-6">
              Modifiez vos filtres de marque ou d&apos;état pour découvrir d&apos;autres pièces.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSelectedBrand("all"); setSelectedCondition("all"); }}
              className="border-black/15 rounded-none text-xs"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
