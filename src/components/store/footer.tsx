import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Phone, MessageCircle, MapPin, Lock, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#060610] text-[#f0ede8] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Background luxury gradient hint */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#c5a059]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Value Propositions / Guarantees Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-white/10">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <Truck className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f0ede8]">58 Wilayas d&apos;Algérie</h4>
              <p className="text-[11px] text-[#f0ede8]/60 mt-0.5">Expédition rapide à domicile ou en point relais StopDesk.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <ShieldCheck className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f0ede8]">Paiement à la Réception</h4>
              <p className="text-[11px] text-[#f0ede8]/60 mt-0.5">Vous ne payez en espèces qu&apos;après avoir inspecté votre appareil.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <Award className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f0ede8]">Garantie Officielle</h4>
              <p className="text-[11px] text-[#f0ede8]/60 mt-0.5">12 mois sur le neuf, 3 mois sur les occasions certifiées Héritage A+.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <MessageCircle className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f0ede8]">Support & Hotline 7j/7</h4>
              <p className="text-[11px] text-[#f0ede8]/60 mt-0.5">Assistance personnalisée par téléphone et WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/anis-phone-logo.png"
                alt="ANIS PHONE Logo"
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="font-serif text-2xl tracking-wide text-[#f0ede8]">ANIS PHONE</span>
            </Link>
            <p className="text-xs text-[#f0ede8]/60 leading-relaxed mb-6 max-w-sm">
              Maison de haute technologie et showroom d&apos;exception à Alger. Spécialiste des smartphones neufs sous blister scellé et des pièces reconditionnées Héritage A+ avec traçabilité IMEI.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/213550123456"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] hover:bg-[#c5a059]/20 transition-colors text-xs font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Direct
              </a>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#f0ede8]/50 hover:text-[#f0ede8] transition-colors text-xs"
              >
                <Lock className="w-3 h-3" />
                Console Pro
              </Link>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#e8c77a] mb-4">Collections</h4>
            <ul className="space-y-2.5 text-xs text-[#f0ede8]/60">
              <li>
                <Link href="/categorie/smartphones" className="hover:text-[#c5a059] transition-colors">
                  Smartphones Scellés (Apple, Samsung, Xiaomi)
                </Link>
              </li>
              <li>
                <Link href="/occasions" className="hover:text-[#c5a059] transition-colors flex items-center gap-1.5">
                  Occasions Héritage A+
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#c5a059]/20 text-[#c5a059] font-mono">Certifié</span>
                </Link>
              </li>
              <li>
                <Link href="/categorie/tablettes" className="hover:text-[#c5a059] transition-colors">
                  Tablettes & iPad Pro
                </Link>
              </li>
              <li>
                <Link href="/categorie/laptops" className="hover:text-[#c5a059] transition-colors">
                  MacBooks & Ordinateurs portables
                </Link>
              </li>
              <li>
                <Link href="/packs" className="hover:text-[#c5a059] transition-colors">
                  Packs Exclusifs & Bundles
                </Link>
              </li>
              <li>
                <Link href="/promos" className="hover:text-[#c5a059] transition-colors text-red-400">
                  Affaires du Jour (% Réductions)
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#e8c77a] mb-4">Espace Client</h4>
            <ul className="space-y-2.5 text-xs text-[#f0ede8]/60">
              <li>
                <Link href="/account" className="hover:text-[#c5a059] transition-colors">
                  Suivre ma commande
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#c5a059] transition-colors">
                  Historique d&apos;achats
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-[#c5a059] transition-colors">
                  Tarifs des 58 Wilayas
                </Link>
              </li>
              <li>
                <Link href="/admin/help" className="hover:text-[#c5a059] transition-colors">
                  FAQ & Guide de confirmation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#e8c77a] mb-4">Showroom & Contact</h4>
            <ul className="space-y-3 text-xs text-[#f0ede8]/70">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[#f0ede8]">0550 12 34 56</span>
                  <span className="block text-[#f0ede8]/40">0770 12 34 56 (Hotline 9h - 20h)</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <span>Showroom Principal, Bab Ezzouar (Face Centre Commercial), Alger</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <span>Hub logistique central avec Yalidine & ZR Express</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#f0ede8]/40">
          <p>© {new Date().getFullYear()} ANIS PHONE Algérie. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>Algérie Télécoms & E-Commerce Conforme</span>
            <Link href="/admin/dashboard" className="text-[#f0ede8]/30 hover:text-[#c5a059] transition-colors">
              Administration Store
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
