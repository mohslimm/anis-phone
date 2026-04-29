"use client";

import { motion } from "framer-motion";
import { Package, Plus, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const packs = [
  {
    id: 1,
    name: "Pack Excellence",
    subtitle: "L'écosystème Apple complet",
    price: "295,000 DA",
    savings: "Économisez 15,000 DA",
    items: [
      { name: "iPhone 15 Pro Max 256Go", icon: "📱" },
      { name: "AirPods Pro (2nd Gen)", icon: "🎧" },
      { name: "Coque Silicone MagSafe", icon: "🛡️" },
      { name: "Adaptateur 20W Original", icon: "🔌" }
    ],
    color: "from-slate-800 to-slate-950"
  },
  {
    id: 2,
    name: "Pack Ultra Gaming",
    subtitle: "Puissance Samsung Sans Limite",
    price: "225,000 DA",
    savings: "Économisez 10,000 DA",
    items: [
      { name: "Galaxy S24 Ultra 512Go", icon: "📱" },
      { name: "Galaxy Buds3 Pro", icon: "🎧" },
      { name: "Galaxy Watch 6 Classic", icon: "⌚" }
    ],
    color: "from-blue-800 to-indigo-950"
  },
  {
    id: 3,
    name: "Pack Starter Occasion",
    subtitle: "La qualité au meilleur prix",
    price: "115,000 DA",
    savings: "Économisez 8,000 DA",
    items: [
      { name: "iPhone 13 128Go (Grade A+)", icon: "📱" },
      { name: "Écouteurs Lightning", icon: "🎧" },
      { name: "Protection Écran Verre", icon: "💎" }
    ],
    color: "from-amber-600 to-amber-800"
  }
];

export default function PacksPage() {
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <section className="pt-20 pb-32 text-center bg-luxury-offwhite border-b border-black/5">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-luxury-charcoal rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <Package className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-luxury-charcoal mb-6 uppercase tracking-tighter font-outfit"
          >
            Packs <span className="text-luxury-gray">Exclusifs</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-luxury-gray text-xl font-light max-w-2xl mx-auto leading-relaxed"
          >
            Des combinaisons intelligentes pour une expérience complète dès le premier jour.
            Économisez plus en achetant groupé.
          </motion.p>
        </div>
      </section>

      {/* Packs Grid */}
      <div className="container mx-auto px-4 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {packs.map((pack, index) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              className="relative group flex flex-col bg-white rounded-[2.5rem] border border-black/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              {/* Card Header with Gradient */}
              <div className={`h-48 bg-gradient-to-br ${pack.color} p-8 flex flex-col justify-end text-white relative overflow-hidden`}>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Best Value
                </div>
                <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter">{pack.name}</h2>
                <p className="text-white/70 text-sm font-medium">{pack.subtitle}</p>
              </div>

              {/* Items List */}
              <div className="flex-1 p-8">
                <p className="text-[10px] font-bold text-luxury-gray uppercase tracking-[0.2em] mb-6">Inclus dans le pack :</p>
                <div className="space-y-4 mb-8">
                  {pack.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group/item">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-black/5 flex items-center justify-center text-lg transition-transform group-hover/item:scale-110">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium text-luxury-charcoal">{item.name}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-black/5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-black text-luxury-charcoal tracking-tighter">{pack.price}</span>
                  </div>
                  <div className="inline-block bg-green-50 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-8">
                    {pack.savings}
                  </div>

                  <Button size="lg" className="w-full h-16 rounded-2xl bg-luxury-charcoal hover:bg-black text-white text-lg font-bold flex items-center justify-between px-8 group/btn">
                    Commander le pack
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <section className="container mx-auto px-4 mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-50 rounded-[3rem] p-12 flex items-start gap-8">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
               <ShieldCheck className="w-8 h-8 text-luxury-charcoal" />
            </div>
            <div>
               <h3 className="text-2xl font-bold text-luxury-charcoal mb-4 font-outfit">Garantie Pack</h3>
               <p className="text-luxury-gray font-light leading-relaxed">
                  Chaque élément de nos packs bénéficie de sa propre garantie constructeur. 
                  Nous testons personnellement la compatibilité de chaque accessoire.
               </p>
            </div>
         </div>
         <div className="bg-slate-50 rounded-[3rem] p-12 flex items-start gap-8">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
               <Truck className="w-8 h-8 text-luxury-charcoal" />
            </div>
            <div>
               <h3 className="text-2xl font-bold text-luxury-charcoal mb-4 font-outfit">Livraison Express</h3>
               <p className="text-luxury-gray font-light leading-relaxed">
                  Les packs sont préparés avec soin dans un emballage unique renforcé. 
                  Livraison gratuite sur tous nos packs exclusifs.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
}
