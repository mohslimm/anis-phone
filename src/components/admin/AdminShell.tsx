"use client";

import { useState } from "react";
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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navSections = [
  {
    label: "PRINCIPAL",
    items: [
      { label: "Dashboard",  icon: LayoutDashboard, path: "/admin/dashboard" },
      { label: "Produits",   icon: Package,         path: "/admin/products" },
      { label: "Stock",      icon: Warehouse,        path: "/admin/stock" },
      { label: "Commandes",  icon: ShoppingCart,     path: "/admin/orders" },
      { label: "Clients",    icon: Users,            path: "/admin/clients" },
    ],
  },
  {
    label: "GESTION",
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

  const isActive = (path: string) => pathname.startsWith(path);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-[220px] bg-white border-r border-[#e9e9e9] transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 h-14 px-4 border-b border-[#e9e9e9]">
          <div className="w-8 h-8 rounded-full bg-[#f7bf33] flex items-center justify-center shrink-0">
            <Smartphone size={15} className="text-[#1a1a1a]" />
          </div>
          <span className="font-semibold text-[15px] text-[#1a1a1a] tracking-[1.5px]">
            ANIS PHONE
          </span>
        </div>

        {/* Store Pill */}
        <div className="px-3 pt-4 pb-2">
          <div className="w-full flex items-center justify-between h-10 px-3 rounded-[10px] bg-[#f3f4f6] border border-[#e9e9e9]">
            <div>
              <div className="text-[13px] font-medium text-[#1a1a1a]">anis.phone</div>
              <div className="text-[11px] text-[#9eaab7]">Boutique principale</div>
            </div>
            <ChevronDown size={14} className="text-[#9eaab7]" />
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 pt-2 pb-4 space-y-4 overflow-y-auto h-[calc(100%-120px)]">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="px-3 mb-2 text-[10px] font-semibold text-[#9eaab7] uppercase tracking-[1px]">
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
                      className={`flex items-center gap-2.5 h-10 px-3 rounded-[10px] text-[13px] font-medium transition-colors ${
                        active
                          ? "bg-[#f7bf33] text-[#1a1a1a]"
                          : "text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#1a1a1a]"
                      }`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── TOP NAVBAR ──────────────────────────────────────────── */}
      <header className="fixed top-0 right-0 left-0 lg:left-[220px] z-20 h-14 bg-white border-b border-[#e9e9e9]">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#f3f4f6] transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:flex items-center gap-2 w-72 h-9 rounded-[10px] bg-[#f3f4f6] border border-[#e9e9e9] px-3 transition-colors focus-within:border-[#f7bf33]">
              <Search size={15} className="text-[#9eaab7] shrink-0" />
              <input
                type="text"
                placeholder="Rechercher produits, commandes..."
                className="bg-transparent text-[13px] outline-none w-full placeholder:text-[#9eaab7] text-[#1a1a1a]"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-[#f3f4f6] transition-colors">
              <Bell size={18} className="text-[#6b7280]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-[#f3f4f6] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f7bf33] to-[#e5a800] flex items-center justify-center text-[#1a1a1a] font-bold text-[13px]">
                  A
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-[13px] font-medium text-[#1a1a1a]">Administrateur</div>
                  <div className="text-[11px] text-[#9eaab7]">Super Admin</div>
                </div>
                <ChevronDown size={14} className="text-[#9eaab7]" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 z-20 w-48 bg-white rounded-xl border border-[#e9e9e9] shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1">
                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#1a1a1a] hover:bg-[#f3f4f6]"
                    >
                      <Settings size={14} />
                      Paramètres
                    </Link>
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] text-[#ef4444] hover:bg-[#f3f4f6]"
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

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main className="lg:ml-[220px] mt-14 p-4 lg:p-6 min-h-[calc(100vh-56px)]">
        {children}
      </main>
    </div>
  );
}
