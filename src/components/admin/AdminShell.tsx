"use client";

import { useState } from "react";
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
  ChevronDown,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navSections = [
  {
    label: "PILOTAGE COMMERCIAL",
    items: [
      { label: "Tableau de bord", icon: LayoutDashboard, path: "/admin/dashboard" },
      { label: "Catalogue Produits", icon: Package, path: "/admin/products" },
      { label: "Inventaire & Stock", icon: Layers, path: "/admin/stock" },
      { label: "Commandes", icon: ShoppingCart, path: "/admin/orders" },
      { label: "Clients & CRM", icon: Users, path: "/admin/customers" },
    ],
  },
  {
    label: "ANALYTIQUE & FINANCE",
    items: [
      { label: "Revenus & Ventes", icon: TrendingUp, path: "/admin/revenue" },
      { label: "Rapports & Exports", icon: FileSpreadsheet, path: "/admin/reports" },
    ],
  },
  {
    label: "CONFIGURATION",
    items: [
      { label: "Paramètres Boutique", icon: Settings, path: "/admin/settings" },
      { label: "Guide & Support", icon: HelpCircle, path: "/admin/help" },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname.startsWith(path);
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
    <div className="min-h-screen bg-[#f4f4f7] text-[#1a1a1a]">

      {/* ── SIDEBAR DESKTOP & MOBILE ───────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-[240px] bg-[#0a0a14] text-[#f0ede8] border-r border-white/5 transition-transform duration-200 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/5 shrink-0 bg-[#060610]">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none bg-gradient-to-br from-[#c5a059] to-[#99732e] flex items-center justify-center shrink-0 shadow-sm">
              <Smartphone size={16} className="text-[#060610]" />
            </div>
            <div>
              <span className="font-outfit font-light tracking-[0.2em] text-sm text-[#f0ede8] block uppercase">
                ANIS PHONE
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#c5a059] block">
                ADMIN CONSOLE
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/50 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Store Quick Switcher & Storefront Link */}
        <div className="p-3 border-b border-white/5">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-xs text-[#f0ede8] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium">Voir la Boutique</span>
            </div>
            <ExternalLink size={13} className="text-white/40" />
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="px-3 mb-2 text-[9px] font-semibold text-[#c5a059]/70 uppercase tracking-[1.5px]">
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
                      className={`flex items-center gap-3 h-9 px-3 text-xs font-medium transition-all ${
                        active
                          ? "bg-gradient-to-r from-[#c5a059] to-[#b38b42] text-[#060610] font-semibold shadow-sm"
                          : "text-white/70 hover:bg-white/[0.05] hover:text-[#f0ede8]"
                      }`}
                    >
                      <item.icon size={15} className={active ? "text-[#060610]" : "text-white/50"} />
                      <span>{item.label}</span>
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
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={15} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── TOP HEADER NAVBAR ─────────────────────────────────── */}
      <header className="fixed top-0 right-0 left-0 lg:left-[240px] z-20 h-16 bg-white border-b border-black/10">
        <div className="flex items-center justify-between h-full px-6">
          {/* Left Menu Trigger & Search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded hover:bg-black/5"
            >
              <Menu size={20} className="text-luxury-charcoal" />
            </button>

            <div className="hidden sm:flex items-center gap-2 w-80 h-9 bg-luxury-sand/50 border border-black/10 px-3">
              <Search size={14} className="text-luxury-gray shrink-0" />
              <input
                type="text"
                placeholder="Recherche globale (articles, clients, wilayas)..."
                className="bg-transparent text-xs outline-none w-full text-luxury-charcoal placeholder:text-luxury-gray"
              />
            </div>
          </div>

          {/* Right Status Badges & Admin Profile */}
          <div className="flex items-center gap-4">
            {/* Algerian Flag Pill & Currency */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-luxury-sand text-xs font-semibold text-luxury-charcoal border border-black/5">
              <span>🇩🇿</span>
              <span>Boutique Algérie (DZD)</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 rounded hover:bg-black/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8c6d32] flex items-center justify-center text-[#060610] font-bold text-xs">
                  AP
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-luxury-charcoal">Anis Phone Admin</div>
                  <div className="text-[10px] text-luxury-gray">Direction Showroom</div>
                </div>
                <ChevronDown size={13} className="text-luxury-gray" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 z-20 w-52 bg-white border border-black/10 shadow-xl py-1 rounded-none">
                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-luxury-charcoal hover:bg-black/5"
                    >
                      <Settings size={14} />
                      Paramètres de la boutique
                    </Link>
                    <Link
                      href="/admin/help"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-luxury-charcoal hover:bg-black/5"
                    >
                      <HelpCircle size={14} />
                      Guide opérationnel
                    </Link>
                    <div className="border-t border-black/5 my-1" />
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={14} />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN VIEWPORT CONTENT ─────────────────────────────── */}
      <main className="lg:ml-[240px] mt-16 p-6 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}
