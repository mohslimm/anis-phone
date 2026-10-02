"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataService, Product } from "@/lib/data-service";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/useCartStore";

export default function PacksPage() {
  const [packProducts, setPackProducts] = useState<Product[]>([]);
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  useEffect(() => {
    const loadPacks = async () => {
      const all = await DataService.getProducts();
      const packs = all.filter((p) => p.category_id === "c-packs" || p.slug.includes("pack"));
      setPackProducts(packs);
    };
    loadPacks();
  }, []);

  const handleAddPack = (pack: Product) => {
    addItem({
      cartItemId: `${pack.id}-pack`,
      productId: pack.id,
      variantId: pack.variants?.[0]?.id || "default",
      name: pack.name,
      variantLabel: "Pack Complet",
      price: pack.promo_price || pack.base_price,
      qty: 1,
      image: pack.images[0]
    });
    setCartOpen(true);
  };

  return (
    <div className="bg-luxury-offwhite min-h-screen pt-28 pb-24">
      {/* Header Banner */}
      <div className="bg-white border-b border-black/5 py-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
            Combinaisons Complètes Showroom
          </span>
          <h1 className="text-4xl md:text-5xl font-outfit font-light text-luxury-charcoal mb-4">
            Packs Technologiques Exclusifs
          </h1>
          <p className="text-sm text-luxury-gray max-w-xl mx-auto font-light leading-relaxed">
            Profitez de synergies parfaites : smartphone haut de gamme, accessoires audio et chargeurs haute vitesse réunis au meilleur tarif préférentiel.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl mt-12 space-y-12">
        {packProducts.map((pack) => {
          const discount = pack.promo_price ? pack.base_price - pack.promo_price : 20000;
          return (
            <div 
              key={pack.id} 
              className="bg-white border border-black/10 p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image Preview (5/12) */}
              <div className="md:col-span-5 relative aspect-[4/3] bg-luxury-sand/40 border border-black/5 flex items-center justify-center p-6">
                <Image
                  src={pack.images[0]}
                  alt={pack.name}
                  fill
                  className="object-contain p-6"
                />
                <Badge className="absolute top-4 left-4 bg-[#c5a059] text-white font-bold rounded-none px-3 py-1 text-[11px] uppercase tracking-widest">
                  Économie : {formatPrice(discount)} DZD
                </Badge>
              </div>

              {/* Details & Specs (7/12) */}
              <div className="md:col-span-7 space-y-5">
                <div>
                  <span className="text-xs font-bold text-luxury-gray uppercase tracking-widest block mb-1">
                    Pack Prêt à l&apos;Emploi
                  </span>
                  <h2 className="text-2xl md:text-3xl font-outfit font-semibold text-luxury-charcoal">
                    {pack.name}
                  </h2>
                  <p className="text-xs text-luxury-gray mt-2 leading-relaxed">
                    {pack.description}
                  </p>
                </div>

                {/* Included Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 border-y border-black/5 text-xs text-luxury-charcoal">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#c5a059]" />
                    <span>Garantie 12 Mois Pièces & Main d&apos;œuvre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#c5a059]" />
                    <span>Livraison Express 58 Wilayas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#c5a059]" />
                    <span>Paiement à la livraison après inspection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#c5a059]" />
                    <span>Accessoires certifiés 100% originaux</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div>
                    <div className="text-2xl md:text-3xl font-outfit font-semibold text-luxury-charcoal">
                      {formatPrice(pack.promo_price || pack.base_price)} <span className="text-xs font-normal">DZD</span>
                    </div>
                    {pack.promo_price && (
                      <span className="text-xs text-luxury-gray line-through">
                        {formatPrice(pack.base_price)} DZD
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleAddPack(pack)}
                      className="bg-luxury-charcoal hover:bg-black text-white h-12 px-6 rounded-none text-xs uppercase tracking-widest flex items-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Commander ce pack
                    </Button>
                    <Link href={`/produit/${pack.slug}`}>
                      <Button variant="outline" className="h-12 border-black/15 rounded-none text-xs hover:bg-black/5">
                        Détails
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
