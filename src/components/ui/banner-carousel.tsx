"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { gsap } from "gsap";

export function BannerCarousel() {
  const [banners, setBanners] = useState<any[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("is_active", true)
          .order("position", { ascending: true });
        
        if (!error && data && data.length > 0) {
          setBanners(data);
          return;
        }
      } catch {
        // fallback
      }

      // Fallback banners if DB is offline or empty
      setBanners([
        {
          id: 1,
          title: "L'Ère du Titane & Puissance",
          subtitle: "Découvrez l'iPhone 16 Pro Max. Puissance brute et finitions d'exception.",
          image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop",
          link: "/produit/iphone-16-pro-max"
        },
        {
          id: 2,
          title: "Galaxy S24 Ultra Titanium",
          subtitle: "L'intelligence artificielle Galaxy AI au creux de votre main.",
          image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1200&auto=format&fit=crop",
          link: "/produit/samsung-s24-ultra"
        }
      ]);
    };
    fetchBanners();
  }, []);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-luxury-offwhite">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full flex">
          {banners.map((banner, index) => (
            <div key={banner.id} className="embla__slide flex-[0_0_100%] min-w-0 h-full relative">
              <div className="absolute inset-0 z-0">
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />
              </div>
              
              <div className="container mx-auto h-full px-6 flex flex-col justify-center items-start relative z-20 text-white space-y-6">
                <div className="overflow-hidden">
                  <p className="banner-subtitle text-xs md:text-sm uppercase tracking-[0.3em] font-medium opacity-80 translate-y-full">
                    {banner.subtitle}
                  </p>
                </div>
                <div className="overflow-hidden">
                  <h2 className="banner-title text-5xl md:text-7xl lg:text-8xl font-outfit font-light leading-tight translate-y-full">
                    {banner.title.split(' ').map((word: string, i: number) => (
                      <span key={i} className={i === 0 ? "font-bold" : ""}>{word} </span>
                    ))}
                  </h2>
                </div>
                <div className="pt-4 opacity-0 banner-button translate-y-10">
                  <Link 
                    href={banner.link || "/"}
                    className="inline-flex items-center justify-center bg-white text-luxury-charcoal hover:bg-[#c5a059] hover:text-black rounded-none h-14 px-10 text-xs font-semibold uppercase tracking-widest transition-all duration-300"
                  >
                    Découvrir <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-12 right-12 z-30 flex gap-4">
        <button 
          onClick={scrollPrev}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-luxury-charcoal transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={scrollNext}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-luxury-charcoal transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-12 z-30 flex gap-2">
        {banners.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 transition-all duration-500 ${i === selectedIndex ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
}
