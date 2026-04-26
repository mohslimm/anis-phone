"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  LayoutDashboard, 
  PackageSearch, 
  Layers, 
  Smartphone,
  LogOut
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navLinks = [
    { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/admin/products", label: "Catalogue", icon: Smartphone },
    { href: "/admin/stock", label: "Inventaire", icon: Layers },
    { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800">
        <PackageSearch className="w-6 h-6 mr-3 text-blue-400" />
        <span className="font-bold text-lg tracking-tight">anis.phone</span>
        <span className="ml-2 text-xs font-medium bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
