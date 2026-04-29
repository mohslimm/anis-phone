"use client";

import { motion } from "framer-motion";
import { Percent, Timer, Zap, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const promotions = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    image: "/images/iphone-15-pro.png",
    originalPrice: "245,000 DA",
    promoPrice: "219,000 DA",
    discount: "-11%",
    timer: "12:45:00",
    description: "L'excellence Apple à prix réduit. Quantités limitées.",
  },
  {
    id: 2,
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    image: "/images/s24-ultra.png",
    originalPrice: "210,000 DA",
    promoPrice: "189,000 DA",
    discount: "-10%",
    timer: "08:20:00",
    description: "Le summum de l'IA mobile. Offre exceptionnelle.",
  },
  {
    id: 3,
    name: "MacBook Air M3",
    brand: "Apple",
    image: "/images/macbook-air.png",
    originalPrice: "265,000 DA",
    promoPrice: "235,000 DA",
    discount: "-12%",
    timer: "15:10:00",
    description: "La puissance M3 pour les professionnels.",
  }
];

export default function PromosPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-luxury-charcoal text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-600 mix-blend-multiply" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-[0.2em] mb-6"
          >
            <Zap className="w-4 h-4 fill-red-400" />
            Ventes Flash
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold uppercase tracking-tighter mb-6 font-outfit"
          >
            Affaires <span className="text-red-500">Du Jour</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-luxury-gray max-w-xl mx-auto text-lg font-light leading-relaxed"
          >
            Les meilleures offres high-tech sélectionnées pour vous. 
            Prix imbattables sur une sélection premium.
          </motion.p>
        </div>
      </section>

      {/* Promos Grid */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-64 bg-slate-100 flex items-center justify-center p-8">
                <Badge className="absolute top-6 left-6 bg-red-600 text-white border-none px-4 py-1.5 rounded-full text-sm font-bold">
                  {promo.discount}
                </Badge>
                <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-black/5 text-[10px] font-bold text-luxury-charcoal uppercase tracking-wider">
                  <Timer className="w-3 h-3 text-red-500" />
                  {promo.timer}
                </div>
                {/* Image placeholder */}
                <div className="w-full h-full bg-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                   <div className="text-luxury-gray/40 font-bold uppercase tracking-widest text-xs">{promo.name} Image</div>
                </div>
              </div>

              <div className="p-8">
                <div className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] mb-2">{promo.brand}</div>
                <h3 className="text-2xl font-bold text-luxury-charcoal mb-4 font-outfit">{promo.name}</h3>
                <p className="text-sm text-luxury-gray mb-6 leading-relaxed font-light">
                  {promo.description}
                </p>
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-xs text-luxury-gray line-through decoration-red-500/30">{promo.originalPrice}</span>
                    <span className="text-3xl font-black text-luxury-charcoal tracking-tighter">{promo.promoPrice}</span>
                  </div>
                  <Button size="lg" className="rounded-2xl bg-luxury-charcoal hover:bg-black text-white px-8">
                    Profiter
                  </Button>
                </div>

                <Link 
                  href={`/produit/${promo.id}`}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/40 hover:text-luxury-charcoal transition-colors"
                >
                  Détails de l'offre <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter / Stay tuned */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
           <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter font-outfit">Ne manquez aucune offre</h2>
              <p className="text-red-100 max-w-lg mx-auto mb-10 font-light text-lg">
                Inscrivez-vous pour recevoir nos alertes "Affaire du jour" directement sur WhatsApp ou par Email.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="text" 
                  placeholder="Votre numéro ou email" 
                  className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <Button className="bg-white text-red-600 hover:bg-red-50 rounded-2xl px-8 py-4 font-bold text-lg">
                  S'abonner
                </Button>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
