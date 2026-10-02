"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, Heart, Award, Users } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-luxury-charcoal">
        <div className="absolute inset-0 opacity-40">
           {/* Abstract tech background effect could go here */}
           <div className="absolute inset-0 bg-gradient-to-b from-luxury-charcoal/0 to-luxury-charcoal" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 flex items-center justify-center mx-auto mb-10"
          >
             <Star className="w-12 h-12 text-amber-500 fill-amber-500" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-white mb-8 uppercase tracking-tighter font-outfit"
          >
            L'histoire <br /> <span className="text-luxury-gray">Anis Phone</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-xl font-light max-w-3xl mx-auto leading-relaxed"
          >
            Depuis plus de 10 ans, nous redéfinissons les standards de la téléphonie premium en Algérie.
            Plus qu'une boutique, une promesse d'excellence.
          </motion.p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 container mx-auto px-4">
         <div className="text-center mb-20">
            <p className="text-[10px] font-bold text-luxury-gray uppercase tracking-[0.3em] mb-4">Nos Valeurs</p>
            <h2 className="text-4xl font-black text-luxury-charcoal uppercase tracking-tighter font-outfit">Pourquoi Nous Choisir ?</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck className="w-10 h-10" />, title: "Authenticité Garantie", desc: "Chaque produit vendu est rigoureusement testé et certifié original." },
              { icon: <Heart className="w-10 h-10" />, title: "Service Passionné", desc: "Notre équipe d'experts vous conseille comme s'il s'agissait de leur propre achat." },
              { icon: <Award className="w-10 h-10" />, title: "Savoir-Faire", desc: "Une expertise technique reconnue pour l'entretien et le service après-vente." }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-slate-50 border border-black/5 text-center group hover:bg-luxury-charcoal hover:text-white transition-all duration-500 shadow-xl hover:shadow-2xl"
              >
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform group-hover:text-luxury-charcoal">
                   {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 font-outfit uppercase tracking-tight">{value.title}</h3>
                <p className="text-luxury-gray font-light leading-relaxed group-hover:text-white/70">
                   {value.desc}
                </p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Team / Stats Section */}
      <section className="bg-luxury-charcoal py-32 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
         <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div>
                  <h2 className="text-5xl font-black mb-8 uppercase tracking-tighter font-outfit">Une Présence Nationale</h2>
                  <p className="text-white/60 text-lg font-light leading-relaxed mb-12">
                     Basés à Tizi Ouzou, nous livrons nos produits premium dans les 58 wilayas du pays avec un suivi rigoureux.
                     Notre communauté compte aujourd'hui plus de 100,000 passionnés de technologie.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                     <div>
                        <div className="text-5xl font-black text-amber-500 mb-2 font-outfit">10k+</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Clients Satisfaits</div>
                     </div>
                     <div>
                        <div className="text-5xl font-black text-amber-500 mb-2 font-outfit">58</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Wilayas Couvertes</div>
                     </div>
                  </div>
               </div>
               <div className="relative">
                  <div className="aspect-square bg-white/5 rounded-[4rem] border border-white/10 flex items-center justify-center overflow-hidden">
                     <Users className="w-40 h-40 text-white/10" />
                  </div>
                  <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl text-luxury-charcoal">
                     <p className="text-3xl font-black font-outfit">24/7</p>
                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Support Client</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 container mx-auto px-4 text-center">
         <h2 className="text-4xl font-black text-luxury-charcoal mb-8 uppercase tracking-tighter font-outfit">Prêt à rejoindre l'excellence ?</h2>
         <a 
           href="/categorie/smartphones" 
           className="inline-flex items-center gap-4 px-10 py-5 bg-luxury-charcoal text-white rounded-2xl font-bold text-xl hover:bg-black transition-all hover:scale-105 shadow-2xl"
         >
           Voir le Catalogue
           <Heart className="w-6 h-6 text-red-500 fill-red-500" />
         </a>
      </section>
    </div>
  );
}
