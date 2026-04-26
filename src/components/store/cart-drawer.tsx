"use client";

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
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500">
              <ShoppingBag className="w-16 h-16 mb-4 text-slate-200" />
              <p className="text-lg font-medium text-slate-900 mb-2">Votre panier est vide</p>
              <p className="text-sm mb-6">Découvrez nos derniers smartphones et bons plans !</p>
              <Button onClick={() => setCartOpen(false)} className="bg-blue-600 hover:bg-blue-700">
                Continuer mes achats
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full px-6">
              <div className="space-y-6 py-6">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="h-20 w-20 relative rounded-md border overflow-hidden shrink-0 bg-slate-50">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Image</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">{item.variantLabel}</p>
                        </div>
                        <p className="font-bold whitespace-nowrap ml-4 text-blue-600">
                          {formatPrice(item.price * item.qty)} DZD
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md h-8">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.qty - 1)}
                            className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.qty + 1)}
                            className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
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
          <div className="border-t p-6 bg-slate-50">
            <div className="flex justify-between text-base font-medium mb-4">
              <p>Sous-total</p>
              <p className="text-blue-600 font-bold">{formatPrice(getCartTotal())} DZD</p>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Les frais de livraison seront calculés à l'étape suivante.
            </p>
            <div className="space-y-2">
              <Link href="/checkout" onClick={() => setCartOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 shadow-md hover:shadow-lg transition-all" size="lg">
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
