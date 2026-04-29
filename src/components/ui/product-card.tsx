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
        className="group relative flex flex-col glass rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {condition === "used" && (
            <Badge className="bg-slate-100/80 backdrop-blur-sm text-slate-800 hover:bg-slate-200 border border-white/20 text-[10px] font-medium rounded-full shadow-sm">Héritage</Badge>
          )}
          {promoPrice && (
            <Badge className="bg-indigo-500/90 backdrop-blur-sm text-white hover:bg-indigo-600 border-0 text-[10px] font-medium rounded-full shadow-sm shadow-indigo-500/20">Exclusivité</Badge>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-4 right-4 z-10">
          {isOutOfStock ? (
            <Badge className="bg-red-50/90 backdrop-blur-sm text-red-600 border border-red-100 font-medium rounded-full text-[10px]">Épuisé</Badge>
          ) : stockQty < 5 ? (
            <Badge className="bg-orange-50/90 backdrop-blur-sm text-orange-600 border border-orange-100 font-medium rounded-full text-[10px]">Stock Limité</Badge>
          ) : (
            <Badge className="bg-emerald-50/90 backdrop-blur-sm text-emerald-600 border border-emerald-100 font-medium rounded-full text-[10px]">Disponible</Badge>
          )}
        </div>

        {/* Image Area */}
        <div className="relative aspect-[4/5] w-full bg-slate-50/50 p-8 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image 
            src={image || "/placeholder.svg"} 
            alt={name || "Product"} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 font-sans bg-white/40">
          <p className="text-[11px] font-medium text-slate-500 mb-1">{brand}</p>
          <h3 className="font-outfit text-lg text-slate-800 font-medium leading-tight mb-3 group-hover:text-indigo-600 transition-colors">
            {name}
          </h3>

          {/* Specs / Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
            {specs.storage && <span className="text-[11px] font-medium text-slate-600 bg-white/60 border border-slate-100 px-2 py-0.5 rounded-md shadow-sm">{specs.storage}</span>}
            {specs.ram && <span className="text-[11px] font-medium text-slate-600 bg-white/60 border border-slate-100 px-2 py-0.5 rounded-md shadow-sm">{specs.ram}</span>}
            {specs.battery && <span className="text-[11px] font-medium text-slate-600 bg-white/60 border border-slate-100 px-2 py-0.5 rounded-md shadow-sm">{specs.battery}</span>}
          </div>

          {/* Price & Action */}
          <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
            <div className="flex flex-col">
              {promoPrice ? (
                <>
                  <p className="text-lg font-outfit text-indigo-600 font-semibold">{formatPrice(promoPrice)} DZD</p>
                  <p className="text-xs text-slate-400 line-through">{formatPrice(price)} DZD</p>
                </>
              ) : (
                <p className="text-lg font-outfit text-slate-800 font-semibold">{formatPrice(price)} DZD</p>
              )}
            </div>

            <Button 
              size="icon"
              className={`rounded-xl w-10 h-10 transition-all duration-300 shadow-sm ${isOutOfStock ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white border border-slate-200 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-indigo-200"}`}
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
