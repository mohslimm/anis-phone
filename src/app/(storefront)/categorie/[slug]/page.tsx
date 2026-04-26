"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/ui/product-card";
import { Loader2, PackageX } from "lucide-react";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      const supabase = createClient();
      
      // 1. Get Category Details
      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", params.slug)
        .single();

      if (catData) {
        setCategory(catData);
        
        // 2. Get Products for this Category
        const { data: prodData } = await supabase
          .from("products")
          .select("*, brands(name)")
          .eq("category_id", catData.id)
          .order("created_at", { ascending: false });

        if (prodData) setProducts(prodData);
      }
      
      setIsLoading(false);
    };

    fetchCategoryData();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-luxury-charcoal mb-4" />
        <p className="text-luxury-gray font-outfit uppercase tracking-widest text-xs">Chargement de la collection...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-outfit font-light mb-4 text-luxury-charcoal">Catégorie introuvable</h1>
        <p className="text-luxury-gray">La sélection demandée n'existe pas ou a été déplacée.</p>
      </div>
    );
  }

  return (
    <div className="bg-luxury-offwhite min-h-screen pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-black/5 pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-start gap-4">
            <span className="text-[10px] font-bold tracking-[0.2em] text-luxury-gray uppercase">Collection</span>
            <h1 className="text-4xl md:text-5xl font-outfit font-light text-luxury-charcoal capitalize">
              {category.name}
            </h1>
            <div className="w-12 h-[1px] bg-luxury-charcoal mt-2"></div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
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
            <h3 className="text-lg font-outfit font-light text-luxury-charcoal mb-2">Aucun produit disponible</h3>
            <p className="text-sm text-luxury-gray max-w-xs">
              Nous n'avons pas encore d'articles dans cette catégorie. Revenez bientôt !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
