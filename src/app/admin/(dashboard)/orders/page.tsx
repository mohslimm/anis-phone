"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { 
  Search, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  XCircle, 
  Loader2, 
  Phone, 
  Printer, 
  MapPin, 
  User,
  ShoppingBag,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DataService, Order, OrderStatus } from "@/lib/data-service";
import { formatPrice } from "@/lib/format";

function StatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          En attente
        </span>
      );
    case "confirmed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
          <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
          Confirmée
        </span>
      );
    case "shipped":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
          <Truck className="w-3.5 h-3.5 text-indigo-500" />
          Expédiée
        </span>
      );
    case "delivered":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <Package className="w-3.5 h-3.5 text-emerald-500" />
          Livrée &bull; Encaissée
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
          <XCircle className="w-3.5 h-3.5 text-red-500" />
          Annulée
        </span>
      );
    default:
      return <span>{status}</span>;
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await DataService.getOrders();
      setOrders(data);
    } catch (e) {
      console.error("Error fetching orders:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      await DataService.updateOrderStatus(orderId, newStatus);
      setOrders(current =>
        current.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (e) {
      console.error("Error changing status:", e);
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const exportCSV = () => {
    const headers = "Numero,Date,Client,Telephone,Wilaya,Adresse,Total_DZD,Statut\n";
    const csvContent = filteredOrders.map(o => 
      `"${o.id}","${new Date(o.created_at).toLocaleString('fr-FR')}","${o.customer_name}","${o.phone}","${o.wilaya}","${(o.address || '').replace(/"/g, '""')}",${o.total_dzd},"${o.status}"`
    ).join("\n");

    const blob = new Blob([headers + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `commandes_anis_phone_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        o.id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.wilaya.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchTerm]);


  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-luxury-charcoal uppercase tracking-tight">
            Journal des Commandes
          </h1>
          <p className="text-xs text-luxury-gray mt-1 flex items-center gap-2">
            <ShoppingBag size={14} className="text-[#c5a059]" />
            {orders.length} commandes enregistrées &bull; Expéditions 58 Wilayas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={exportCSV}
            variant="outline"
            className="rounded-xl border-slate-200 text-xs font-semibold hover:bg-slate-50 gap-2 h-10"
          >
            <Download className="w-4 h-4 text-luxury-gray" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "Toutes", count: orders.length },
          { key: "pending", label: "En attente", count: orders.filter(o => o.status === "pending").length },
          { key: "confirmed", label: "Confirmées", count: orders.filter(o => o.status === "confirmed").length },
          { key: "shipped", label: "Expédiées", count: orders.filter(o => o.status === "shipped").length },
          { key: "delivered", label: "Livrées", count: orders.filter(o => o.status === "delivered").length },
          { key: "cancelled", label: "Annulées", count: orders.filter(o => o.status === "cancelled").length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
              statusFilter === tab.key
                ? "bg-[#0a0a14] text-white border-[#0a0a14] shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {tab.label} <span className="opacity-60 ml-1">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-slate-100">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Rechercher par numéro, nom, téléphone, wilaya..."
              className="pl-10 bg-slate-50 border-slate-200 text-xs focus:bg-white transition-all rounded-xl h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-6">N° Commande</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date &amp; Heure</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Client &amp; Contact</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Destination</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Net</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Statut</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#c5a059] mb-2" />
                    <p className="text-xs text-slate-400 font-medium">Chargement des commandes en cours...</p>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <TableRow key={order.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6 py-4 font-mono font-bold text-sm text-slate-900">
                      #{order.id.slice(0, 8)}
                    </TableCell>

                    <TableCell className="text-xs text-slate-500 font-medium">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold text-sm text-slate-900">{order.customer_name}</div>
                      <div className="text-xs text-slate-400 font-mono">{order.phone}</div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm font-semibold text-slate-800">{order.wilaya}</div>
                      {order.commune && <div className="text-xs text-slate-400">{order.commune}</div>}
                    </TableCell>

                    <TableCell className="font-mono font-bold text-sm text-slate-900">
                      {formatPrice(order.total_dzd)} DZD
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="h-8 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Gérer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-slate-400">
                    Aucune commande trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Management Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        {selectedOrder && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 bg-white border-slate-200 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-outfit font-bold text-slate-900 flex items-center gap-3">
                    <span>Commande #{selectedOrder.id}</span>
                    <StatusBadge status={selectedOrder.status} />
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <Calendar size={12} />
                    Passée le {new Date(selectedOrder.created_at).toLocaleString("fr-FR")}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="py-4 space-y-6">
              {/* Quick Actions / Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <User size={14} className="text-[#c5a059]" />
                    Informations Client
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{selectedOrder.customer_name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedOrder.phone}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <a
                      href={`tel:${selectedOrder.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      <Phone size={12} />
                      Appeler
                    </a>
                    <a
                      href={`https://wa.me/213${selectedOrder.phone.replace(/\D/g, "").replace(/^0/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/10 text-emerald-700 text-xs font-semibold hover:bg-emerald-600/20 transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <MapPin size={14} className="text-[#c5a059]" />
                    Adresse de Livraison (Algérie)
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">
                      Wilaya : {selectedOrder.wilaya} {selectedOrder.commune ? `(${selectedOrder.commune})` : ""}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {selectedOrder.address || "Adresse complète précisée par le client"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Update Banner */}
              <div className="p-4 rounded-2xl bg-[#0a0a14] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">
                    Statut Logistique
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5">
                    Modifiez le statut pour synchroniser le client et le livreur
                  </p>
                </div>

                <div className="w-full sm:w-56">
                  <Select
                    value={selectedOrder.status}
                    disabled={isUpdatingStatus}
                    onValueChange={(val) => val && handleStatusChange(selectedOrder.id, val as OrderStatus)}
                  >
                    <SelectTrigger className="h-10 rounded-xl bg-white/10 border-white/20 text-white font-semibold text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="shipped">Expédiée (En transit)</SelectItem>
                      <SelectItem value="delivered">Livrée &bull; Encaissée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Articles Commandés
                </div>
                <div className="divide-y divide-slate-100">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((it: any, idx: number) => (
                      <div key={idx} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                            {it.image ? (
                              <Image src={it.image} alt={it.name || "Produit"} width={40} height={40} className="object-contain" />
                            ) : (
                              <ShoppingBag size={18} className="text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{it.name}</p>
                            {it.variantLabel && (
                              <p className="text-xs text-slate-400">Variante : {it.variantLabel}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-mono font-bold text-sm text-slate-900">
                            {formatPrice(it.price * (it.qty || 1))} DZD
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatPrice(it.price)} &times; {it.qty || 1}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-xs text-slate-400 text-center">
                      Détails de composition standard
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center font-bold text-sm">
                  <span className="text-slate-700">Total Net TTC</span>
                  <span className="font-mono text-lg text-slate-900">{formatPrice(selectedOrder.total_dzd)} DZD</span>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-slate-100 pt-4 flex sm:justify-between items-center">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="rounded-xl border-slate-200 text-xs font-semibold gap-2"
              >
                <Printer size={14} />
                Imprimer Bon de Commande
              </Button>
              <Button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-[#0a0a14] text-white text-xs font-semibold"
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
