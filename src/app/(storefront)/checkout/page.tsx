"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, ArrowLeft, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";

const wilayas = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", "06 - Béjaïa",
  "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira", "11 - Tamanrasset", "12 - Tébessa",
  "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou", "16 - Alger", "17 - Djelfa", "18 - Jijel",
  "19 - Sétif", "20 - Saïda", "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma",
  "25 - Constantine", "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla",
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arreridj", "35 - Boumerdès",
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma", "46 - Aïn Témouchent",
  "47 - Ghardaïa", "48 - Relizane", "49 - Timimoun", "50 - Bordj Badji Mokhtar", "51 - Ouled Djellal",
  "52 - Béni Abbès", "53 - In Salah", "54 - In Guezzam", "55 - Touggourt", "56 - Djanet",
  "57 - El M'Ghair", "58 - El Meniaa"
];

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Prevent hydration mismatch for Zustand
  useEffect(() => {
    setMounted(true);
  }, []);

  const total = getCartTotal();
  // Simplified shipping cost logic. Ideally, varies by Wilaya
  const shippingCost = 600; 
  const grandTotal = total + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to Supabase to save order and order_items
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <PackageCheck className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Commande Confirmée !</h1>
        <p className="text-slate-600 max-w-md mx-auto mb-8">
          Merci pour votre confiance. Votre commande a été enregistrée avec succès. Nos équipes vous contacteront dans les plus brefs délais pour la confirmation vocale.
        </p>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8">Retour à la boutique</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <Link href="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la boutique
        </Link>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Validation de la commande</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Area */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6">Informations de livraison</h2>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Nom & Prénom <span className="text-red-500">*</span></Label>
                    <Input id="fullname" placeholder="Ex: Mohamed Amine" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de Téléphone <span className="text-red-500">*</span></Label>
                    <Input id="phone" type="tel" placeholder="0550 12 34 56" required />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="wilaya">Wilaya <span className="text-red-500">*</span></Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre Wilaya" />
                      </SelectTrigger>
                      <SelectContent>
                        {wilayas.map((w) => (
                          <SelectItem key={w} value={w}>{w}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commune">Commune <span className="text-red-500">*</span></Label>
                    <Input id="commune" placeholder="Ex: Bab Ezzouar" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse complète <span className="text-red-500">*</span></Label>
                  <Input id="address" placeholder="N° de rue, bâtiment, étage..." required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optionnel)</Label>
                  <textarea 
                    id="notes"
                    className="w-full flex min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Instructions de livraison spécifiques..."
                  ></textarea>
                </div>

                {/* Trust Elements */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4 mt-8">
                  <div className="p-2 bg-blue-600 text-white rounded-full shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Paiement 100% Sécurisé</h4>
                    <p className="text-sm text-blue-700 mt-1">Vous ne payez le livreur qu'après avoir reçu et vérifié votre commande en main propre.</p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-5/12">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-28">
              <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-md border flex items-center justify-center shrink-0 text-xs">
                        Img
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm line-clamp-1">{item.name}</span>
                        <span className="text-xs text-slate-500">{item.variantLabel} x {item.qty}</span>
                      </div>
                    </div>
                    <div className="font-medium text-sm whitespace-nowrap">
                      {formatPrice(item.price * item.qty)} DZD
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-4" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Sous-total</span>
                  <span className="font-medium">{formatPrice(total)} DZD</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span className="flex items-center gap-2">Frais de livraison <Truck className="w-4 h-4"/></span>
                  <span className="font-medium">{formatPrice(shippingCost)} DZD</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">Total à payer</span>
                  <span className="text-2xl font-black text-blue-600">{formatPrice(grandTotal)} DZD</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-lg shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? "Enregistrement en cours..." : "Confirmer ma commande"}
              </Button>
              <p className="text-xs text-center text-slate-400 mt-4">
                En confirmant, vous acceptez nos conditions générales de vente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
