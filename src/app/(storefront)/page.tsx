"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { ArrowRight, Truck, ShieldCheck, CheckCircle } from "lucide-react";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { revealFromBottom, registerGSAP, staggerReveal } from "@/lib/animations";

import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { useEffect, useState } from "react";

export default function HomePage() {
  const container = useRef<HTMLDivElement>(null);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [usedProducts, setUsedProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      const supabase = createClient();
      
      const [pdNew, pdUsed, brRes] = await Promise.all([
        supabase.from("products").select("*, brands(name)").eq("condition", "new").order("created_at", { ascending: false }).limit(4),
        supabase.from("products").select("*, brands(name)").eq("condition", "used").order("created_at", { ascending: false }).limit(4),
        supabase.from("brands").select("*").limit(6),
      ]);

      if (pdNew.data) setNewArrivals(pdNew.data);
      if (pdUsed.data) setUsedProducts(pdUsed.data);
      if (brRes.data) setBrands(brRes.data);
      setIsLoading(false);
    };

    fetchInitialData();
  }, []);

  useLayoutEffect(() => {
    registerGSAP();
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      // Hero entrance animations
      gsap.fromTo(
        ".hero-title",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.15, delay: 0.1 }
      );
      gsap.fromTo(
        ".hero-subtitle",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.6 }
      );
      gsap.fromTo(
        ".hero-button",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.8 }
      );
      gsap.fromTo(
        ".hero-image-wrapper",
        { scale: 0.95, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.4 }
      );

      // Scroll triggers setup
      revealFromBottom(".trust-badges");
      revealFromBottom(".marques-section");
      staggerReveal(".marque-card", 0.05);
      revealFromBottom(".deal-section");
      revealFromBottom(".arrivals-header");
      staggerReveal(".arrival-card", 0.1);
      revealFromBottom(".used-header");
      staggerReveal(".used-card", 0.1);

    }, container);
    return () => ctx.revert();
  }, [isLoading]);

  return (
    <div ref={container} className="flex flex-col pb-24 bg-transparent min-h-screen">
      
      {/* Hero Banner Luxe */}
      <section className="relative w-full min-h-[90svh] flex flex-col md:flex-row items-center container mx-auto px-6 pt-24 pb-12 gap-12 overflow-hidden">
        
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start z-10 space-y-8">
          <div className="hero-subtitle inline-flex items-center gap-3 px-4 py-2 rounded-full glass text-luxury-charcoal font-bold text-[10px] uppercase tracking-[0.2em] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            L'excellence technologique
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tighter text-luxury-charcoal font-outfit uppercase">
            <div className="overflow-hidden"><span className="hero-title block">Le Futur,</span></div>
            <div className="overflow-hidden"><span className="hero-title block text-luxury-gray">Entre Vos</span></div>
            <div className="overflow-hidden"><span className="hero-title block text-amber-600">Mains.</span></div>
          </h1>
          
          <p className="hero-subtitle text-lg md:text-xl text-luxury-gray max-w-md font-sans font-light leading-relaxed">
            Une sélection rigoureuse d'appareils haut de gamme. Neuf garanti et occasions certifiées, livrés élégamment partout en Algérie.
          </p>
          
          <div className="hero-button pt-4 flex gap-4">
            <Button size="lg" className="bg-luxury-charcoal text-white hover:bg-black hover:shadow-2xl hover:scale-105 transition-all duration-300 h-16 px-10 text-xs uppercase tracking-widest font-bold rounded-2xl">
              Découvrir
            </Button>
            <Link href="/promos">
              <Button variant="outline" size="lg" className="border-luxury-charcoal/10 text-luxury-charcoal hover:bg-slate-50 h-16 px-10 text-xs uppercase tracking-widest font-bold rounded-2xl">
                Offres du jour
              </Button>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center h-full relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent blur-3xl -z-10 rounded-full" />
          <div className="hero-image-wrapper relative w-full max-w-[500px] aspect-square glass rounded-[3rem] overflow-hidden shadow-2xl border border-white/40 flex items-center justify-center p-12 group">
            <Image 
              src="/anis-phone-logo-new.png" 
              alt="Anis Phone" 
              fill 
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-contain p-24 opacity-90 drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges Minimal */}
      <section className="trust-badges container mx-auto px-6 -mt-12 relative z-20">
        <div className="glass rounded-[2.5rem] p-10 grid grid-cols-1 sm:grid-cols-3 gap-10 divide-y sm:divide-y-0 sm:divide-x divide-black/5 shadow-2xl shadow-slate-200/50 border border-white/50">
          <div className="flex flex-col items-center text-center gap-6 px-4 hover:-translate-y-2 transition-transform duration-500">
            <div className="p-4 bg-luxury-charcoal text-white rounded-[1.5rem] shadow-lg">
              <Truck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-luxury-charcoal mb-2">Livraison Premium</h4>
              <p className="text-xs text-luxury-gray leading-relaxed font-light">Expédition soignée sur les 58 Wilayas.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-6 px-4 pt-10 sm:pt-0 hover:-translate-y-2 transition-transform duration-500">
            <div className="p-4 bg-luxury-charcoal text-white rounded-[1.5rem] shadow-lg">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-luxury-charcoal mb-2">Qualité Garantie</h4>
              <p className="text-xs text-luxury-gray leading-relaxed font-light">Chaque pièce est authentifiée par nos experts.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-6 px-4 pt-10 sm:pt-0 hover:-translate-y-2 transition-transform duration-500">
            <div className="p-4 bg-luxury-charcoal text-white rounded-[1.5rem] shadow-lg">
              <CheckCircle className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-luxury-charcoal mb-2">Paiement Sécurisé</h4>
              <p className="text-xs text-luxury-gray leading-relaxed font-light">Réglez à réception, en toute sérénité.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-32 pt-24">
        {/* Acheter par Marque */}
        <section className="marques-section container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <p className="text-[10px] font-bold text-luxury-gray uppercase tracking-[0.3em] mb-4">Nos Partenaires</p>
            <h2 className="font-outfit text-4xl text-luxury-charcoal font-black uppercase tracking-tighter">Maisons Technologiques</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {brands.map((brand, i) => (
              <Link key={i} href={`/categorie/smartphones/${brand.slug}`} className="marque-card group flex flex-col items-center justify-center bg-white border border-slate-100 shadow-sm rounded-2xl p-8 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300">
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} className="h-10 mb-4 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mb-3">
                    {brand.name[0]}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{brand.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Nouveaux Arrivages */}
        <section className="container mx-auto px-6">
          <div className="arrivals-header flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="font-outfit text-4xl font-black text-luxury-charcoal uppercase tracking-tighter">Nouveautés</h2>
              <p className="text-luxury-gray mt-2 font-light">Les dernières sorties technologiques mondiales.</p>
            </div>
            <Link href="/nouveautes" className="text-[10px] font-bold uppercase tracking-widest text-white bg-luxury-charcoal px-8 py-4 rounded-2xl hover:bg-black transition-all flex items-center group">
              Collection complète <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map(product => (
              <div key={product.id} className="arrival-card">
                <ProductCard 
                  {...product} 
                  slug={product.slug}
                  brand={product.brands?.name || ""}
                  price={product.base_price}
                  promoPrice={product.promo_price}
                  image={product.images?.[0] || ""} 
                />
              </div>
            ))}
          </div>
        </section>

        {/* Occasions Premium */}
        <section className="container mx-auto px-6">
          <div className="used-header flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="font-outfit text-4xl font-black text-luxury-charcoal uppercase tracking-tighter">Heritage Collection</h2>
              <p className="text-luxury-gray mt-2 font-light">Modèles d'occasion certifiés par nos techniciens experts.</p>
            </div>
            <Link href="/occasions" className="text-[10px] font-bold uppercase tracking-widest text-white bg-luxury-charcoal px-8 py-4 rounded-2xl hover:bg-black transition-all flex items-center group">
              Toutes les offres <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {usedProducts.map(product => (
              <div key={product.id} className="used-card">
                <ProductCard 
                  {...product} 
                  slug={product.slug}
                  brand={product.brands?.name || ""}
                  price={product.base_price}
                  promoPrice={product.promo_price}
                  image={product.images?.[0] || ""} 
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
