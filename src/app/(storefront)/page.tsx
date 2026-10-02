"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/ui/product-grid";
import { ArrowRight, Truck, ShieldCheck, CheckCircle } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { revealFromBottom, registerGSAP, staggerReveal } from "@/lib/animations";
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

  useEffect(() => {
    registerGSAP();
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      // Hero entrance animations
      gsap.fromTo(
        ".hero-title",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power4.out", stagger: 0.15, delay: 0.1 }
      );
      gsap.fromTo(
        ".hero-subtitle",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
      );
      gsap.fromTo(
        ".hero-button",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.7 }
      );
      gsap.fromTo(
        ".hero-image-wrapper",
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.3, ease: "power3.out", delay: 0.3 }
      );

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
    <div ref={container} className="flex flex-col pb-24 bg-transparent min-h-screen">
      
      {/* Hero Banner Luxe */}
      <section className="relative w-full min-h-[85svh] flex flex-col md:flex-row items-center container mx-auto px-6 pt-16 pb-12 gap-12 overflow-hidden">
        
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start z-10 space-y-6">
          <div className="hero-subtitle inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/5 text-luxury-charcoal font-semibold text-[10px] tracking-[0.2em] uppercase border border-black/5">
            <span className="w-2 h-2 rounded-full bg-[#c5a059]"></span>
            L&apos;Excellence Technologique Showroom
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-light leading-[1.08] tracking-tight text-luxury-charcoal font-outfit">
            <span className="hero-title block font-semibold">Smartphones,</span>
            <span className="hero-title block">Informatique &amp;</span>
            <span className="hero-title block italic text-[#c5a059] font-serif">Haute Technologie.</span>
          </h1>
          
          <p className="hero-subtitle text-sm md:text-base text-luxury-gray max-w-md font-sans font-light leading-relaxed">
            Une sélection rigoureuse d&apos;appareils sous blister scellé et d&apos;occasions certifiées Héritage A+, livrés élégamment partout en Algérie.
          </p>
          
          <div className="hero-button pt-2 flex flex-wrap gap-4">
            <Link href="/categorie/smartphones">
              <Button size="lg" className="bg-luxury-charcoal text-white hover:bg-black hover:scale-105 active:scale-95 transition-all duration-300 h-13 px-8 text-xs uppercase tracking-widest rounded-xl font-semibold">
                Explorer le Catalogue
              </Button>
            </Link>
            <Link href="/promos">
              <Button variant="outline" size="lg" className="border-black/15 text-luxury-charcoal hover:bg-black/5 h-13 px-8 text-xs uppercase tracking-widest font-semibold rounded-xl">
                Affaires du Jour %
              </Button>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center h-full relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#c5a059]/15 to-transparent blur-3xl -z-10 rounded-full" />
          <div className="hero-image-wrapper relative w-full max-w-[480px] aspect-[4/5] bg-luxury-sand/50 overflow-hidden shadow-2xl rounded-2xl border border-black/5 flex items-center justify-center p-6">
            <Image 
              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop" 
              alt="Premium Smartphone Anis Phone" 
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges Minimal */}
      <section className="trust-badges container mx-auto px-6 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-black/5 shadow-xl shadow-black/5 border border-black/5">
          <div className="flex flex-col items-center text-center gap-4 px-4">
            <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] rounded-xl border border-[#c5a059]/20">
              <Truck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-luxury-charcoal mb-1">Livraison 58 Wilayas</h4>
              <p className="text-xs text-luxury-gray leading-relaxed font-light">Expédition soignée à domicile ou en point relais StopDesk.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4 px-4 pt-6 sm:pt-0">
            <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] rounded-xl border border-[#c5a059]/20">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-luxury-charcoal mb-1">Qualité &amp; Traçabilité</h4>
              <p className="text-xs text-luxury-gray leading-relaxed font-light">Chaque appareil dispose d&apos;un certificat de garantie et contrôle IMEI.</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4 px-4 pt-6 sm:pt-0">
            <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] rounded-xl border border-[#c5a059]/20">
              <CheckCircle className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-luxury-charcoal mb-1">Paiement à la Réception</h4>
              <p className="text-xs text-luxury-gray leading-relaxed font-light">Réglez en espèces auprès du livreur après vérification du colis.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-16 pt-16">
        {/* Acheter par Marque */}
        <section className="marques-section container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-10">
            <p className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.3em] mb-2 font-mono">Maisons Partenaires</p>
            <h2 className="font-outfit text-3xl font-light text-luxury-charcoal">Les Grandes Marques</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {brands.map((brand, i) => (
              <Link key={i} href={`/categorie/smartphones/${brand.slug}`} className="marque-card group flex flex-col items-center justify-center bg-white border border-black/5 rounded-xl p-6 hover:shadow-md hover:border-[#c5a059]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-lg font-bold text-luxury-charcoal group-hover:bg-[#c5a059] group-hover:text-black transition-colors mb-3">
                  {brand.name[0]}
                </div>
                <span className="text-xs font-semibold text-luxury-charcoal group-hover:text-[#c5a059] transition-colors">{brand.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Nouveaux Arrivages via ProductGrid */}
        <div className="arrivals-section">
          <ProductGrid 
            title="Nouveautés Scellées" 
            condition="new" 
            limit={4} 
            viewAllLink="/nouveautes"
          />
        </div>

        {/* Heritage Collection via ProductGrid */}
        <div className="heritage-section">
          <ProductGrid 
            title="Collection Héritage (Occasions Certifiées A+)" 
            condition="used" 
            limit={4} 
            viewAllLink="/occasions"
          />
        </div>
      </div>
    </div>
  );
}
