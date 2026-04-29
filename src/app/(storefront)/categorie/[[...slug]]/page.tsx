"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/ui/product-card";
import { Loader2, PackageX } from "lucide-react";

export default function CategoryPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = use(params);
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [brand, setBrand] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract category slug and brand slug from catch-all params
  const categorySlug = resolvedParams.slug?.[0];
  const brandSlug = resolvedParams.slug?.[1];

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categorySlug) {
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      
      // 1. Get Category Details
      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", categorySlug)
        .single();

      if (catData) {
        setCategory(catData);
        
        // 2. Build Query for Products
        let query = supabase
          .from("products")
          .select("*, brands(name, slug)")
          .eq("category_id", catData.id);

        // 3. Handle Brand Filter if present
        if (brandSlug) {
           // We need to verify if the brand exists and matches
           const { data: brandData } = await supabase
             .from("brands")
             .select("*")
             .eq("slug", brandSlug)
             .single();
           
           if (brandData) {
             setBrand(brandData);
             query = query.eq("brand_id", brandData.id);
           }
        }

        const { data: prodData } = await query.order("created_at", { ascending: false });

        if (prodData) setProducts(prodData);
      }
      
      setIsLoading(false);
    };

    fetchCategoryData();
  }, [categorySlug, brandSlug]);

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
        <h1 className="text-2xl font-outfit font-light mb-4 text-luxury-charcoal uppercase tracking-tighter">Collection introuvable</h1>
        <p className="text-luxury-gray font-light">La sélection demandée n'existe pas ou a été déplacée.</p>
      </div>
    );
  }

  return (
    <div className="bg-luxury-offwhite min-h-screen pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-black/5 pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-start gap-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-luxury-gray uppercase">
              {brand ? `Marque : ${brand.name}` : "Collection complète"}
            </span>
            <h1 className="text-4xl md:text-6xl font-outfit font-black text-luxury-charcoal uppercase tracking-tighter">
              {category.name} {brand && <span className="text-luxury-gray/40">/ {brand.name}</span>}
            </h1>
            <div className="w-16 h-1 bg-luxury-charcoal mt-2"></div>
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
          <div className="flex flex-col items-center justify-center py-20 text-center border border-black/5 rounded-[3rem] bg-white shadow-sm">
            <PackageX className="w-16 h-16 text-luxury-gray mb-6 opacity-20" />
            <h3 className="text-2xl font-outfit font-bold text-luxury-charcoal mb-4 uppercase tracking-tighter">Aucun produit disponible</h3>
            <p className="text-sm text-luxury-gray max-w-xs font-light leading-relaxed">
              Nous n'avons pas encore d'articles correspondant à votre sélection {brand && `pour ${brand.name}`}. Revenez bientôt !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
