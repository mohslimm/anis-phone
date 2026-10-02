"use client";
import { useState, useEffect } from "react";

import { useCartStore } from "@/store/useCartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { isCartOpen, setCartOpen, items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Mon Panier ({items.reduce((acc, item) => acc + item.qty, 0)})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-luxury-gray">
              <ShoppingBag className="w-16 h-16 mb-6 text-luxury-gray/30 stroke-[1]" />
              <p className="text-sm font-outfit uppercase tracking-widest text-luxury-charcoal mb-2">Votre panier est vide</p>
              <p className="text-xs mb-8">Découvrez nos derniers smartphones et bons plans !</p>
              <Button onClick={() => setCartOpen(false)} className="bg-luxury-charcoal hover:bg-black rounded-none uppercase tracking-[0.2em] text-[10px]">
                Continuer mes achats
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full px-6">
              <div className="space-y-6 py-6">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="h-20 w-20 relative rounded-none border border-black/5 overflow-hidden shrink-0 bg-luxury-offwhite">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-luxury-gray uppercase tracking-widest">Image</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm line-clamp-2 text-luxury-charcoal">{item.name}</h3>
                          <p className="text-[10px] text-luxury-gray mt-1 uppercase tracking-wider">{item.variantLabel}</p>
                        </div>
                        <p className="font-medium whitespace-nowrap ml-4 text-luxury-charcoal">
                          {formatPrice(item.price * item.qty)} DZD
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-black/10 rounded-none h-8">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.qty - 1)}
                            className="w-8 h-full flex items-center justify-center text-luxury-gray hover:bg-black/5 hover:text-luxury-charcoal transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-[10px] font-medium">{item.qty}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.qty + 1)}
                            className="w-8 h-full flex items-center justify-center text-luxury-gray hover:bg-black/5 hover:text-luxury-charcoal transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-luxury-gray hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/5 p-6 bg-luxury-offwhite">
            <div className="flex justify-between text-sm font-medium mb-4 uppercase tracking-widest text-luxury-charcoal">
              <p>Sous-total</p>
              <p className="font-outfit">{formatPrice(getCartTotal())} DZD</p>
            </div>
            <p className="text-[10px] text-luxury-gray mb-6 uppercase tracking-wider">
              Les frais de livraison seront calculés à l'étape suivante.
            </p>
            <div className="space-y-2">
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="block">
                <Button className="w-full bg-luxury-charcoal hover:bg-black text-xs uppercase tracking-[0.2em] rounded-none py-6 transition-all" size="lg">
                  Commander
                </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
