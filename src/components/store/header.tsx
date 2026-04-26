"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5"
          : "bg-white border-b border-black/5"
      }`}
    >
      {/* ── ROW 1 : TOP BANNER ───────────────────────────────────── */}
      <div className="bg-luxury-charcoal text-white text-[10px] py-1.5 text-center tracking-[0.25em] uppercase font-medium">
        Livraison Première 58 Wilayas&nbsp;&nbsp;|&nbsp;&nbsp;Garantie Excellence&nbsp;&nbsp;|&nbsp;&nbsp;Paiement à la livraison
      </div>

      {/* ── ROW 2 : LOGO + SEARCH + ACTIONS ─────────────────────── */}
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
            <Link href="/" className="group flex items-center gap-2">
              <Image
                src="/anis-phone-logo.png"
                alt="ANIS PHONE Logo"
                width={60}
                height={20}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Search Bar — Desktop */}
          <div className="hidden sm:flex flex-1 max-w-md relative mx-8">
            <div
              className={`flex w-full items-center gap-2 border-b pb-1 transition-all duration-300 ${
                isSearchFocused ? "border-luxury-charcoal" : "border-black/10"
              }`}
            >
              <Search className="w-4 h-4 text-luxury-gray shrink-0 stroke-[1.5]" />
              <Input
                type="search"
                placeholder="Explorer notre catalogue..."
                className="border-0 bg-transparent h-8 px-0 focus-visible:ring-0 shadow-none rounded-none placeholder:text-luxury-gray font-light text-sm text-luxury-charcoal"
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
                  <Badge className="absolute -top-2 -right-2 bg-luxury-charcoal text-white min-w-[16px] h-[16px] p-0 flex items-center justify-center text-[9px] font-medium border-none rounded-none">
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

      {/* ── ROW 3 : NAVIGATION BAR ───────────────────────────────── */}
      <div className="hidden lg:block border-t border-black/5">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-0 h-10 text-[11px] font-medium uppercase tracking-[0.12em]">
            {/* Affaire du Jour — special pill */}
            <Link
              href="/promos"
              className="flex items-center gap-1.5 px-4 h-full text-red-500 hover:bg-red-50 transition-colors border-r border-black/5 shrink-0"
            >
              <span className="text-base leading-none">%</span>
              Affaire du jour
            </Link>

            {/* Main nav links */}
            {navLinks.map((link) => (
              <div key={link.href} className="relative group h-full">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-4 h-full whitespace-nowrap transition-colors hover:bg-black/3 ${
                    link.highlight
                      ? "text-amber-500 hover:text-amber-600"
                      : "text-luxury-charcoal hover:text-black"
                  }`}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>

                {/* Mega dropdown for Smartphones */}
                {link.children && (
                  <div className="absolute top-full left-0 hidden group-hover:grid grid-cols-2 gap-x-8 gap-y-2 bg-white border border-black/5 shadow-2xl p-6 w-56 z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child}
                        href={`/categorie/smartphones/${child.toLowerCase()}`}
                        className="text-luxury-charcoal font-light text-[11px] hover:text-black hover:pl-1 transition-all py-1"
                      >
                        {child}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
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
