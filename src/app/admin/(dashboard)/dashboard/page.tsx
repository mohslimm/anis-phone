import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Users,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { SalesChart } from "@/components/admin/dashboard/sales-chart";

const statusMap: Record<string, { label: string; className: string }> = {
  pending:   { label: "En attente",  className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmée",   className: "bg-blue-100 text-blue-700" },
  shipped:   { label: "Expédiée",    className: "bg-indigo-100 text-indigo-700" },
  delivered: { label: "Livrée",      className: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Annulée",     className: "bg-red-100 text-red-700" },
};

const categoryColors: Record<string, string> = {
  Smartphones: "#f7bf33",
  Tablettes:   "#8cc0ff",
  Laptops:     "#8b5cf6",
  Accessoires: "#22c55e",
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
    .limit(8);

  // ── Top Products ──────────────────────────────────────────────
  const { data: topProducts } = await supabase
    .from("products")
    .select("id, name, base_price, promo_price, condition, images, brands(name), categories(name)")
    .eq("is_featured", true)
    .limit(5);

  const kpis = [
    {
      title: "Chiffre d'affaires",
      value: `${formatPrice(totalRevenue)} DZD`,
      change: "+12.5%",
      icon: TrendingUp,
      accent: "#f7bf33",
    },
    {
      title: "Commandes en attente",
      value: String(pendingCount ?? 0),
      change: "Nécessite attention",
      icon: ShoppingCart,
      accent: "#8cc0ff",
    },
    {
      title: "Stock Faible",
      value: String(lowStockCount ?? 0),
      change: "< 5 unités",
      icon: AlertTriangle,
      accent: (lowStockCount ?? 0) > 0 ? "#ef4444" : "#22c55e",
    },
    {
      title: "Total Clients",
      value: String(customersCount ?? 0),
      change: "+4 cette semaine",
      icon: Users,
      accent: "#22c55e",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] leading-tight">Tableau de bord</h1>
        <p className="text-[13px] text-[#9eaab7] mt-1">
          Bienvenue ! Voici l&apos;état de votre boutique anis.phone.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="bg-white rounded-2xl border border-[#e9e9e9] p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${kpi.accent}22` }}
              >
                <kpi.icon size={18} style={{ color: kpi.accent }} />
              </div>
              <span className="text-[11px] text-[#6b7280] border border-[#e9e9e9] rounded-full px-3 py-1">
                Ce mois
              </span>
            </div>
            <div className="text-[28px] font-semibold text-[#1a1a1a] leading-tight">
              {kpi.value}
            </div>
            <div className="text-[12px] text-[#9eaab7] mt-0.5">{kpi.title}</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight size={14} style={{ color: kpi.accent }} />
              <span className="text-[12px] font-medium" style={{ color: kpi.accent }}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Sales Chart (3/5) */}
        <div className="lg:col-span-3">
          <SalesChart />
        </div>

        {/* Category Performance (2/5) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e9e9e9] p-5">
          <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-4">
            Performance Catégories
          </h3>
          <div className="space-y-0">
            {Object.entries(categoryColors).map(([name, color]) => (
              <div
                key={name}
                className="flex items-center gap-3 py-3.5 border-b border-[#f0f0f0] last:border-0"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}22` }}
                >
                  <Package size={15} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#1a1a1a]">{name}</div>
                </div>
                <div
                  className="w-16 h-1.5 rounded-full overflow-hidden bg-[#f0f0f0]"
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: "60%", backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Orders + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Latest Orders (2/3) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#e9e9e9] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1a1a1a]">Dernières commandes</h3>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-[12px] text-[#f7bf33] font-medium hover:underline"
            >
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#faf9f7] rounded-lg">
                  {["Commande", "Wilaya", "Date", "Montant", "Statut"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-semibold text-[#9eaab7] uppercase tracking-[0.5px] px-4 py-2.5 first:rounded-l-lg last:rounded-r-lg"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {latestOrders && latestOrders.length > 0 ? (
                  latestOrders.map((order) => {
                    const st = statusMap[order.status] ?? { label: order.status, className: "bg-gray-100 text-gray-700" };
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#faf9f7] transition-colors"
                      >
                        <td className="px-4 py-3 text-[13px] font-mono font-medium text-[#1a1a1a]">
                          #{order.id.split("-")[0].toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#6b7280]">{order.wilaya}</td>
                        <td className="px-4 py-3 text-[13px] text-[#6b7280]">
                          {new Date(order.created_at).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-4 py-3 text-[13px] font-semibold text-[#1a1a1a]">
                          {formatPrice(order.total_dzd)} DZD
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${st.className}`}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[13px] text-[#9eaab7]">
                      Aucune commande pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products (1/3) */}
        <div className="xl:col-span-1 bg-white rounded-2xl border border-[#e9e9e9] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#1a1a1a]">Produits vedettes</h3>
            <Link
              href="/admin/products"
              className="flex items-center gap-1 text-[12px] text-[#f7bf33] font-medium hover:underline"
            >
              Tout voir <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-0">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((p) => {
                const img = (p.images as string[])?.[0];
                const brand = (p.brands as any)?.name ?? "–";
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 py-3 border-b border-[#f0f0f0] last:border-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] border border-[#e9e9e9] overflow-hidden shrink-0 flex items-center justify-center">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={18} className="text-[#9eaab7]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#1a1a1a] truncate">{p.name}</div>
                      <div className="text-[11px] text-[#9eaab7]">{brand}</div>
                    </div>
                    <div className="text-[13px] font-semibold text-[#1a1a1a] whitespace-nowrap">
                      {formatPrice(p.promo_price ?? p.base_price)}
                      <span className="text-[11px] font-normal text-[#9eaab7] ml-0.5">DZD</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-[13px] text-[#9eaab7]">
                Aucun produit vedette.<br />
                <Link href="/admin/products" className="text-[#f7bf33] underline mt-1 inline-block">
                  Ajouter des produits
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
