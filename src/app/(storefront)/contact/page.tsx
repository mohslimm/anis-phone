"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black text-luxury-charcoal mb-6 uppercase tracking-tighter font-outfit"
          >
            Nous <span className="text-luxury-gray">Contacter</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-luxury-gray text-xl font-light max-w-2xl leading-relaxed"
          >
            Une question sur un produit ou une commande ? Notre équipe est là pour vous aider du Samedi au Jeudi.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-12">
              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-luxury-charcoal flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-luxury-gray uppercase tracking-widest mb-2">Téléphone</p>
                  <p className="text-2xl font-bold text-luxury-charcoal">+213 (0) 555 12 34 56</p>
                  <p className="text-sm text-luxury-gray">Disponible de 09:00 à 19:00</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-luxury-charcoal flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-luxury-gray uppercase tracking-widest mb-2">Email</p>
                  <p className="text-2xl font-bold text-luxury-charcoal">contact@anis-phone.com</p>
                  <p className="text-sm text-luxury-gray">Réponse sous 24h ouvrées</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-luxury-charcoal flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-luxury-gray uppercase tracking-widest mb-2">Boutique Physique</p>
                  <p className="text-2xl font-bold text-luxury-charcoal">Cité des 58 Logements</p>
                  <p className="text-sm text-luxury-gray">Tizi Ouzou, Algérie</p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="mt-20">
               <p className="text-[10px] font-bold text-luxury-gray uppercase tracking-widest mb-6">Suivez notre actualité</p>
               <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-luxury-charcoal hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-luxury-charcoal hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
               </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-50 rounded-[3rem] p-10 md:p-14"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest px-1">Nom Complet</label>
                  <input type="text" className="w-full h-14 rounded-2xl bg-white border border-black/5 px-6 focus:outline-none focus:ring-2 focus:ring-luxury-charcoal/10" placeholder="Jean Dupont" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest px-1">Email</label>
                  <input type="email" className="w-full h-14 rounded-2xl bg-white border border-black/5 px-6 focus:outline-none focus:ring-2 focus:ring-luxury-charcoal/10" placeholder="jean@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest px-1">Sujet</label>
                <select className="w-full h-14 rounded-2xl bg-white border border-black/5 px-6 focus:outline-none focus:ring-2 focus:ring-luxury-charcoal/10 appearance-none">
                   <option>Question sur un produit</option>
                   <option>Suivi de commande</option>
                   <option>Service après-vente</option>
                   <option>Partenariat</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest px-1">Message</label>
                <textarea rows={5} className="w-full rounded-2xl bg-white border border-black/5 p-6 focus:outline-none focus:ring-2 focus:ring-luxury-charcoal/10" placeholder="Comment pouvons-nous vous aider ?"></textarea>
              </div>
              <Button size="lg" className="w-full h-16 rounded-2xl bg-luxury-charcoal hover:bg-black text-white font-bold text-lg flex items-center justify-center gap-3">
                <Send className="w-5 h-5" />
                Envoyer le message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
