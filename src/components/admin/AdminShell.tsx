"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  Settings,
  Search,
  Bell,
  Smartphone,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const navSections = [
  {
    label: "Principal",
    items: [
      { label: "Dashboard",  icon: LayoutDashboard, path: "/admin/dashboard" },
      { label: "Produits",   icon: Package,         path: "/admin/products" },
      { label: "Stock",      icon: Warehouse,        path: "/admin/stock" },
      { label: "Commandes",  icon: ShoppingCart,     path: "/admin/orders" },
      { label: "Clients",    icon: Users,            path: "/admin/clients" },
    ],
  },
  {
    label: "Gestion",
    items: [
      { label: "Paramètres", icon: Settings, path: "/admin/settings" },
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

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans selection:bg-[#f7bf33]/30">

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[240px] bg-white border-r border-slate-200/60 transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 h-[70px] px-6 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] flex items-center justify-center shrink-0 shadow-lg shadow-black/5">
            <Smartphone size={18} className="text-[#f7bf33]" />
          </div>
          <div className="flex flex-col">
            <span className="font-outfit font-black text-[13px] text-[#1a1a1a] tracking-[2px] uppercase leading-none">
              ANIS PHONE
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Admin Suite
            </span>
          </div>
        </div>

        {/* Global Action */}
        <div className="px-4 pt-6 pb-2">
           <Link 
            href="/" 
            target="_blank"
            className="flex items-center justify-between w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-white hover:border-[#f7bf33]/30 hover:text-[#1a1a1a] transition-all group"
           >
             <div className="flex items-center gap-2.5">
                <Globe size={14} className="group-hover:text-[#f7bf33] transition-colors" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Voir la boutique</span>
             </div>
             <ChevronDown size={12} className="opacity-40" />
           </Link>
        </div>

        {/* Nav Sections */}
        <nav className="px-4 py-6 space-y-8 overflow-y-auto flex-1">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-2">
              <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">
                {section.label}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`group relative flex items-center gap-3 h-11 px-4 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                        active
                          ? "bg-[#1a1a1a] text-white shadow-xl shadow-black/10"
                          : "text-slate-500 hover:bg-slate-50 hover:text-[#1a1a1a]"
                      }`}
                    >
                      <item.icon size={18} className={active ? "text-[#f7bf33]" : "group-hover:text-[#1a1a1a] transition-colors"} />
                      {item.label}
                      {active && (
                        <motion.div 
                          layoutId="active-pill"
                          className="absolute right-2 w-1 h-4 rounded-full bg-[#f7bf33]"
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

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-50 mt-auto">
           <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full h-12 px-4 rounded-xl text-red-500 hover:bg-red-50 transition-all text-[11px] font-black uppercase tracking-[0.15em] group"
           >
             <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
             DÉCONNEXION
           </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── HEADER ────────────────────────────────────────────── */}
      <header 
        className={`fixed top-0 right-0 left-0 lg:left-[240px] z-30 h-[70px] transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-full px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="hidden sm:flex items-center gap-3 w-80 h-11 rounded-xl bg-white border border-slate-200/60 px-4 transition-all focus-within:border-[#f7bf33]/50 focus-within:ring-4 focus-within:ring-[#f7bf33]/5 shadow-sm">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent text-[13px] outline-none w-full placeholder:text-slate-400 font-medium text-[#1a1a1a]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-xl bg-white border border-slate-200/60 text-slate-500 hover:bg-slate-50 transition-all shadow-sm group">
              <Bell size={20} className="group-hover:scale-110 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#f7bf33] rounded-full border-2 border-white shadow-sm" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 p-1.5 pl-3 rounded-xl bg-white border border-slate-200/60 hover:bg-slate-50 transition-all shadow-sm"
              >
                <div className="hidden md:block text-right">
                  <p className="text-[12px] font-bold text-[#1a1a1a] leading-tight">Admin</p>
                  <p className="text-[10px] text-slate-400 font-medium">Anis Phone</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#f7bf33] to-[#e5a800] flex items-center justify-center text-[#1a1a1a] font-black text-sm shadow-inner">
                  A
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-10" 
                      onClick={() => setProfileOpen(false)} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-14 z-20 w-56 bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-black/10 py-2 p-2"
                    >
                      <Link
                        href="/admin/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1a1a1a] rounded-xl transition-all"
                      >
                        <Settings size={16} />
                        Paramètres Profil
                      </Link>
                      <div className="h-px bg-slate-50 my-1 mx-2" />
                      <button
                        onClick={() => { setProfileOpen(false); handleLogout(); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <LogOut size={16} />
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

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main className="lg:ml-[240px] pt-[70px] min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-6 lg:p-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

