"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { processCheckout } from "@/app/actions/checkout";
import { WILAYAS_LIST, DataService } from "@/lib/data-service";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  PackageCheck, 
  Phone, 
  MapPin, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Copy,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{
    orderId: string;
    total: number;
    phone: string;
    fullname: string;
    wilaya: string;
    deliveryType: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [selectedWilayaCode, setSelectedWilayaCode] = useState("16");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");

  useEffect(() => {
    setMounted(true);
    // Pre-populate if customer has previous session
    try {
      const savedUser = localStorage.getItem("anis_phone_customer_session");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setFullname(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.wilaya) {
          const match = WILAYAS_LIST.find(w => parsed.wilaya.includes(w.name));
          if (match) setSelectedWilayaCode(match.code);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const total = getCartTotal();

  // Dynamic shipping cost based on Wilaya and Delivery Type
  const currentWilaya = WILAYAS_LIST.find((w) => w.code === selectedWilayaCode) || WILAYAS_LIST[15]; // Default Alger
  const shippingCost = deliveryType === "home" ? currentWilaya.homeDeliveryPrice : currentWilaya.stopDeskPrice;
  const grandTotal = total + shippingCost;

  const handleCopyOrderId = () => {
    if (successOrder?.orderId) {
      navigator.clipboard.writeText(successOrder.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      alert("Veuillez saisir un numéro de téléphone algérien valide (ex: 0550 12 34 56)");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set("fullname", fullname.trim());
      formData.set("phone", phone.trim());
      formData.set("secondaryPhone", secondaryPhone.trim());
      formData.set("wilaya", `${currentWilaya.code} - ${currentWilaya.name}`);
      formData.set("commune", commune.trim());
      formData.set("address", address.trim());
      formData.set("notes", notes.trim());
      formData.set("deliveryType", deliveryType);

      // Server action
      const result = await processCheckout(formData, items);

      if (!result.success) {
        throw new Error(result.error || "Échec lors de l'enregistrement");
      }

      const generatedId = result.orderId;
      const orderTotal = result.total_dzd;

      // Also persist to local CRM DataService for admin sync and offline resiliency
      await DataService.placeOrder(
        {
          customer_name: fullname.trim(),
          phone: phone.trim(),
          wilaya: `${currentWilaya.code} - ${currentWilaya.name}`,
          commune: commune.trim(),
          address: `${deliveryType === "home" ? "Domicile" : "StopDesk"}: ${address}`,
          notes: notes,
        },
        items
      );

      // Save last order in localStorage for quick tracking on /account
      const orderDetails = {
        orderId: generatedId,
        total: orderTotal,
        phone: phone.trim(),
        fullname: fullname.trim(),
        wilaya: `${currentWilaya.code} - ${currentWilaya.name}`,
        deliveryType: deliveryType === "home" ? "À Domicile" : "Point Relais (StopDesk)",
        createdAt: new Date().toISOString()
      };

      try {
        localStorage.setItem("anis_phone_last_order", JSON.stringify(orderDetails));
        localStorage.setItem("anis_phone_customer_session", JSON.stringify({
          phone: phone.trim(),
          name: fullname.trim(),
          wilaya: currentWilaya.name
        }));
      } catch {
        // ignore storage errors
      }

      setSuccessOrder(orderDetails);
      clearCart();
    } catch (error: any) {
      console.error("Error submitting order:", error);
      alert("Une erreur est survenue lors de la commande. Veuillez vérifier vos coordonnées ou nous contacter.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  // ── SUCCESS CONFIRMATION VIEW ──────────────────────────────────────
  if (successOrder) {
    const waText = encodeURIComponent(
      `Bonjour Anis Phone, je viens de passer la commande *${successOrder.orderId}* pour un montant de ${formatPrice(successOrder.total)} DZD au nom de ${successOrder.fullname}. Pouvez-vous me confirmer la prise en charge ?`
    );

    return (
      <div className="bg-[#060610] min-h-screen text-[#f0ede8] py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0f0f20] border border-[rgba(197,160,89,0.3)] rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#c5a059]/15 border border-[#c5a059]/40 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#c5a059]" />
              </div>

              <span className="text-[11px] font-mono tracking-[0.25em] text-[#c5a059] uppercase mb-2">
                Commande Enregistrée avec Succès
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#f0ede8] mb-3">
                Merci pour votre confiance
              </h1>
              <p className="text-sm text-[#f0ede8]/70 max-w-md mb-8">
                Votre demande a été transmise à notre service logistique. Vous allez recevoir un appel de confirmation vocale sous 2 heures.
              </p>

              {/* Order Reference Box */}
              <div className="w-full bg-[#14142a] border border-white/10 rounded-xl p-5 mb-8 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#f0ede8]/50 block">Numéro de Commande</span>
                    <span className="text-xl font-mono font-bold text-[#e8c77a]">{successOrder.orderId}</span>
                  </div>
                  <button
                    onClick={handleCopyOrderId}
                    className="flex items-center gap-1.5 text-xs text-[#c5a059] hover:text-[#e8c77a] transition-colors py-1.5 px-3 bg-[#c5a059]/10 rounded-md border border-[#c5a059]/20 self-start sm:self-center"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Copié !" : "Copier la référence"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                  <div>
                    <span className="text-[#f0ede8]/50 block">Destinataire</span>
                    <span className="font-medium text-[#f0ede8]">{successOrder.fullname}</span>
                  </div>
                  <div>
                    <span className="text-[#f0ede8]/50 block">Livraison</span>
                    <span className="font-medium text-[#f0ede8]">{successOrder.wilaya} ({successOrder.deliveryType})</span>
                  </div>
                  <div>
                    <span className="text-[#f0ede8]/50 block">Total à payer</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{formatPrice(successOrder.total)} DZD</span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left text-xs">
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#c5a059] shrink-0" />
                  <span>Paiement en espèces à la livraison après inspection de l'appareil.</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#c5a059] shrink-0" />
                  <span>Délai moyen d'expédition : 24 à 48 heures ouvrées.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/account?orderId=${encodeURIComponent(successOrder.orderId)}&phone=${encodeURIComponent(successOrder.phone)}`}
                  className="flex-1"
                >
                  <Button className="w-full bg-[#c5a059] hover:bg-[#e8c77a] text-black font-semibold h-12 rounded-xl transition-all">
                    Suivre ma commande en direct
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/213550123456?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 h-12 rounded-xl gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Support WhatsApp 7j/7
                  </Button>
                </a>
              </div>

              <Link href="/" className="mt-6 text-xs text-[#f0ede8]/50 hover:text-[#f0ede8] transition-colors">
                ← Retourner au showroom
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── EMPTY CART VIEW ───────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="bg-[#060610] min-h-screen text-[#f0ede8] flex items-center justify-center py-24 px-4">
        <div className="max-w-md text-center bg-[#0f0f20] border border-white/10 rounded-2xl p-10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageCheck className="w-8 h-8 text-[#f0ede8]/40" />
          </div>
          <h1 className="font-serif text-2xl mb-2">Votre sélection est vide</h1>
          <p className="text-sm text-[#f0ede8]/60 mb-6">
            Explorez notre catalogue de smartphones neufs et d'occasions certifiées Héritage.
          </p>
          <Link href="/">
            <Button className="bg-[#c5a059] hover:bg-[#e8c77a] text-black font-semibold rounded-xl px-8 h-12">
              Découvrir la collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── CHECKOUT FORM VIEW ────────────────────────────────────────────
  return (
    <div className="bg-[#060610] min-h-screen text-[#f0ede8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <Link href="/" className="inline-flex items-center text-xs text-[#f0ede8]/60 hover:text-[#c5a059] transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Retour au catalogue
        </Link>

        <div className="mb-10">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#c5a059] uppercase">Validation de commande</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#f0ede8] mt-1">Finalisez votre acquisition</h1>
          <p className="text-sm text-[#f0ede8]/60 mt-1">
            Paiement sécurisé en espèces à la livraison. Livraison garantie sur l'ensemble des 58 Wilayas d'Algérie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (Left Column) */}
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Card 1: Coordonnées client */}
              <div className="bg-[#0f0f20] border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] text-xs font-mono font-bold">
                    01
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-[#f0ede8]">Identité du Destinataire</h2>
                    <p className="text-xs text-[#f0ede8]/50">Informations requises pour la confirmation vocale</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullname" className="text-xs text-[#f0ede8]/70">
                      Nom complet <span className="text-[#c5a059]">*</span>
                    </Label>
                    <Input
                      id="fullname"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Ex: Mohamed Amine Benali"
                      required
                      className="bg-[#14142a] border-white/10 text-[#f0ede8] focus-visible:ring-[#c5a059] rounded-xl h-11 mt-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-xs text-[#f0ede8]/70 flex items-center justify-between">
                        <span>Téléphone principal <span className="text-[#c5a059]">*</span></span>
                        <span className="text-[10px] text-[#f0ede8]/40">Pour appel livreur</span>
                      </Label>
                      <div className="relative mt-1.5">
                        <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#f0ede8]/40" />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0550 12 34 56"
                          required
                          className="bg-[#14142a] border-white/10 text-[#f0ede8] pl-10 focus-visible:ring-[#c5a059] rounded-xl h-11"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondaryPhone" className="text-xs text-[#f0ede8]/70">
                        Téléphone secondaire (recommandé)
                      </Label>
                      <Input
                        id="secondaryPhone"
                        type="tel"
                        value={secondaryPhone}
                        onChange={(e) => setSecondaryPhone(e.target.value)}
                        placeholder="0770 98 76 54"
                        className="bg-[#14142a] border-white/10 text-[#f0ede8] focus-visible:ring-[#c5a059] rounded-xl h-11 mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Mode de Livraison & Wilaya */}
              <div className="bg-[#0f0f20] border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] text-xs font-mono font-bold">
                    02
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-[#f0ede8]">Mode et Destination de Livraison</h2>
                    <p className="text-xs text-[#f0ede8]/50">Tarification dynamique selon les 58 Wilayas</p>
                  </div>
                </div>

                {/* Delivery Type Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("home")}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      deliveryType === "home"
                        ? "bg-[#c5a059]/10 border-[#c5a059] ring-1 ring-[#c5a059]"
                        : "bg-[#14142a] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Truck className={`w-5 h-5 shrink-0 mt-0.5 ${deliveryType === "home" ? "text-[#c5a059]" : "text-[#f0ede8]/50"}`} />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#f0ede8]">À Domicile</span>
                        <span className="text-xs font-mono text-[#c5a059]">{formatPrice(currentWilaya.homeDeliveryPrice)} DZD</span>
                      </div>
                      <p className="text-[11px] text-[#f0ede8]/60 mt-0.5">Livraison porte à porte par coursier</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType("desk")}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      deliveryType === "desk"
                        ? "bg-[#c5a059]/10 border-[#c5a059] ring-1 ring-[#c5a059]"
                        : "bg-[#14142a] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Building2 className={`w-5 h-5 shrink-0 mt-0.5 ${deliveryType === "desk" ? "text-[#c5a059]" : "text-[#f0ede8]/50"}`} />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#f0ede8]">StopDesk / Bureau</span>
                        <span className="text-xs font-mono text-[#c5a059]">{formatPrice(currentWilaya.stopDeskPrice)} DZD</span>
                      </div>
                      <p className="text-[11px] text-[#f0ede8]/60 mt-0.5">Retrait en agence express locale</p>
                    </div>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="wilaya" className="text-xs text-[#f0ede8]/70">
                        Wilaya <span className="text-[#c5a059]">*</span>
                      </Label>
                      <Select
                        value={selectedWilayaCode}
                        onValueChange={(val) => val && setSelectedWilayaCode(val)}
                        required
                      >
                        <SelectTrigger className="bg-[#14142a] border-white/10 text-[#f0ede8] focus:ring-[#c5a059] rounded-xl h-11 mt-1.5 w-full">
                          <SelectValue placeholder="Sélectionnez votre Wilaya" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f0f20] border-white/10 text-[#f0ede8] max-h-64">
                          {WILAYAS_LIST.map((w) => (
                            <SelectItem key={w.code} value={w.code} className="hover:bg-white/5 cursor-pointer">
                              {w.code} - {w.name} ({deliveryType === "home" ? w.homeDeliveryPrice : w.stopDeskPrice} DZD)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="commune" className="text-xs text-[#f0ede8]/70">
                        Commune <span className="text-[#c5a059]">*</span>
                      </Label>
                      <Input
                        id="commune"
                        value={commune}
                        onChange={(e) => setCommune(e.target.value)}
                        placeholder="Ex: Bab Ezzouar, Kouba, Es Senia..."
                        required
                        className="bg-[#14142a] border-white/10 text-[#f0ede8] focus-visible:ring-[#c5a059] rounded-xl h-11 mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-xs text-[#f0ede8]/70">
                      Adresse complète ou agence StopDesk souhaitée <span className="text-[#c5a059]">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-[#f0ede8]/40" />
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ex: Cité 500 logements, Bâtiment C3, Appartement 12..."
                        required
                        className="bg-[#14142a] border-white/10 text-[#f0ede8] pl-10 focus-visible:ring-[#c5a059] rounded-xl h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-xs text-[#f0ede8]/70">
                      Instructions spéciales pour le livreur (Optionnel)
                    </Label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full bg-[#14142a] border border-white/10 rounded-xl p-3 text-xs text-[#f0ede8] placeholder:text-[#f0ede8]/30 focus:outline-none focus:ring-1 focus:ring-[#c5a059] mt-1.5"
                      placeholder="Ex: Appeler 30 minutes avant l'arrivée, disponible après 14h..."
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Mode de Paiement */}
              <div className="bg-[#0f0f20] border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] text-xs font-mono font-bold">
                    03
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-[#f0ede8]">Règlement de la Commande</h2>
                    <p className="text-xs text-[#f0ede8]/50">Paiement à la réception sans avance</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-emerald-300">Paiement en espèces à la livraison (COD)</h3>
                    <p className="text-[11px] text-[#f0ede8]/70 mt-1 leading-relaxed">
                      Aucune carte bancaire requise en ligne. Vous payez directement en espèces (DZD) entre les mains du livreur après avoir ouvert et inspecté votre colis.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary (Right Column) */}
          <div className="lg:col-span-5">
            <div className="bg-[#0f0f20] border border-white/10 rounded-2xl p-6 sm:p-8 sticky top-28 shadow-xl">
              <h2 className="font-serif text-xl text-[#f0ede8] mb-6">Récapitulatif</h2>

              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-[320px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 bg-[#14142a] border border-white/10 rounded-lg relative overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                        ) : (
                          <span className="text-[10px] text-[#f0ede8]/30">IMG</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-medium text-[#f0ede8] truncate">{item.name}</h3>
                        <p className="text-[10px] text-[#c5a059] font-mono mt-0.5">
                          {item.variantLabel} × {item.qty}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-medium text-[#f0ede8] whitespace-nowrap">
                      {formatPrice(item.price * item.qty)} DZD
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3 text-xs mb-6 border-b border-white/10 pb-6">
                <div className="flex justify-between text-[#f0ede8]/70">
                  <span>Sous-total articles</span>
                  <span className="font-mono">{formatPrice(total)} DZD</span>
                </div>
                <div className="flex justify-between text-[#f0ede8]/70">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#c5a059]" />
                    Livraison ({currentWilaya.name} - {deliveryType === "home" ? "Domicile" : "StopDesk"})
                  </span>
                  <span className="font-mono text-[#c5a059]">{formatPrice(shippingCost)} DZD</span>
                </div>
                <div className="flex justify-between text-[#f0ede8]/70">
                  <span>Garantie & Assurance Colis</span>
                  <span className="text-emerald-400 font-medium">Offerte</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-baseline mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#f0ede8]/50 block">Net à Payer</span>
                  <span className="text-[11px] text-[#f0ede8]/40">Paiement à la réception</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xl font-bold text-[#e8c77a]">
                    {formatPrice(grandTotal)}
                  </span>
                  <span className="text-xs text-[#c5a059] ml-1 font-mono">DZD</span>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-[#c5a059] hover:bg-[#e8c77a] text-black font-semibold h-13 rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider"
              >
                {isSubmitting ? "Traitement de votre commande..." : "Valider ma commande (Cash on Delivery)"}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#f0ede8]/40 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Confirmation vocale téléphonique systématique avant expédition</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
