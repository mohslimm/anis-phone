"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Clock,
  FileText,
  DollarSign,
  Loader2,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { DataService, Order, Product, AnalyticsSummary } from "@/lib/data-service";
import { SalesChart } from "@/components/admin/dashboard/sales-chart";

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
  confirmed: { label: "Confirmée", className: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  shipped: { label: "Expédiée", className: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" },
  delivered: { label: "Livrée", className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  cancelled: { label: "Annulée", className: "bg-red-500/10 text-red-400 border border-red-500/20" },
};

const categoryColors: Record<string, string> = {
  Smartphones: "#c5a059",
  Occasions: "#e8c77a",
  Tablettes: "#38bdf8",
  Laptops: "#a78bfa",
  Packs: "#34d399",
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [latestOrders, setLatestOrders] = useState<Order[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const [stats, orders, prods] = await Promise.all([
          DataService.getAnalyticsSummary(),
          DataService.getOrders(),
          DataService.getProducts({ isFeatured: true, limit: 5 }),
        ]);
        setAnalytics(stats);
        setLatestOrders(orders.slice(0, 6));
        setFeaturedProducts(prods);
      } catch (e) {
        console.error("Dashboard error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#c5a059] mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#f0ede8]/50 font-mono">Chargement du tableau de bord...</p>
      </div>
    );
  }

  const kpis = [
    {
      title: "Chiffre d'Affaires Brut",
      value: `${formatPrice(analytics.totalRevenue)} DZD`,
      sub: "Total des commandes enregistrées",
      icon: DollarSign,
      accent: "#c5a059",
      href: "/admin/revenue",
    },
    {
      title: "Commandes en Attente",
      value: String(analytics.pendingOrdersCount),
      sub: "À confirmer vocalement",
      icon: Clock,
      accent: "#f59e0b",
      href: "/admin/orders",
    },
    {
      title: "Stock Critique",
      value: String(analytics.lowStockCount),
      sub: analytics.lowStockCount > 0 ? "Articles < 5 unités" : "Stock optimal",
      icon: AlertTriangle,
      accent: analytics.lowStockCount > 0 ? "#ef4444" : "#10b981",
      href: "/admin/stock",
    },
    {
      title: "Total Clients CRM",
      value: String(analytics.totalCustomersCount),
      sub: "Base acheteurs 58 Wilayas",
      icon: Users,
      accent: "#38bdf8",
      href: "/admin/customers",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
            Console de Direction
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#f0ede8]">Tableau de Bord</h1>
          <p className="text-xs text-[#f0ede8]/60 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Boutique en ligne active & connectée • 58 Wilayas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#f0ede8] border border-white/10 text-xs font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Exporter Rapports
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#e8c77a] text-black font-semibold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouveau Produit
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.title}
            href={kpi.href}
            className="bg-[#0f0f20] border border-white/10 p-5 rounded-2xl hover:border-[#c5a059]/40 hover:shadow-lg transition-all block group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5"
                style={{ backgroundColor: `${kpi.accent}15` }}
              >
                <kpi.icon size={18} style={{ color: kpi.accent }} />
              </div>
              <ArrowUpRight size={15} className="text-[#f0ede8]/30 group-hover:text-[#c5a059] transition-colors" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#f0ede8] leading-tight">
              {kpi.value}
            </div>
            <div className="text-xs font-semibold text-[#f0ede8] mt-1">{kpi.title}</div>
            <div className="text-[11px] text-[#f0ede8]/50 mt-0.5">{kpi.sub}</div>
          </Link>
        ))}
      </div>

      {/* Chart + Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Chart (7/12) */}
        <div className="lg:col-span-7 bg-[#0f0f20] border border-white/10 rounded-2xl p-6">
          <SalesChart />
        </div>

        {/* Category Performance (5/12) */}
        <div className="lg:col-span-5 bg-[#0f0f20] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-[#f0ede8] font-serif">
                  Répartition par Gamme
                </h3>
                <p className="text-xs text-[#f0ede8]/50 mt-0.5">Part de ventes estimée du showroom</p>
              </div>
              <Link href="/admin/revenue" className="text-xs text-[#c5a059] hover:underline font-mono">
                Détails →
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { name: "Smartphones Scellés", percentage: 55, color: categoryColors.Smartphones, amount: "3,850,000 DZD" },
                { name: "Occasions Héritage A+", percentage: 22, color: categoryColors.Occasions, amount: "1,540,000 DZD" },
                { name: "Tablettes & iPad Pro", percentage: 12, color: categoryColors.Tablettes, amount: "840,000 DZD" },
                { name: "Laptops & MacBooks", percentage: 8, color: categoryColors.Laptops, amount: "560,000 DZD" },
                { name: "Packs Exclusifs", percentage: 3, color: categoryColors.Packs, amount: "210,000 DZD" },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#f0ede8] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="font-mono text-[#f0ede8]/70">
                      {cat.percentage}% ({cat.amount})
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs text-[#f0ede8]/50">
            <span>Matrice de distribution active</span>
            <span className="font-mono text-[#c5a059]">58 Wilayas</span>
          </div>
        </div>
      </div>

      {/* Recent Orders & Featured Best-Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table (8/12) */}
        <div className="lg:col-span-8 bg-[#0f0f20] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-[#f0ede8] font-serif">
                Dernières Commandes Enregistrées
              </h3>
              <p className="text-xs text-[#f0ede8]/50 mt-0.5">Flux en temps réel du site</p>
            </div>
            <Link href="/admin/orders" className="text-xs text-[#c5a059] hover:underline font-mono">
              Voir tout ({latestOrders.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-[#f0ede8]/40 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-medium">Réf</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Wilaya</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {latestOrders.slice(0, 5).map((order) => {
                  const s = statusMap[order.status] || { label: order.status, className: "bg-white/5 text-[#f0ede8]" };
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 font-mono text-[#e8c77a]">
                        <Link href="/admin/orders" className="hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-3.5 font-medium text-[#f0ede8]">
                        {order.customer_name}
                      </td>
                      <td className="py-3.5 text-[#f0ede8]/60">
                        {order.wilaya}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${s.className}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-right font-semibold text-[#f0ede8]">
                        {formatPrice(order.total_dzd)} DZD
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Featured Best-Sellers (4/12) */}
        <div className="lg:col-span-4 bg-[#0f0f20] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-[#f0ede8] font-serif">
                Articles Vedettes
              </h3>
              <p className="text-xs text-[#f0ede8]/50 mt-0.5">Haute rotation showroom</p>
            </div>
            <Link href="/admin/products" className="text-xs text-[#c5a059] hover:underline font-mono">
              Stock →
            </Link>
          </div>

          <div className="space-y-4">
            {featuredProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#14142a] border border-white/10 relative overflow-hidden shrink-0 flex items-center justify-center">
                    {p.images?.[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill className="object-contain p-1" />
                    ) : (
                      <Package className="w-4 h-4 text-[#f0ede8]/30" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-medium text-[#f0ede8] truncate">{p.name}</h4>
                    <p className="text-[10px] text-[#c5a059] font-mono">
                      Stock: {p.totalStock ?? 10} unités
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#e8c77a] shrink-0">
                  {formatPrice(p.promo_price ?? p.base_price)} DZD
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
