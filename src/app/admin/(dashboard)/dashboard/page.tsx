"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Users,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  PackageCheck,
  Truck,
  Clock,
  Sparkles,
  Layers,
  FileText,
  DollarSign,
  Loader2
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { DataService, Order, Product } from "@/lib/data-service";
import { SalesChart } from "@/components/admin/dashboard/sales-chart";

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmée", className: "bg-blue-100 text-blue-800" },
  shipped: { label: "Expédiée", className: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Livrée", className: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Annulée", className: "bg-red-100 text-red-800" },
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
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
        <p className="text-xs uppercase tracking-widest text-luxury-gray">Chargement du tableau de bord...</p>
      </div>
    );
  }

  const kpis = [
    {
      title: "Chiffre d'Affaires Brut",
      value: `${formatPrice(analytics.totalRevenue)} DZD`,
      sub: "Total des commandes actives",
      icon: TrendingUp,
      accent: "#c5a059",
      href: "/admin/revenue"
    },
    {
      title: "En Attente de Confirmation",
      value: String(analytics.pendingOrdersCount),
      sub: "Appels vocaux à effectuer",
      icon: Clock,
      accent: "#f59e0b",
      href: "/admin/orders"
    },
    {
      title: "Stock Faible ou Épuisé",
      value: String(analytics.lowStockCount),
      sub: "Articles sous le seuil critique",
      icon: AlertTriangle,
      accent: analytics.lowStockCount > 0 ? "#ef4444" : "#22c55e",
      href: "/admin/stock"
    },
    {
      title: "Total Clients Référencés",
      value: String(analytics.totalCustomersCount),
      sub: "Base acheteurs 58 Wilayas",
      icon: Users,
      accent: "#38bdf8",
      href: "/admin/customers"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit">
            Tableau de Bord
          </h1>
          <p className="text-[13px] text-luxury-gray mt-0.5">
            Bienvenue ! Vue d&apos;ensemble de l&apos;activité commerciale d&apos;Anis Phone.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <button className="px-3.5 py-2 text-xs font-semibold bg-luxury-charcoal text-white hover:bg-black transition-colors rounded-none">
              + Nouvel Appareil
            </button>
          </Link>
          <Link href="/admin/orders">
            <button className="px-3.5 py-2 text-xs font-semibold bg-white border border-black/10 text-luxury-charcoal hover:bg-black/5 transition-colors rounded-none">
              Traiter les Commandes
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.title}
            href={kpi.href}
            className="bg-white border border-black/10 p-5 rounded-none hover:shadow-md hover:border-black/25 transition-all block group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${kpi.accent}18` }}
              >
                <kpi.icon size={18} style={{ color: kpi.accent }} />
              </div>
              <ArrowUpRight size={15} className="text-luxury-gray group-hover:text-black transition-colors" />
            </div>
            <div className="text-2xl font-bold font-mono text-luxury-charcoal leading-tight">
              {kpi.value}
            </div>
            <div className="text-xs font-semibold text-luxury-charcoal mt-1">{kpi.title}</div>
            <div className="text-[11px] text-luxury-gray mt-0.5">{kpi.sub}</div>
          </Link>
        ))}
      </div>

      {/* Chart + Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sales Chart (3/5) */}
        <div className="lg:col-span-3">
          <SalesChart />
        </div>

        {/* Category Performance (2/5) */}
        <div className="lg:col-span-2 bg-white border border-black/10 p-5 rounded-none shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-luxury-charcoal font-outfit">
              Répartition par Famille
            </h3>
            <Link href="/admin/revenue" className="text-xs text-[#c5a059] font-medium hover:underline">
              Détails
            </Link>
          </div>
          <div className="space-y-4">
            {analytics.categoryDistribution.map((cat: any) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-luxury-charcoal">{cat.name}</span>
                  <span className="font-mono text-luxury-gray">{cat.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-luxury-sand overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500" 
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Orders + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Latest Orders (2/3) */}
        <div className="xl:col-span-2 bg-white border border-black/10 p-5 rounded-none shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-luxury-charcoal font-outfit">
              Dernières Commandes Reçues
            </h3>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs text-[#c5a059] font-medium hover:underline"
            >
              Consulter tout ({latestOrders.length}) <ChevronRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#fafafa]">
                  {["N° Commande", "Wilaya", "Client", "Total", "Statut"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-semibold text-luxury-gray uppercase tracking-[0.5px] px-4 py-2.5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {latestOrders.map((order) => {
                  const st = statusMap[order.status] ?? { label: order.status, className: "bg-gray-100 text-gray-700" };
                  return (
                    <tr key={order.id} className="hover:bg-black/[0.015] transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-luxury-charcoal">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3 text-luxury-gray">{order.wilaya}</td>
                      <td className="px-4 py-3 font-medium text-luxury-charcoal">{order.customer_name}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-luxury-charcoal">
                        {formatPrice(order.total_dzd)} DZD
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium ${st.className}`}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Featured Products (1/3) */}
        <div className="xl:col-span-1 bg-white border border-black/10 p-5 rounded-none shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-luxury-charcoal font-outfit">
              Sélection Prestige
            </h3>
            <Link
              href="/admin/products"
              className="flex items-center gap-1 text-xs text-[#c5a059] font-medium hover:underline"
            >
              Gérer <ChevronRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-black/5">
            {featuredProducts.map((p) => {
              const img = p.images?.[0];
              const brand = p.brand?.name ?? "–";
              return (
                <div key={p.id} className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 bg-luxury-sand border border-black/5 overflow-hidden shrink-0 flex items-center justify-center">
                    {img ? (
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={16} className="text-luxury-gray" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-luxury-charcoal truncate">{p.name}</div>
                    <div className="text-[10px] text-luxury-gray">{brand} • {p.condition === "new" ? "Neuf" : "Héritage"}</div>
                  </div>
                  <div className="text-xs font-mono font-bold text-luxury-charcoal whitespace-nowrap">
                    {formatPrice(p.promo_price ?? p.base_price)} DZD
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
