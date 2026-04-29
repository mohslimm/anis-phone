"use client";

import Link from "next/link";
import { 
  Smartphone, 
  Laptop, 
  Watch, 
  Tablet, 
  Headphones, 
  Package, 
  History,
  Sparkles,
  Percent,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Navigation() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories = [
    { name: "Smartphones", href: "/categorie/smartphones", icon: <Smartphone className="w-4 h-4" />, hasDropdown: true },
    { name: "Occasions", href: "/occasions", icon: <History className="w-4 h-4" />, highlight: true },
    { name: "Tablettes", href: "/categorie/tablettes", icon: <Tablet className="w-4 h-4" />, hasDropdown: false },
    { name: "Laptops", href: "/categorie/laptops", icon: <Laptop className="w-4 h-4" />, hasDropdown: false },
    { name: "Smartwatches", href: "/categorie/smartwatches", icon: <Watch className="w-4 h-4" />, hasDropdown: false },
    { name: "Accessoires", href: "/categorie/accessoires", icon: <Headphones className="w-4 h-4" />, hasDropdown: false },
    { name: "Packs exclusifs", href: "/packs", icon: <Package className="w-4 h-4" />, hasDropdown: false },
  ];

  return (
    <nav className="hidden lg:block bg-white/70 backdrop-blur-md border-b border-black/5 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center space-x-1">
          <li 
            className="relative"
            onMouseEnter={() => setHoveredCategory("promo")}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link 
              href="/promos" 
              className="flex items-center gap-2 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-red-600 transition-colors duration-300 relative z-10"
            >
              <Percent className="w-3.5 h-3.5" />
              Affaire du jour
            </Link>
            {hoveredCategory === "promo" && (
              <motion.div 
                layoutId="nav-bg"
                className="absolute inset-0 bg-red-50/50 rounded-lg -z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </li>
          
          <div className="w-[1px] h-4 bg-black/10 mx-2" />
          
          {categories.map((cat) => (
            <li 
              key={cat.name} 
              className="relative group"
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link 
                href={cat.href}
                className={`flex items-center gap-2 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 relative z-10
                  ${cat.highlight 
                    ? 'text-amber-600' 
                    : 'text-luxury-charcoal/70 group-hover:text-luxury-charcoal'}
                `}
              >
                {cat.icon}
                {cat.name}
                {cat.hasDropdown && <ChevronDown className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />}
              </Link>
              
              <AnimatePresence>
                {hoveredCategory === cat.name && (
                  <motion.div 
                    layoutId="nav-bg"
                    className={`absolute inset-0 rounded-lg -z-0 ${cat.highlight ? 'bg-amber-50/50' : 'bg-black/[0.03]'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatePresence>

              {/* Bottom line animation */}
              <AnimatePresence>
                {hoveredCategory === cat.name && (
                  <motion.div 
                    layoutId="nav-line"
                    className={`absolute bottom-0 left-0 right-0 h-[2px] z-20 ${cat.highlight ? 'bg-amber-600' : 'bg-luxury-charcoal'}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 0.8 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              
              {/* Mega Menu for Smartphones */}
              {cat.hasDropdown && (
                <div className="absolute top-full left-0 w-[240px] bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-black/5 rounded-b-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                  <div className="p-4 grid grid-cols-1 gap-1">
                    <p className="text-[9px] text-luxury-gray font-bold uppercase tracking-[0.2em] mb-3 px-3">Explorez les marques</p>
                    {["Apple", "Samsung", "Xiaomi", "Oppo", "Realme", "Honor", "Poco"].map(brand => (
                      <Link 
                        key={brand} 
                        href={`/categorie/smartphones/${brand.toLowerCase()}`}
                        className="px-4 py-2.5 text-[11px] text-luxury-charcoal/80 hover:text-luxury-charcoal hover:bg-slate-50/80 rounded-xl transition-all duration-200 font-medium flex items-center justify-between group/item"
                      >
                        <span className="group-hover/item:translate-x-1 transition-transform">{brand}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-luxury-charcoal/20 group-hover/item:bg-luxury-charcoal transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
