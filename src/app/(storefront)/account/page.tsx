"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Phone, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  MessageSquare,
  ArrowRight,
  User,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataService, Order, OrderStatus } from "@/lib/data-service";
import { formatPrice } from "@/lib/format";

export default function AccountPage() {
  const [phoneSearch, setPhoneSearch] = useState("");
  const [searchedOrders, setSearchedOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Load recent orders from localStorage if any
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const lastOrder = localStorage.getItem("anis_phone_last_order");
        if (lastOrder) {
          const order = await DataService.getOrderById(lastOrder);
          if (order) {
            setSelectedOrder(order);
            setSearchedOrders([order]);
            setHasSearched(true);
            setPhoneSearch(order.phone);
          }
        }
      } catch (e) {
        console.error("Error loading last order:", e);
      }
    };
    loadSaved();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch.trim()) return;

    const all = await DataService.getOrders();
    const cleanQuery = phoneSearch.replace(/\s+/g, "").toLowerCase();

    const matches = all.filter(o => 
      o.phone.replace(/\s+/g, "").includes(cleanQuery) ||
      o.id.toLowerCase().includes(cleanQuery)
    );

    setSearchedOrders(matches);
    setHasSearched(true);
    if (matches.length > 0) {
      setSelectedOrder(matches[0]);
    } else {
      setSelectedOrder(null);
    }
  };

  const getStepActiveIndex = (status: OrderStatus) => {
    switch (status) {
      case "pending": return 0;
      case "confirmed": return 1;
      case "shipped": return 2;
      case "delivered": return 3;
      case "cancelled": return -1;
    }
  };

  return (
    <div className="bg-luxury-offwhite min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
            Espace Client & Logistique
          </span>
          <h1 className="text-3xl md:text-4xl font-outfit font-light text-luxury-charcoal">
            Suivi de Commande & Compte
          </h1>
          <p className="text-xs text-luxury-gray mt-2 leading-relaxed">
            Consultez en temps réel l&apos;acheminement de votre colis à travers les 58 Wilayas et accédez à vos justificatifs d&apos;achat.
          </p>
        </div>

        {/* Quick Lookup Card */}
        <div className="bg-white border border-black/10 p-6 md:p-8 rounded-none shadow-sm mb-12">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-luxury-gray" />
              <Input
                type="text"
                placeholder="Entrez votre numéro de téléphone (ex: 0550123456) ou N° de commande..."
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                className="pl-10 h-12 border-black/10 text-sm focus:border-luxury-charcoal rounded-none"
              />
            </div>
            <Button 
              type="submit" 
              className="h-12 px-8 bg-luxury-charcoal text-white hover:bg-black rounded-none text-xs uppercase tracking-widest font-semibold"
            >
              Rechercher mes commandes
            </Button>
          </form>

          <p className="text-[11px] text-luxury-gray mt-3 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
            Accès sécurisé et immédiat sans création de mot de passe obligatoire.
          </p>
        </div>

        {/* Search Results / Order Tracking View */}
        {hasSearched ? (
          searchedOrders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order List Sidebar (1/3) */}
              <div className="lg:col-span-1 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal mb-4">
                  Vos Commandes Récentes ({searchedOrders.length})
                </h3>
                <div className="space-y-2">
                  {searchedOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`w-full text-left p-4 border transition-all rounded-none block ${
                          isSelected
                            ? "bg-white border-luxury-charcoal shadow-md"
                            : "bg-white/60 border-black/5 hover:bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono text-xs font-bold text-luxury-charcoal">
                            #{order.id}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-[#c5a059]">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-luxury-gray">
                          {new Date(order.created_at).toLocaleDateString("fr-FR")} • {order.wilaya}
                        </div>
                        <div className="font-mono font-semibold text-xs text-luxury-charcoal mt-2">
                          {formatPrice(order.total_dzd)} DZD
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Detail & Progress Pipeline (2/3) */}
              {selectedOrder && (
                <div className="lg:col-span-2 space-y-6">
                  {/* Progress Pipeline */}
                  <div className="bg-white border border-black/10 p-6 md:p-8 rounded-none shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-8 border-b border-black/5 pb-4">
                      <div>
                        <span className="text-[10px] text-luxury-gray uppercase tracking-widest">Détail du suivi</span>
                        <h2 className="text-xl font-outfit font-semibold text-luxury-charcoal">
                          Commande #{selectedOrder.id}
                        </h2>
                      </div>
                      <div className="font-mono font-bold text-lg text-luxury-charcoal">
                        {formatPrice(selectedOrder.total_dzd)} DZD
                      </div>
                    </div>

                    {/* Step Pipeline Bar */}
                    {selectedOrder.status === "cancelled" ? (
                      <div className="p-4 bg-red-50 text-red-800 border border-red-200 text-xs text-center font-medium">
                        Cette commande a été annulée. Contactez le service client pour toute assistance.
                      </div>
                    ) : (
                      <div className="py-4">
                        <div className="relative flex items-center justify-between mb-8">
                          {/* Background line */}
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black/10 -translate-y-1/2 z-0" />
                          
                          {/* Active fill line */}
                          <div 
                            className="absolute top-1/2 left-0 h-0.5 bg-[#c5a059] -translate-y-1/2 z-0 transition-all duration-700" 
                            style={{ width: `${(getStepActiveIndex(selectedOrder.status) / 3) * 100}%` }}
                          />

                          {[
                            { step: 0, label: "Reçue", desc: "En attente" },
                            { step: 1, label: "Confirmée", desc: "Par téléphone" },
                            { step: 2, label: "Expédiée", desc: "En route" },
                            { step: 3, label: "Livrée", desc: "Encaissée" },
                          ].map((s) => {
                            const activeIdx = getStepActiveIndex(selectedOrder.status);
                            const isDone = s.step <= activeIdx;
                            const isCurrent = s.step === activeIdx;

                            return (
                              <div key={s.step} className="relative z-10 flex flex-col items-center text-center">
                                <div 
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isCurrent
                                      ? "bg-[#c5a059] text-white ring-4 ring-[#c5a059]/20"
                                      : isDone
                                      ? "bg-luxury-charcoal text-white"
                                      : "bg-white border-2 border-black/20 text-luxury-gray"
                                  }`}
                                >
                                  {isDone ? <CheckCircle className="w-4 h-4" /> : s.step + 1}
                                </div>
                                <span className="text-xs font-semibold text-luxury-charcoal mt-2 block">
                                  {s.label}
                                </span>
                                <span className="text-[10px] text-luxury-gray hidden sm:block">
                                  {s.desc}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-4 bg-luxury-sand text-xs text-luxury-charcoal border border-black/5 flex items-center gap-3">
                          <Truck className="w-5 h-5 text-[#c5a059] shrink-0" />
                          <div>
                            <strong>Destination :</strong> {selectedOrder.wilaya} {selectedOrder.commune ? `- ${selectedOrder.commune}` : ""}
                            <p className="text-[11px] text-luxury-gray mt-0.5">
                              Règlement exigible à la livraison : <strong>{formatPrice(selectedOrder.total_dzd)} DZD</strong> (Espèces).
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Articles List */}
                    <div className="mt-8 border-t border-black/5 pt-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal mb-4">
                        Articles inclus dans cette commande
                      </h4>
                      <div className="divide-y divide-black/5 border border-black/5">
                        {(selectedOrder.order_items || []).map((item, idx) => (
                          <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-luxury-sand border border-black/5 flex items-center justify-center shrink-0">
                                {item.products?.image ? (
                                  <img src={item.products.image} alt={item.products.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-5 h-5 text-luxury-gray" />
                                )}
                              </div>
                              <div>
                                <h5 className="font-semibold text-sm text-luxury-charcoal">{item.products?.name}</h5>
                                <span className="text-xs text-luxury-gray">{item.variant_label} × {item.qty}</span>
                              </div>
                            </div>
                            <div className="text-right font-mono font-semibold text-sm text-luxury-charcoal">
                              {formatPrice(item.unit_price_dzd * item.qty)} DZD
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hotline Help */}
                    <div className="mt-8 p-4 border border-black/5 bg-[#faf9f7] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-luxury-charcoal">
                        <span className="font-bold block">Besoin d&apos;aide sur cette livraison ?</span>
                        <span className="text-luxury-gray">Nos conseillers à Alger répondent 6j/7.</span>
                      </div>
                      <a
                        href="https://wa.me/213550123456"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-none"
                      >
                        <MessageSquare className="w-4 h-4" /> Contacter par WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-black/10 p-12 text-center max-w-lg mx-auto">
              <Package className="w-12 h-12 text-luxury-gray/40 mx-auto mb-4" />
              <h3 className="text-lg font-outfit text-luxury-charcoal font-semibold mb-1">
                Aucune commande trouvée
              </h3>
              <p className="text-xs text-luxury-gray mb-6">
                Aucun achat n&apos;est actuellement rattaché à &laquo; {phoneSearch} &raquo;. Assurez-vous d&apos;avoir saisi le même numéro qu&apos;au moment du paiement.
              </p>
              <Link href="/">
                <Button className="bg-luxury-charcoal text-white hover:bg-black rounded-none text-xs">
                  Explorer la collection
                </Button>
              </Link>
            </div>
          )
        ) : (
          /* Empty / Default Guidance State */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-black/10">
              <Phone className="w-5 h-5 text-[#c5a059] mb-3" />
              <h4 className="text-sm font-semibold text-luxury-charcoal mb-1">Recherche instantanée</h4>
              <p className="text-xs text-luxury-gray leading-relaxed">
                Entrez le numéro mobile renseigné lors de la commande pour afficher l&apos;ensemble de votre historique d&apos;achats.
              </p>
            </div>

            <div className="p-6 bg-white border border-black/10">
              <Truck className="w-5 h-5 text-[#c5a059] mb-3" />
              <h4 className="text-sm font-semibold text-luxury-charcoal mb-1">Livraison 58 Wilayas</h4>
              <p className="text-xs text-luxury-gray leading-relaxed">
                Chaque expédition est acheminée sous scellé avec contrôle d&apos;authenticité avant le départ de notre showroom.
              </p>
            </div>

            <div className="p-6 bg-white border border-black/10">
              <ShieldCheck className="w-5 h-5 text-[#c5a059] mb-3" />
              <h4 className="text-sm font-semibold text-luxury-charcoal mb-1">Paiement Garanti</h4>
              <p className="text-xs text-luxury-gray leading-relaxed">
                Vous ne réglez le livreur qu&apos;après vérification en main propre de votre colis et de vos accessoires.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
