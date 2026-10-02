"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  TrendingUp,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Smartphone,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const navSections = [
  {
    label: "PILOTAGE COMMERCIAL",
    items: [
      { label: "Tableau de bord", icon: LayoutDashboard, path: "/admin/dashboard" },
      { label: "Catalogue Produits", icon: Package, path: "/admin/products" },
      { label: "Inventaire & Stock", icon: Layers, path: "/admin/stock" },
      { label: "Commandes", icon: ShoppingCart, path: "/admin/orders" },
      { label: "Clients & CRM", icon: Users, path: "/admin/clients" },
    ],
  },
  {
    label: "ANALYTIQUE & FINANCE",
    items: [
      { label: "Rapports & Ventes", icon: FileSpreadsheet, path: "/admin/reports" },
      { label: "Performance", icon: TrendingUp, path: "/admin/reports" },
    ],
  },
  {
    label: "CONFIGURATION",
    items: [
      { label: "Paramètres Boutique", icon: Settings, path: "/admin/settings" },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname === path || pathname.startsWith(path + "/");
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignored if offline
    }
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-luxury-charcoal font-sans selection:bg-[#c5a059]/20 selection:text-[#c5a059]">
      {/* ── SIDEBAR DESKTOP & MOBILE ───────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-[240px] bg-[#0a0a14] text-[#f0ede8] border-r border-white/5 transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-[70px] px-5 border-b border-white/5 shrink-0 bg-[#060610]">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c5a059] to-[#99732e] flex items-center justify-center shrink-0 shadow-lg shadow-[#c5a059]/10">
              <Smartphone size={18} className="text-[#060610]" />
            </div>
            <div>
              <span className="font-outfit font-bold tracking-[0.2em] text-[13px] text-[#f0ede8] block uppercase">
                ANIS PHONE
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#c5a059] block font-medium">
                ADMIN CONSOLE
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/50 hover:text-white"
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Store Quick Switcher & Storefront Link */}
        <div className="p-3 border-b border-white/5">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-xs text-[#f0ede8] transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-[11px] uppercase tracking-wider">Voir la Boutique</span>
            </div>
            <ExternalLink size={13} className="text-white/40 group-hover:text-[#c5a059] transition-colors" />
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-1.5">
              <div className="px-3 text-[9px] font-semibold text-[#c5a059]/70 uppercase tracking-[1.5px]">
                {section.label}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`group relative flex items-center gap-3 h-10 px-3 rounded-lg text-xs font-medium transition-all ${
                        active
                          ? "bg-gradient-to-r from-[#c5a059] to-[#b38b42] text-[#060610] font-semibold shadow-md shadow-[#c5a059]/10"
                          : "text-white/70 hover:bg-white/[0.05] hover:text-[#f0ede8]"
                      }`}
                    >
                      <item.icon size={16} className={active ? "text-[#060610]" : "text-white/50 group-hover:text-white transition-colors"} />
                      <span>{item.label}</span>
                      {active && (
                        <motion.div 
                          layoutId="active-nav-pill"
                          className="absolute right-2 w-1.5 h-3 rounded-full bg-[#060610]"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-white/5 bg-[#060610]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={15} />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── TOP HEADER NAVBAR ─────────────────────────────────── */}
      <header 
        className={`fixed top-0 right-0 left-0 lg:left-[240px] z-20 h-[70px] transition-all duration-300 ${
          scrolled 
            ? "bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm" 
            : "bg-white border-b border-slate-200/60"
        }`}
      >
        <div className="flex items-center justify-between h-full px-6 lg:px-8">
          {/* Left Menu Trigger & Search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              aria-label="Ouvrir le menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-3 w-80 h-10 rounded-xl bg-slate-50 border border-slate-200/80 px-4 transition-all focus-within:border-[#c5a059]/50 focus-within:ring-4 focus-within:ring-[#c5a059]/10">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Recherche articles, commandes, wilayas..."
                className="bg-transparent text-xs outline-none w-full text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Status Badges & Admin Profile */}
          <div className="flex items-center gap-4">
            {/* Algerian Flag Pill & Currency */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200">
              <span>🇩🇿</span>
              <span className="text-[11px]">Boutique Algérie (DZD)</span>
            </div>

            {/* Notifications Bell */}
            <button className="relative p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all group" aria-label="Notifications">
              <Bell size={18} className="group-hover:scale-105 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#c5a059] rounded-full border-2 border-white shadow-sm" />
            </button>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 pl-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all"
              >
                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-slate-900 leading-tight">Anis Phone</div>
                  <div className="text-[10px] text-slate-400 font-medium">Showroom Alger</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c5a059] to-[#8c6d32] flex items-center justify-center text-[#060610] font-black text-xs shadow-sm">
                  AP
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 z-20 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 p-1"
                    >
                      <Link
                        href="/admin/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Settings size={15} />
                        Paramètres de la boutique
                      </Link>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => { setProfileOpen(false); handleLogout(); }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut size={15} />
                        Déconnexion
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN VIEWPORT CONTENT ─────────────────────────────── */}
      <main className="lg:ml-[240px] pt-[70px] min-h-[calc(100vh-70px)]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
