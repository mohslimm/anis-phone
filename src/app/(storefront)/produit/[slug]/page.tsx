"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Truck, CreditCard, RotateCcw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const { addItem, setCartOpen } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, brands(name), variants(*)")
        .eq("slug", params.slug)
        .single();

      if (data) {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      cartItemId: selectedVariant ? `${product.id}-${selectedVariant.id}` : `${product.id}-default`,
      productId: product.id,
      variantId: selectedVariant?.id || "default",
      name: product.name,
      variantLabel: selectedVariant?.label || "",
      price: selectedVariant ? (product.promo_price ? product.promo_price + selectedVariant.price_offset : product.base_price + selectedVariant.price_offset) : (product.promo_price || product.base_price),
      qty: 1,
      image: product.images?.[0] || ""
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setCartOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-luxury-charcoal mb-4" />
        <p className="text-luxury-gray font-outfit uppercase tracking-widest text-xs">Excellence en cours...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-outfit font-light mb-4">Pièce introuvable</h1>
        <p className="text-luxury-gray">Cet article n'est plus disponible ou n'existe pas.</p>
        <Button onClick={() => router.push("/")} className="mt-8 bg-luxury-charcoal text-white rounded-none">Retour à la collection</Button>
      </div>
    );
  }

  const currentPrice = selectedVariant 
    ? (product.promo_price ? product.promo_price + selectedVariant.price_offset : product.base_price + selectedVariant.price_offset) 
    : (product.promo_price || product.base_price);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Gallery Area */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="relative aspect-[4/5] bg-luxury-offwhite border border-black/5 overflow-hidden group">
              {product.images && product.images.length > 0 ? (
                <Image 
                  src={product.images[activeImage]} 
                  alt={product.name}
                  fill
                  className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-luxury-gray opacity-20 uppercase tracking-[0.2em] text-xs">
                  Aucun visuel
                </div>
              )}
              
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <Badge className="bg-luxury-charcoal text-white text-[10px] tracking-widest uppercase font-normal rounded-none px-3 py-1">
                  {product.condition === "new" ? "Neuf Certifié" : "Héritage Certifié"}
                </Badge>
                {product.promo_price && (
                  <Badge className="bg-red-500 text-white text-[10px] tracking-widest uppercase font-normal rounded-none px-3 py-1">
                    Offre Limitée
                  </Badge>
                )}
              </div>
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex flex-wrap gap-4">
                {product.images.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-24 border transition-all ${activeImage === idx ? 'border-luxury-charcoal' : 'border-black/5 opacity-50 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Area */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-10 space-y-4">
              <span className="text-[10px] font-bold tracking-[0.2em] text-luxury-gray uppercase">
                {product.brands?.name}
              </span>
              <h1 className="text-4xl md:text-5xl font-outfit font-light text-luxury-charcoal leading-tight">
                {product.name}
              </h1>
              <div className="w-12 h-[1px] bg-luxury-charcoal"></div>
            </div>

            <div className="mb-12">
              <div className="flex items-baseline gap-4">
                <h2 className="text-3xl font-outfit font-semibold text-luxury-charcoal">
                  {formatPrice(currentPrice)} <span className="text-sm font-medium">DZD</span>
                </h2>
                {product.promo_price && !selectedVariant && (
                  <span className="text-lg text-luxury-gray line-through font-light">
                    {formatPrice(product.base_price)} DZD
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Pièce disponible en stock
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-12 space-y-4">
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-luxury-charcoal uppercase">Configuration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => v.stock_qty > 0 && setSelectedVariant(v)}
                      disabled={v.stock_qty === 0}
                      className={`group relative p-4 border text-left transition-all ${
                        selectedVariant?.id === v.id 
                          ? 'border-luxury-charcoal bg-luxury-charcoal text-white' 
                          : v.stock_qty > 0 
                            ? 'border-black/5 hover:border-black/20' 
                            : 'border-black/5 bg-black/[0.02] opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1">{v.label}</p>
                      <p className={`text-[10px] ${selectedVariant?.id === v.id ? 'text-white/60' : 'text-luxury-gray'}`}>
                        {v.stock_qty > 0 ? (v.price_offset === 0 ? "Prix standard" : `+ ${formatPrice(v.price_offset)} DZD`) : 'Rupture de stock'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                onClick={handleAddToCart} 
                className="h-14 flex-1 bg-transparent border border-luxury-charcoal text-luxury-charcoal hover:bg-luxury-charcoal hover:text-white rounded-none text-xs font-bold uppercase tracking-[0.2em] transition-all"
              >
                Ajouter au Panier
              </Button>
              <Button 
                onClick={handleBuyNow} 
                className="h-14 flex-1 bg-luxury-charcoal text-white hover:bg-black rounded-none text-xs font-bold uppercase tracking-[0.2em] transition-all"
              >
                Acquisition Immédiate
              </Button>
            </div>

            {/* Service Badges */}
            <div className="grid grid-cols-2 gap-px bg-black/5 border border-black/5 mb-12">
              {[
                { icon: Truck, title: "Livraison 58 Wilayas", desc: "Service Express Sécurisé" },
                { icon: Shield, title: "Garantie Excellence", desc: "Couverture Nationale" },
                { icon: RotateCcw, title: "Politique de Retour", desc: "Sérénité sous 7 jours" },
                { icon: CreditCard, title: "Mode de Paiement", desc: "À la Livraison / CCP" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col p-6 bg-white gap-3">
                  <item.icon className="w-5 h-5 stroke-[1.5] text-luxury-charcoal" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-luxury-charcoal uppercase tracking-wider">{item.title}</p>
                    <p className="text-[10px] text-luxury-gray">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description & Specs */}
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-luxury-charcoal uppercase">Description</h3>
                <p className="text-sm text-luxury-gray leading-relaxed font-light">{product.description}</p>
              </div>
              
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] text-luxury-charcoal uppercase">Fiche Technique</h3>
                  <div className="border border-black/5 divide-y divide-black/5">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex items-center py-3 px-4">
                        <span className="w-1/3 text-[10px] font-bold text-luxury-charcoal uppercase tracking-wider">{key}</span>
                        <span className="w-2/3 text-[11px] text-luxury-gray font-light">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
