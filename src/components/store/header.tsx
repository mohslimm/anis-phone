"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { createClient } from "@/lib/supabase/client";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2, X } from "lucide-react";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { DataService } from "@/lib/data-service";

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
  const { items, setCartOpen } = useCartStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearch.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, images, base_price, promo_price")
          .ilike("name", `%${debouncedSearch}%`)
          .limit(5);

        if (!error && data && data.length > 0) {
          setSearchResults(data);
        } else {
          // Fallback avec DataService instantané
          const localMatch = await DataService.getProducts({ search: debouncedSearch, limit: 5 });
          setSearchResults(localMatch);
        }
      } catch {
        const localMatch = await DataService.getProducts({ search: debouncedSearch, limit: 5 });
        setSearchResults(localMatch);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  useEffect(() => {
    setMounted(true);
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
                      className={`py-3 border-b border-black/5 font-light hover:pl-2 transition-all block focus-visible:ring-1 focus-visible:ring-luxury-charcoal focus-visible:outline-none ${
                        link.highlight ? "font-medium text-amber-600" : "text-luxury-charcoal"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2 focus-visible:ring-1 focus-visible:ring-luxury-charcoal focus-visible:outline-none">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="p-1 hover:bg-black/5 rounded-full">
                  <X className="w-3 h-3 text-luxury-gray" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && (searchQuery.length >= 2) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/5 shadow-2xl z-50 overflow-hidden">
                {isSearching ? (
                  <div className="p-4 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-luxury-gold" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/produit/${product.slug}`}
                        className="flex items-center gap-3 p-3 hover:bg-luxury-offwhite transition-colors border-b border-black/5 last:border-0"
                        onClick={() => setIsSearchFocused(false)}
                      >
                        <div className="relative w-12 h-12 bg-luxury-sand shrink-0 overflow-hidden">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-contain p-1" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-luxury-gray opacity-20">PNG</div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-medium text-luxury-charcoal truncate">{product.name}</span>
                          <span className="text-[11px] font-bold text-luxury-gold">
                            {formatPrice(product.promo_price ?? product.base_price)} DZD
                          </span>
                        </div>
                      </Link>
                    ))}
                    <Link 
                      href={`/recherche?q=${encodeURIComponent(searchQuery)}`}
                      className="p-3 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-charcoal hover:bg-luxury-gold hover:text-white transition-all"
                    >
                      Voir tous les résultats
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 text-center text-[11px] text-luxury-gray uppercase tracking-widest">
                    Aucune pièce trouvée
                  </div>
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
              className="flex items-center gap-1.5 text-luxury-charcoal hover:opacity-60 transition-opacity relative focus-visible:ring-1 focus-visible:ring-luxury-charcoal focus-visible:outline-none"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {mounted && cartCount > 0 && (
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
              className="flex items-center gap-1.5 px-4 h-full text-red-500 hover:bg-red-50 transition-colors border-r border-black/5 shrink-0 focus-visible:ring-1 focus-visible:ring-luxury-charcoal focus-visible:outline-none"
            >
              <span className="text-base leading-none">%</span>
              Affaire du jour
            </Link>

            {/* Main nav links */}
            {navLinks.map((link) => (
              <div key={link.href} className="relative group h-full">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-4 h-full whitespace-nowrap transition-colors hover:bg-black/3 focus-visible:ring-1 focus-visible:ring-luxury-charcoal focus-visible:outline-none ${
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>
    </header>
  );
}
