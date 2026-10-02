"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Flame, 
  Clock, 
  ShieldCheck, 
  Truck, 
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ui/product-card";
import { DataService, Product } from "@/lib/data-service";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/useCartStore";

export default function PromosPage() {
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 34, seconds: 22 });
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  useEffect(() => {
    const loadPromos = async () => {
      const all = await DataService.getProducts();
      // Articles en promo ou flash
      const filtered = all.filter((p) => p.promo_price || p.category_id === "c-promos");
      setPromoProducts(filtered);
    };
    loadPromos();

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const starDeal = promoProducts[0];

  const handleBuyStarDeal = () => {
    if (!starDeal) return;
    addItem({
      cartItemId: `${starDeal.id}-deal`,
      productId: starDeal.id,
      variantId: starDeal.variants?.[0]?.id || "default",
      name: starDeal.name,
      variantLabel: starDeal.variants?.[0]?.label || "Offre Flash",
      price: starDeal.promo_price || starDeal.base_price,
      qty: 1,
      image: starDeal.images[0]
    });
    setCartOpen(true);
  };

  return (
    <div className="bg-luxury-offwhite min-h-screen pt-28 pb-24">
      {/* Hero Flash Banner */}
      <div className="bg-luxury-charcoal text-white py-16 border-b border-black/10">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 text-xs uppercase tracking-widest font-semibold mb-4">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            Vente Privée Flash • Quantités Limitées
          </div>

          <h1 className="text-4xl md:text-6xl font-outfit font-light text-white mb-4 leading-tight">
            L&apos;Affaire du Jour
          </h1>
          <p className="text-sm md:text-base text-luxury-sand/80 max-w-xl mx-auto font-light leading-relaxed">
            Opportunités d&apos;exception sélectionnées par Anis Phone. Prix privilégiés garantis avec expédition express 58 Wilayas.
          </p>

          {/* Countdown Clock */}
          <div className="mt-8 inline-flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3">
            <Clock className="w-5 h-5 text-[#c5a059]" />
            <span className="text-xs uppercase tracking-widest text-[#f0ede8]/70">Fin de l&apos;offre dans :</span>
            <div className="flex items-center gap-2 font-mono text-xl font-bold text-white">
              <span className="bg-black/40 px-2 py-1">{String(timeLeft.hours).padStart(2, "0")}h</span>
              <span>:</span>
              <span className="bg-black/40 px-2 py-1">{String(timeLeft.minutes).padStart(2, "0")}m</span>
              <span>:</span>
              <span className="bg-black/40 px-2 py-1">{String(timeLeft.seconds).padStart(2, "0")}s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl mt-12 space-y-16">
        {/* Vedette Deal Hero Box */}
        {starDeal && (
          <div className="bg-white border border-black/10 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-lg">
            <div className="relative aspect-[4/3] bg-luxury-sand/40 border border-black/5 overflow-hidden flex items-center justify-center p-6">
              <Image
                src={starDeal.images[0]}
                alt={starDeal.name}
                fill
                className="object-contain p-6 hover:scale-105 transition-transform duration-500"
              />
              <Badge className="absolute top-4 left-4 bg-red-600 text-white font-bold rounded-none px-3 py-1 text-xs uppercase tracking-widest">
                - {formatPrice((starDeal.base_price - (starDeal.promo_price || starDeal.base_price)))} DZD
              </Badge>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest block mb-1">
                  Exclusivité Showroom
                </span>
                <h2 className="text-3xl font-outfit font-light text-luxury-charcoal">
                  {starDeal.name}
                </h2>
                <p className="text-xs text-luxury-gray mt-2 leading-relaxed font-light">
                  {starDeal.description}
                </p>
              </div>

              <div className="flex items-baseline gap-4 border-y border-black/5 py-4">
                <span className="text-3xl font-outfit font-bold text-luxury-charcoal">
                  {formatPrice(starDeal.promo_price || starDeal.base_price)} DZD
                </span>
                <span className="text-base text-luxury-gray line-through font-mono">
                  {formatPrice(starDeal.base_price)} DZD
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleBuyStarDeal}
                  className="flex-1 h-12 bg-luxury-charcoal text-white hover:bg-black rounded-none text-xs uppercase tracking-widest font-semibold"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Acquisition Immédiate
                </Button>
                <Link href={`/produit/${starDeal.slug}`}>
                  <Button variant="outline" className="h-12 border-black/15 rounded-none text-xs hover:bg-black/5">
                    Voir la fiche complète
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] text-luxury-gray pt-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#c5a059]" />
                  <span>Livraison prioritaire 58 Wilayas</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                  <span>Garantie 12 mois avec facture</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Autres Offres Privilèges */}
        <div>
          <div className="border-b border-black/10 pb-4 mb-8 flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-luxury-gray font-bold">Sélection Flash</span>
              <h3 className="text-2xl font-outfit font-light text-luxury-charcoal">
                Toutes les Ventes Privilèges Actuelles
              </h3>
            </div>
            <span className="text-xs text-luxury-gray font-mono">{promoProducts.length} articles disponibles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {promoProducts.slice(1).map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                brand={p.brand?.name || "Maison"}
                price={p.base_price}
                promoPrice={p.promo_price || undefined}
                image={p.images[0]}
                condition={p.condition}
                stockQty={p.totalStock || 3}
                specs={p.specs}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
