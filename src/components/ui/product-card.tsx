"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/format";

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  promoPrice?: number;
  image: string;
  condition: "new" | "used";
  stockQty: number;
  specs: { ram?: string; storage?: string; battery?: string };
}

export function ProductCard({ 
  id, 
  slug,
  name, 
  brand, 
  price, 
  promoPrice, 
  image, 
  condition, 
  stockQty,
  specs 
}: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const isOutOfStock = stockQty === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    if (isOutOfStock) return;
    
    addItem({
      cartItemId: `${id}-default`,
      productId: id,
      variantId: "default",
      name,
      variantLabel: `${specs.storage || ""} ${specs.ram ? `(${specs.ram})` : ""}`,
      price: promoPrice || price,
      qty: 1,
      image
    });
  };

  return (
    <Link href={`/produit/${slug}`}>
      <div 
        className="group relative flex flex-col bg-white border border-black/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {condition === "used" && (
            <Badge className="bg-luxury-sand text-luxury-charcoal hover:bg-black hover:text-white border border-black/10 text-[10px] uppercase tracking-widest font-normal rounded-none">Héritage</Badge>
          )}
          {promoPrice && (
            <Badge className="bg-luxury-charcoal text-white hover:bg-black border-0 text-[10px] uppercase tracking-widest font-normal rounded-none">Exclusivité</Badge>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-4 right-4 z-10">
          {isOutOfStock ? (
            <Badge className="bg-red-50 text-red-700 border border-red-100 font-normal rounded-none text-[10px]">Épuisé</Badge>
          ) : stockQty < 5 ? (
            <Badge className="bg-orange-50 text-orange-700 border border-orange-100 font-normal rounded-none text-[10px]">Stock Limité</Badge>
          ) : (
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-normal rounded-none text-[10px]">Disponible</Badge>
          )}
        </div>

        {/* Image Area */}
        <div className="relative aspect-[4/5] w-full bg-luxury-offwhite p-8 flex items-center justify-center overflow-hidden">
          <Image 
            src={image || "/placeholder.svg"} 
            alt={name || "Product"} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 font-sans">
          <p className="text-[10px] font-semibold text-luxury-gray mb-2 uppercase tracking-widest">{brand}</p>
          <h3 className="font-outfit text-xl text-luxury-charcoal font-light leading-tight mb-4">
            {name}
          </h3>

          {/* Specs / Tags */}
          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            {specs.storage && <span className="text-[10px] font-medium text-luxury-charcoal bg-black/5 px-2 py-1">{specs.storage}</span>}
            {specs.ram && <span className="text-[10px] font-medium text-luxury-charcoal bg-black/5 px-2 py-1">{specs.ram}</span>}
            {specs.battery && <span className="text-[10px] font-medium text-luxury-charcoal bg-black/5 px-2 py-1">{specs.battery}</span>}
          </div>

          {/* Price & Action */}
          <div className="flex items-end justify-between mt-auto pt-6 border-t border-black/5">
            <div className="flex flex-col">
              {promoPrice ? (
                <>
                  <p className="text-lg font-outfit text-luxury-charcoal font-medium">{formatPrice(promoPrice)} DZD</p>
                  <p className="text-xs text-luxury-gray line-through">{formatPrice(price)} DZD</p>
                </>
              ) : (
                <p className="text-lg font-outfit text-luxury-charcoal font-medium">{formatPrice(price)} DZD</p>
              )}
            </div>

            <Button 
              size="icon"
              className={`rounded-none w-10 h-10 transition-all duration-300 ${isOutOfStock ? "bg-black/5 text-black/30 cursor-not-allowed" : "bg-transparent border border-luxury-charcoal text-luxury-charcoal hover:bg-luxury-charcoal hover:text-white"}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
