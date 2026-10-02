"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductCard } from "./product-card";
import { ProductSkeleton } from "./product-skeleton";
import { ArrowRight, AlertCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";
import { DataService, Product } from "@/lib/data-service";

interface ProductGridProps {
  title: string;
  categorySlug?: string;
  condition?: "new" | "used";
  limit?: number;
  viewAllLink?: string;
}

export function ProductGrid({ 
  title, 
  categorySlug, 
  condition, 
  limit = 4,
  viewAllLink
}: ProductGridProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Tente via DataService (résilient avec fallback instantané)
      const data = await DataService.getProducts({
        categorySlug,
        condition,
        limit,
      });

      const formattedProducts = data.map((p) => ({
        ...p,
        brand: p.brand?.name || "Marque",
        price: p.base_price,
        promoPrice: p.promo_price,
        image: p.images?.[0] || "/hero/phone-aesthetic.jpg",
        stockQty: (p.variants || []).reduce((acc: number, v: any) => acc + (v.stock_qty || 0), 0),
        specs: p.specs || {}
      }));

      setProducts(formattedProducts);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      // Fallback direct
      const fallback = await DataService.getProducts({ condition, limit });
      setProducts(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categorySlug, condition, limit]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 bg-red-50 border border-red-100 rounded-none my-12">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
        <Button 
          variant="outline" 
          onClick={fetchProducts}
          className="flex items-center gap-2 border-red-200 hover:bg-red-100"
        >
          <RefreshCcw className="w-4 h-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-12 border-b border-black/10 pb-6 gap-4">
        <h2 className="font-outfit text-3xl font-light text-luxury-charcoal">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-xs font-semibold uppercase tracking-widest hover:text-luxury-gray transition-colors flex items-center group">
            Voir tout <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading ? (
          Array.from({ length: limit }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-luxury-gray font-light italic">
            Aucun produit trouvé dans cette catégorie.
          </div>
        )}
      </div>
    </section>
  );
}
