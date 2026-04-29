import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Users,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { SalesChart } from "@/components/admin/dashboard/sales-chart";
import { KPICard } from "@/components/admin/dashboard/kpi-card";

const statusMap: Record<string, { label: string; className: string }> = {
  pending:   { label: "En attente",  className: "bg-amber-50 text-amber-600 border-amber-100" },
  confirmed: { label: "Confirmée",   className: "bg-blue-50 text-blue-600 border-blue-100" },
  shipped:   { label: "Expédiée",    className: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  delivered: { label: "Livrée",      className: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  cancelled: { label: "Annulée",     className: "bg-red-50 text-red-600 border-red-100" },
};

const categoryColors: Record<string, string> = {
  Smartphones: "#f7bf33",
  Tablettes:   "#3b82f6",
  Laptops:     "#8b5cf6",
  Accessoires: "#10b981",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // ── KPI Queries ──────────────────────────────────────────────
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_dzd")
    .eq("status", "delivered");
  const totalRevenue = revenueData?.reduce((s, o) => s + (o.total_dzd || 0), 0) ?? 0;

  const { count: pendingCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: lowStockCount } = await supabase
    .from("variants")
    .select("*", { count: "exact", head: true })
    .lt("stock_qty", 5);

  const { count: customersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");

  // ── Latest Orders ─────────────────────────────────────────────
  const { data: latestOrders } = await supabase
    .from("orders")
    .select("id, total_dzd, status, wilaya, created_at, phone")
    .order("created_at", { ascending: false })
    .limit(6);

  // ── Top Products ──────────────────────────────────────────────
  const { data: topProducts } = await supabase
    .from("products")
    .select("id, name, base_price, promo_price, condition, images, brands(name), categories(name)")
    .eq("is_featured", true)
    .limit(5);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-outfit font-black text-[#1a1a1a] tracking-tight leading-none uppercase">
            Vue d'ensemble
          </h1>
          <p className="text-[13px] font-medium text-slate-400 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Système opérationnel • {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
            <button className="h-11 px-6 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-colors">
                Rapports
            </button>
            <Link href="/admin/products">
                <button className="h-11 px-6 rounded-xl bg-[#1a1a1a] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-black/10">
                    Ajouter Produit
                </button>
            </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard 
          title="Chiffre d'affaires"
          value={`${formatPrice(totalRevenue)} DZD`}
          change="+12.5% vs mois dernier"
          iconName="trending"
          accent="#f7bf33"
          delay={0.1}
        />
        <KPICard 
          title="Commandes en attente"
          value={String(pendingCount ?? 0)}
          change="Nécessite votre attention"
          iconName="cart"
          accent="#3b82f6"
          delay={0.2}
        />
        <KPICard 
          title="Stock Faible"
          value={String(lowStockCount ?? 0)}
          change={(lowStockCount ?? 0) > 0 ? "Réapprovisionnement requis" : "Stock optimisé"}
          iconName="alert"
          accent={(lowStockCount ?? 0) > 0 ? "#ef4444" : "#10b981"}
          delay={0.3}
        />
        <KPICard 
          title="Total Clients"
          value={String(customersCount ?? 0)}
          change="+4 nouveaux cette semaine"
          iconName="users"
          accent="#10b981"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-[#1a1a1a]">Flux de Trésorerie</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Analyse des ventes sur les 30 derniers jours</p>
                </div>
                <select className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-500 outline-none">
                    <option>Mensuel</option>
                    <option>Hebdomadaire</option>
                </select>
            </div>
            <div className="h-[350px]">
                <SalesChart />
            </div>
          </div>

          {/* Latest Orders */}
          <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Commandes Récentes</h3>
              <Link
                href="/admin/orders"
                className="text-[11px] font-bold text-[#f7bf33] uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Journal complet <ChevronRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto -mx-8 px-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    {["ID", "Wilaya", "Date", "Montant", "Statut"].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] px-4 py-4 first:rounded-l-xl last:rounded-r-xl"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {latestOrders && latestOrders.length > 0 ? (
                    latestOrders.map((order) => {
                      const st = statusMap[order.status] ?? { label: order.status, className: "bg-gray-50 text-gray-500 border-gray-100" };
                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-4 py-5 text-[12px] font-mono font-bold text-[#1a1a1a]">
                            #{order.id.split("-")[0].toUpperCase()}
                          </td>
                          <td className="px-4 py-5 text-[12px] font-medium text-slate-500">{order.wilaya}</td>
                          <td className="px-4 py-5 text-[12px] text-slate-400">
                            {new Date(order.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-4 py-5 text-[13px] font-black text-[#1a1a1a]">
                            {formatPrice(order.total_dzd)} DZD
                          </td>
                          <td className="px-4 py-5">
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${st.className}`}>
                              {st.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400 font-medium">
                        Aucune activité récente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
          {/* Category Performance */}
          <div className="bg-[#1a1a1a] rounded-[2rem] p-8 text-white shadow-xl shadow-black/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <TrendingUp size={100} />
            </div>
            <h3 className="text-lg font-bold mb-8 relative z-10">Ventes par Catégorie</h3>
            <div className="space-y-6 relative z-10">
              {Object.entries(categoryColors).map(([name, color]) => (
                <div key={name} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                    <span className="text-white/60">{name}</span>
                    <span>{Math.floor(Math.random() * 40 + 20)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.floor(Math.random() * 40 + 20)}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Best-Sellers</h3>
              <Link href="/admin/products" className="text-slate-400 hover:text-[#1a1a1a] transition-colors">
                <ChevronRight size={20} />
              </Link>
            </div>

            <div className="space-y-6">
              {topProducts && topProducts.length > 0 ? (
                topProducts.map((p) => {
                  const img = (p.images as string[])?.[0];
                  const brand = (p.brands as any)?.name ?? "–";
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-[#1a1a1a] truncate group-hover:text-[#f7bf33] transition-colors">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{brand}</div>
                      </div>
                      <div className="text-[13px] font-black text-[#1a1a1a] whitespace-nowrap">
                        {formatPrice(p.promo_price ?? p.base_price)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-sm text-slate-400">
                  Aucun produit vedette.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
