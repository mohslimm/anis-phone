"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

const navLinks = [
  {
    label: "Smartphones",
    href: "/categorie/smartphones",
    children: ["Apple", "Samsung", "Xiaomi", "Oppo", "Realme", "Honor", "Poco", "Vivo"],
  },
  { label: "Occasions", href: "/occasions", highlight: true },
  { label: "Tablettes", href: "/categorie/tablettes" },
  { label: "Laptops", href: "/categorie/laptops" },
  { label: "Smartwatches", href: "/categorie/smartwatches" },
  { label: "Accessoires", href: "/categorie/accessoires" },
  { label: "Packs exclusifs", href: "/packs" },
];

export function Header() {
  const { getCartCount, setCartOpen } = useCartStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-b border-black/5"
          : "bg-white border-b border-black/5"
      }`}
    >
      {/* ── LOGO + SEARCH + ACTIONS ─────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Mobile hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Sheet */}
            <Sheet>
              <SheetTrigger
                render={
                  <button className="lg:hidden p-1.5 text-luxury-charcoal">
                    <Menu className="w-5 h-5 stroke-[1.5]" />
                  </button>
                }
              />
              <SheetContent side="left" className="w-[300px] bg-white border-black/5 p-8">
                <SheetHeader className="border-b border-black/5 pb-6 mb-6">
                  <SheetTitle className="font-outfit font-light tracking-[0.2em] text-luxury-charcoal text-lg flex items-center gap-2">
                    <Image
                      src="/anis-phone-logo.png"
                      alt="ANIS PHONE Logo"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    <span>ANIS PHONE</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 font-sans text-sm">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`py-1 border-b border-black/5 font-light hover:pl-2 transition-all ${
                        link.highlight ? "font-medium" : "text-luxury-charcoal"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="relative w-11 h-11 bg-luxury-charcoal rounded-xl flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(15,23,42,0.15)]">
                  <Image
                    src="/anis-phone-logo-new.png"
                    alt="ANIS PHONE Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  {/* Subtle shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full"
                    animate={{ translateX: ["100%", "-100%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 2 }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-extrabold tracking-[0.25em] leading-tight text-luxury-charcoal uppercase font-outfit">
                  Anis<span className="text-amber-600">.</span>Phone
                </span>
                <span className="text-[9px] font-bold tracking-[0.4em] text-luxury-gray uppercase opacity-80">
                  L'excellence Mobile
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar — Desktop */}
          <div className="hidden sm:flex flex-1 max-w-md relative mx-8">
            <div
              className={`flex w-full items-center gap-3 px-4 py-2 bg-luxury-offwhite border transition-all duration-300 rounded-2xl ${
                isSearchFocused ? "border-luxury-charcoal/20 ring-4 ring-luxury-charcoal/5 bg-white" : "border-black/5"
              }`}
            >
              <Search className="w-4 h-4 text-luxury-gray shrink-0 stroke-[2]" />
              <Input
                type="search"
                placeholder="Rechercher un modèle, une marque..."
                className="border-0 bg-transparent h-6 px-0 focus-visible:ring-0 shadow-none rounded-none placeholder:text-luxury-gray/60 font-medium text-[13px] text-luxury-charcoal"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>

            {/* Autocomplete dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-black/5 shadow-2xl p-5 z-50">
                <p className="text-[10px] text-luxury-gray font-semibold uppercase tracking-[0.2em] mb-3">
                  Recherches suggérées
                </p>
                {["iPhone 15 Pro Max 256Go", "Samsung Galaxy S24 Ultra", "MacBook Air M2"].map(
                  (q) => (
                    <div
                      key={q}
                      className="flex items-center gap-3 py-2 cursor-pointer hover:text-luxury-gray transition-colors text-sm font-light"
                    >
                      <span className="w-4 h-[1px] bg-luxury-gray shrink-0" />
                      {q}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Account + Cart */}
          <div className="flex items-center gap-5">
            <Link
              href="/admin/login"
              className="hidden sm:flex items-center gap-1.5 text-luxury-charcoal hover:opacity-60 transition-opacity"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Compte</span>
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-1.5 text-luxury-charcoal hover:opacity-60 transition-opacity relative"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 bg-red-500 text-white min-w-[18px] h-[18px] p-0 flex items-center justify-center text-[10px] font-bold border-2 border-white rounded-full shadow-sm">
                    {cartCount}
                  </Badge>
                )}
              </div>
              <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-[0.2em]">
                Panier
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Search ────────────────────────────────────────── */}
      <div className="sm:hidden px-4 pb-3 border-t border-black/5">
        <div className="flex items-center gap-2 border-b border-black/10 pb-2 mt-2">
          <Search className="w-4 h-4 text-luxury-gray shrink-0" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="border-0 bg-transparent h-8 px-0 focus-visible:ring-0 shadow-none rounded-none placeholder:text-luxury-gray text-sm"
          />
        </div>
      </div>
    </header>
  );
}
