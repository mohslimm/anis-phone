"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { ProductGrid } from "@/components/ui/product-grid";
import { BannerCarousel } from "@/components/ui/banner-carousel";
import { ArrowRight, Truck, ShieldCheck, CheckCircle } from "lucide-react";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { revealFromBottom, registerGSAP, staggerReveal } from "@/lib/animations";

import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { useEffect, useState } from "react";
import { DataService, Brand } from "@/lib/data-service";

export default function HomePage() {
  const container = useRef<HTMLDivElement>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const data = await DataService.getBrands();
      setBrands(data.slice(0, 6));
    };
    fetchBrands();
  }, []);

  useLayoutEffect(() => {
    registerGSAP();
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 1px)", () => {
        // Hero entrance animations
        gsap.to(".hero-title", {
          y: 0, opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.15, delay: 0.1
        });
        gsap.to(".hero-subtitle", {
          y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.6
        });
        gsap.to(".hero-button", {
          y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.8
        });
        gsap.to(".hero-image-wrapper", {
          scale: 1, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.4
        });
      });

      // Scroll triggers setup
      revealFromBottom(".trust-badges");
      revealFromBottom(".marques-section");
      staggerReveal(".marque-card", 0.05);
      revealFromBottom(".deal-section");
      revealFromBottom(".arrivals-section");
      revealFromBottom(".heritage-section");

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="flex flex-col pb-24 bg-luxury-offwhite text-luxury-charcoal selection:bg-black/10 min-h-screen">
      
      {/* Hero Banner Luxe */}
      <section className="relative w-full min-h-[90svh] flex flex-col md:flex-row items-center container mx-auto px-6 pt-24 pb-12 gap-12 overflow-hidden">
        
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start z-10 space-y-8">
          <div className="hero-subtitle opacity-0 translate-y-[20px] inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/5 text-luxury-charcoal font-medium text-xs tracking-widest uppercase border border-black/5">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            L'excellence technologique
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.05] tracking-tight text-luxury-charcoal font-outfit">
            <div className="overflow-hidden"><span className="hero-title opacity-0 translate-y-[50px] block font-semibold">Smartphones,</span></div>
            <div className="overflow-hidden"><span className="hero-title opacity-0 translate-y-[50px] block">Informatique &</span></div>
            <div className="overflow-hidden"><span className="hero-title opacity-0 translate-y-[50px] block italic text-luxury-gray">Lifestyle.</span></div>
          </h1>
          
          <p className="hero-subtitle opacity-0 translate-y-[20px] text-lg md:text-xl text-luxury-gray max-w-md font-sans font-light leading-relaxed">
            Une sélection rigoureuse d'appareils haut de gamme. Neuf garanti et occasions certifiées, livrés élégamment partout en Algérie.
          </p>
          
          <div className="hero-button opacity-0 translate-y-[20px] pt-4">
            <Button size="lg" className="bg-luxury-charcoal text-white hover:bg-black hover:scale-105 active:scale-95 transition-all duration-300 h-14 px-8 text-sm uppercase tracking-widest rounded-none">
              Découvrir la collection
            </Button>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center h-full relative">
          <div className="hero-image-wrapper opacity-0 scale-95 relative w-full max-w-[500px] aspect-[4/5] bg-luxury-sand overflow-hidden shadow-2xl rounded-none">
            <Image 
              src="/hero/phone-aesthetic.jpg" 
              alt="Premium Smartphone" 
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges Minimal */}
      <section className="trust-badges container mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white border text-luxury-charcoal p-8 grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-black/5">
          <div className="flex flex-col items-center text-center gap-3 px-4">
            <Truck className="w-6 h-6 stroke-[1.5]" />
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-1">Livraison Premium</h4>
              <p className="text-sm text-luxury-gray leading-relaxed">Expédition soignée sur les 58 Wilayas.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3 px-4 pt-6 sm:pt-0">
            <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-1">Qualité Garantie</h4>
              <p className="text-sm text-luxury-gray leading-relaxed">Chaque pièce est authentifiée nos experts.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3 px-4 pt-6 sm:pt-0">
            <CheckCircle className="w-6 h-6 stroke-[1.5]" />
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-1">Paiement Sécurisé</h4>
              <p className="text-sm text-luxury-gray leading-relaxed">Réglez à réception, en toute sérénité.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-12 pt-24">
        {/* Acheter par Marque */}
        <section className="marques-section container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="font-outfit text-3xl md:text-4xl text-luxury-charcoal font-light mb-4">Maisons Technologiques</h2>
            <div className="w-12 h-[1px] bg-luxury-gray/50"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {brands.map((brand, i) => (
              <Link key={i} href={`/categorie/smartphones/${brand.slug}`} className="marque-card group flex flex-col items-center justify-center bg-luxury-sand/50 p-8 hover:bg-black hover:text-white transition-colors duration-500">
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} className="h-8 mb-4 object-contain opacity-70 group-hover:opacity-100 group-hover:invert transition-all" />
                ) : (
                  <span className="text-2xl mb-4 font-bold">{brand.name[0]}</span>
                )}
                <span className="text-xs font-semibold tracking-widest uppercase">{brand.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Nouveaux Arrivages via ProductGrid */}
        <div className="arrivals-section">
          <ProductGrid 
            title="Nouveautés" 
            condition="new" 
            limit={4} 
            viewAllLink="/nouveautes"
          />
        </div>

        {/* Heritage Collection via ProductGrid */}
        <div className="heritage-section">
          <ProductGrid 
            title="Heritage Collection" 
            condition="used" 
            limit={4} 
            viewAllLink="/occasions"
          />
        </div>
      </div>
    </div>
  );
}

