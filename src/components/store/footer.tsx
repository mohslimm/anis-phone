import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Phone, MessageCircle, MapPin, Award, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#060610] text-[#f0ede8] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Background luxury gradient hint */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#c5a059]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
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
              <p className="text-[11px] text-[#f0ede8]/60 mt-0.5">Règlement en espèces sécurisé à la livraison de votre colis.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <Award className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f0ede8]">Garantie Officielle</h4>
              <p className="text-[11px] text-[#f0ede8]/60 mt-0.5">12 mois sur le neuf, 3 mois sur les occasions certifiées Héritage.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <MessageCircle className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f0ede8]">Support & Hotline 7j/7</h4>
              <p className="text-[11px] text-[#f0ede8]/60 mt-0.5">Assistance téléphonique et conseils WhatsApp personnalisés.</p>
            </div>
          </div>
        </div>

        {/* 4-column Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                <Image
                  src="/anis-phone-logo-new.png"
                  alt="ANIS PHONE Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-[0.2em] uppercase font-outfit text-[#f0ede8]">
                Anis<span className="text-[#c5a059]">.</span>Phone
              </span>
            </div>
            <p className="text-xs text-[#f0ede8]/60 mb-6 leading-relaxed font-light">
              Votre référence en haute téléphonie et technologie de pointe en Algérie. 
              Authenticité garantie, transparence absolue et service haut de gamme sur les 58 wilayas.
            </p>
            <div className="text-[11px] text-[#c5a059] font-mono">
              Bab Ezzouar, Alger &bull; Algérie
            </div>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="text-[11px] font-bold mb-6 uppercase tracking-[0.25em] text-[#c5a059]">Boutique</h4>
            <ul className="space-y-3 text-xs font-light">
              <li>
                <Link href="/categorie/smartphones" className="text-[#f0ede8]/70 hover:text-white transition-colors">
                  Smartphones Scellés
                </Link>
              </li>
              <li>
                <Link href="/occasions" className="text-[#f0ede8]/70 hover:text-white transition-colors">
                  Occasions Certifiées A+
                </Link>
              </li>
              <li>
                <Link href="/promos" className="text-[#f0ede8]/70 hover:text-[#c5a059] transition-colors flex items-center gap-2">
                  Affaires du jour <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full font-semibold">HOT</span>
                </Link>
              </li>
              <li>
                <Link href="/packs" className="text-[#f0ede8]/70 hover:text-white transition-colors">
                  Packs &amp; Bundles Exclusifs
                </Link>
              </li>
              <li>
                <Link href="/categorie/accessoires" className="text-[#f0ede8]/70 hover:text-white transition-colors">
                  Accessoires Haute Performance
                </Link>
              </li>
            </ul>
          </div>

          {/* Assistance & Confidentialité */}
          <div>
            <h4 className="text-[11px] font-bold mb-6 uppercase tracking-[0.25em] text-[#c5a059]">Service Client</h4>
            <ul className="space-y-3 text-xs font-light">
              <li>
                <Link href="/about" className="text-[#f0ede8]/70 hover:text-white transition-colors">
                  Notre Maison &amp; Savoir-faire
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#f0ede8]/70 hover:text-white transition-colors">
                  Contacter le Showroom
                </Link>
              </li>
              <li>
                <Link href="/suivi" className="text-[#f0ede8]/70 hover:text-white transition-colors">
                  Suivre une commande en cours
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-[#f0ede8]/70 hover:text-white transition-colors">
                  Tarifs de livraison par Wilaya
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Contact */}
          <div>
            <h4 className="text-[11px] font-bold mb-6 uppercase tracking-[0.25em] text-[#c5a059]">Contact &amp; Showroom</h4>
            <ul className="space-y-4 text-xs font-light">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-white font-medium">0550 12 34 56</p>
                  <p className="text-[10px] text-[#f0ede8]/40">WhatsApp &amp; Appels direct showroom</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <p className="text-white">contact@anis-phone.dz</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[#f0ede8]/80">
                  Bab Ezzouar, Face Centre Commercial, Alger
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#f0ede8]/40 font-light">
          <p>&copy; {new Date().getFullYear()} ANIS PHONE Algérie. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>58 Wilayas &bull; Yalidine &bull; ZR Express</span>
            <Link href="/admin/dashboard" className="text-[#f0ede8]/30 hover:text-[#c5a059] transition-colors">
              Espace Administrateur
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
