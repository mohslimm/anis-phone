"use client";

import { useEffect, useState, use, useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/product-card";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductSkeleton } from "@/components/ui/product-skeleton";
import { DataService, Product, Category } from "@/lib/data-service";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
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
          DataService.getProducts({ categorySlug: slug }),
        ]);

        const currentCat = cats.find((c) => c.slug === slug);
        setCategory(currentCat || { id: `c-${slug}`, name: slug, slug, order: 99 });
        setProducts(prods);
      } catch (e) {
        console.error("Error loading category products:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

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
      const matchBrand = selectedBrand === "all" || p.brand?.name === selectedBrand;
      const matchCondition = selectedCondition === "all" || p.condition === selectedCondition;
      return matchBrand && matchCondition;
    });

    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.promo_price || a.base_price) - (b.promo_price || b.base_price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.promo_price || b.base_price) - (a.promo_price || a.base_price));
    }

    return result;
  }, [products, selectedBrand, selectedCondition, sortBy]);

  if (isLoading) {
    return (
      <div className="bg-luxury-offwhite min-h-screen pb-24 pt-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="w-32 h-4 bg-black/5 mb-4 animate-pulse" />
          <div className="w-64 h-10 bg-black/5 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-luxury-offwhite min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-white border-b border-black/5 pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Breadcrumbs */}
          <nav className="text-[11px] text-luxury-gray uppercase tracking-widest mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-black">Accueil</Link>
            <span>/</span>
            <span className="text-luxury-charcoal font-semibold">{category?.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
                Collection Showroom
              </span>
              <h1 className="text-4xl md:text-5xl font-outfit font-light text-luxury-charcoal capitalize">
                {category?.name}
              </h1>
              {category?.description && (
                <p className="text-xs text-luxury-gray mt-2 max-w-md font-light">
                  {category.description}
                </p>
              )}
            </div>

            <span className="text-xs text-luxury-gray font-mono">
              {displayedProducts.length} modèle(s) sélectionné(s)
            </span>
          </div>

          {/* Filter Bar */}
          <div className="mt-10 pt-6 border-t border-black/5 flex flex-wrap items-center justify-between gap-4">
            {/* Brands Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedBrand("all")}
                className={`px-3 py-1.5 text-xs rounded-none border transition-colors ${
                  selectedBrand === "all"
                    ? "bg-luxury-charcoal text-white border-luxury-charcoal"
                    : "bg-white text-luxury-gray border-black/10 hover:border-black/30"
                }`}
              >
                Toutes les marques
              </button>
              {availableBrands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-3 py-1.5 text-xs rounded-none border transition-colors ${
                    selectedBrand === b
                      ? "bg-luxury-charcoal text-white border-luxury-charcoal"
                      : "bg-white text-luxury-gray border-black/10 hover:border-black/30"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Condition & Sort */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {["all", "new", "used"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCondition(c)}
                    className={`px-2.5 py-1 text-xs rounded-none border transition-colors ${
                      selectedCondition === c
                        ? "bg-luxury-charcoal text-white border-luxury-charcoal"
                        : "bg-white text-luxury-gray border-black/10 hover:border-black/30"
                    }`}
                  >
                    {c === "all" ? "Tous" : c === "new" ? "Neuf" : "Héritage"}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-8 px-2 text-xs border border-black/15 bg-white text-luxury-charcoal rounded-none outline-none"
              >
                <option value="featured">Tri : En vedette</option>
                <option value="price-asc">Prix : Croissant</option>
                <option value="price-desc">Prix : Décroissant</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 max-w-6xl py-16">
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
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
