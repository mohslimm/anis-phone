"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Building2,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  PackageCheck,
  Truck,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataService } from "@/lib/data-service";
import { formatPrice } from "@/lib/format";

export default function RevenuePage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "year">("7d");
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await DataService.getAnalyticsSummary();
        setAnalytics(data);
      } catch (e) {
        console.error("Failed to load analytics:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#c5a059] mb-3" />
        <p className="text-xs uppercase tracking-widest text-luxury-gray">Calcul des métriques financières...</p>
      </div>
    );
  }

  const collectionRate = analytics.totalRevenue > 0
    ? Math.round((analytics.deliveredRevenue / analytics.totalRevenue) * 100)
    : 85;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit">
            Performance Financière & Revenus
          </h1>
          <p className="text-[13px] text-luxury-gray">
            Suivi des encaissements à la livraison (DZD), marge et volume d&apos;affaires.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 border border-black/10 bg-white p-1 rounded-none">
          {[
            { key: "7d", label: "7 jours" },
            { key: "30d", label: "30 jours" },
            { key: "90d", label: "Ce trimestre" },
            { key: "year", label: "Année 2026" },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key as any)}
              className={`px-3 py-1 text-xs font-medium rounded-none transition-colors ${
                period === p.key
                  ? "bg-luxury-charcoal text-white"
                  : "text-luxury-gray hover:text-luxury-charcoal"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-black/10 p-5 rounded-none shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-luxury-gray font-semibold">Chiffre d&apos;Affaires Brut</span>
            <div className="w-8 h-8 rounded-full bg-[#c5a059]/15 flex items-center justify-center text-[#c5a059]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-luxury-charcoal">
            {formatPrice(analytics.totalRevenue)} DZD
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.8% vs période précédente</span>
          </div>
        </div>

        <div className="bg-white border border-black/10 p-5 rounded-none shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-luxury-gray font-semibold">Encaissé à la Livraison</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {formatPrice(analytics.deliveredRevenue)} DZD
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-luxury-gray">
            <span>Taux de recouvrement : <strong>{collectionRate}%</strong></span>
          </div>
        </div>

        <div className="bg-white border border-black/10 p-5 rounded-none shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-luxury-gray font-semibold">Panier Moyen</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-luxury-charcoal">
            {formatPrice(analytics.averageOrderValue)} DZD
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-luxury-gray">
            <span>Segment haut de gamme</span>
          </div>
        </div>

        <div className="bg-white border border-black/10 p-5 rounded-none shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-luxury-gray font-semibold">En Cours de Transit</span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-800">
            {analytics.shippedOrdersCount + analytics.confirmedOrdersCount} Colis
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-indigo-600">
            <span>En cours de remise livreurs</span>
          </div>
        </div>
      </div>

      {/* Main Revenue Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Evolution (2/3) */}
        <div className="lg:col-span-2 bg-white border border-black/10 p-6 rounded-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-outfit font-semibold text-lg text-luxury-charcoal">
                Évolution des Ventes & Commandes
              </h3>
              <p className="text-xs text-luxury-gray">Revenus journaliers en Dinar Algérien</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-luxury-charcoal">
                <span className="w-3 h-3 bg-[#c5a059] inline-block"></span> Ventes (DZD)
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.salesByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip
                  formatter={(val: any) => [`${formatPrice(Number(val))} DZD`, "Ventes"]}
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "none", color: "#fff", borderRadius: 0, fontSize: 12 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#c5a059" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#goldGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown by Category (1/3) */}
        <div className="bg-white border border-black/10 p-6 rounded-none shadow-sm">
          <h3 className="font-outfit font-semibold text-lg text-luxury-charcoal mb-4">
            Répartition par Gamme
          </h3>
          <p className="text-xs text-luxury-gray mb-6">Part de chiffre d&apos;affaires généré</p>

          <div className="space-y-4">
            {analytics.categoryDistribution.map((cat: any) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-luxury-charcoal">{cat.name}</span>
                  <span className="font-mono text-luxury-gray">{cat.percentage}% ({formatPrice(cat.amount)} DZD)</span>
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

      {/* Wilayas Top Distribution Table */}
      <div className="bg-white border border-black/10 p-6 rounded-none shadow-sm">
        <h3 className="font-outfit font-semibold text-lg text-luxury-charcoal mb-2">
          Top Wilayas d&apos;Expédition
        </h3>
        <p className="text-xs text-luxury-gray mb-6">
          Concentration géographique des livraisons et des paiements reçus
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {analytics.wilayaDistribution.map((w: any) => (
            <div key={w.wilaya} className="p-4 bg-luxury-sand/50 border border-black/5 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal">{w.wilaya}</span>
              <p className="text-lg font-mono font-bold text-luxury-charcoal mt-2">{formatPrice(w.total)} DZD</p>
              <span className="text-[11px] text-luxury-gray">{w.count} colis expédiés</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
