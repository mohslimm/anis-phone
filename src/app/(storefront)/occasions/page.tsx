"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/ui/product-card";
import { Loader2, PackageX } from "lucide-react";

export default function OccasionsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOccasions = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*, brands(name)")
        .eq("condition", "used")
        .order("created_at", { ascending: false });

      if (data) setProducts(data);
      setIsLoading(false);
    };

    fetchOccasions();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-luxury-charcoal mb-4" />
        <p className="text-luxury-gray font-outfit uppercase tracking-widest text-xs">Collection Héritage en cours...</p>
      </div>
    );
  }

  return (
    <div className="bg-luxury-offwhite min-h-screen pb-24">
      <div className="bg-white border-b border-black/5 pt-32 pb-16">
        <div className="container mx-auto px-6 text-center">
          <span className="text-[10px] font-bold tracking-[0.2em] text-luxury-gray uppercase">Collection Certifiée</span>
          <h1 className="text-4xl md:text-5xl font-outfit font-light text-luxury-charcoal mt-2 mb-4">
            Pièces d'Occasions
          </h1>
          <p className="text-luxury-gray max-w-lg mx-auto text-sm font-light">
            Découvrez notre sélection de smartphones reconditionnés et occasions premium, authentifiés par nos experts avec une garantie complète.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                {...product}
                slug={product.slug}
                brand={product.brands?.name || ""}
                price={product.base_price}
                promoPrice={product.promo_price}
                image={product.images?.[0] || ""}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-black/5 rounded-3xl bg-white">
            <PackageX className="w-12 h-12 text-luxury-gray mb-4 opacity-20" />
            <h3 className="text-lg font-outfit font-light text-luxury-charcoal mb-2">Stock épuisé</h3>
            <p className="text-sm text-luxury-gray max-w-xs">
              Nos pièces d'occasion partent vite. Revenez plus tard pour de nouvelles arrivées.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
