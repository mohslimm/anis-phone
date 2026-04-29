import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-luxury-charcoal pt-24 pb-12 text-white overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                <Image
                  src="/anis-phone-logo-new.png"
                  alt="ANIS PHONE Logo"
                  width={24}
                  height={24}
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="text-xl font-black tracking-[0.2em] uppercase font-outfit">Anis<span className="text-amber-500">.</span>Phone</span>
            </div>
            <p className="text-sm text-white/50 mb-10 leading-relaxed font-light">
              Votre destination premium pour la téléphonie et le lifestyle tech en Algérie. 
              Authenticité garantie et service d'exception sur les 58 wilayas.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white hover:text-luxury-charcoal transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white hover:text-luxury-charcoal transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold mb-8 uppercase tracking-[0.3em] text-white/40">Boutique</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/categorie/smartphones" className="text-white/70 hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link href="/occasions" className="text-white/70 hover:text-white transition-colors">Occasions Certifiées</Link></li>
              <li><Link href="/promos" className="text-white/70 hover:text-amber-500 transition-colors flex items-center gap-2">Affaires du jour <span className="text-[8px] bg-red-500 px-1.5 py-0.5 rounded-full text-white">HOT</span></Link></li>
              <li><Link href="/packs" className="text-white/70 hover:text-white transition-colors">Packs Exclusifs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold mb-8 uppercase tracking-[0.3em] text-white/40">Assistance</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">Notre Histoire</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contactez-nous</Link></li>
              <li><Link href="/account" className="text-white/70 hover:text-white transition-colors">Suivre ma commande</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Conditions Générales</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold mb-8 uppercase tracking-[0.3em] text-white/40">Contact Rapide</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-sm font-bold">
                  <p>+213 (0) 555 12 34 56</p>
                  <p className="text-xs text-white/30 font-medium">+213 (0) 777 12 34 56</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-sm font-bold">contact@anis-phone.com</p>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-sm font-bold leading-relaxed">Bab Ezzouar, Alger <br/> <span className="text-xs text-white/30 font-medium">Algérie</span></p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
          <p>&copy; {new Date().getFullYear()} Anis Phone. Crafted with excellence.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Vie Privée</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
