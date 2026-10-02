"use client";

import { useState, useEffect, useMemo } from "react";
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
  MessageSquare,
  FileSpreadsheet
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
import { Label } from "@/components/ui/label";
import { DataService, Order, OrderStatus } from "@/lib/data-service";
import { formatPrice } from "@/lib/format";

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

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            En attente
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            Confirmée
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Truck className="w-3.5 h-3.5 text-indigo-600" />
            Expédiée
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            Livrée & Encaissée
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-medium bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Annulée
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit">
            Gestion des Commandes
          </h1>
          <p className="text-[13px] text-luxury-gray">
            Suivi des expéditions 58 Wilayas et encaissements à la livraison.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-black/10 text-luxury-charcoal hover:bg-black/5 rounded-none"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Quick Summary Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "Toutes les commandes", count: orders.length },
          { key: "pending", label: "En attente", count: orders.filter(o => o.status === "pending").length },
          { key: "confirmed", label: "Confirmées", count: orders.filter(o => o.status === "confirmed").length },
          { key: "shipped", label: "Expédiées", count: orders.filter(o => o.status === "shipped").length },
          { key: "delivered", label: "Livrées", count: orders.filter(o => o.status === "delivered").length },
          { key: "cancelled", label: "Annulées", count: orders.filter(o => o.status === "cancelled").length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-none border transition-all ${
              statusFilter === tab.key
                ? "bg-luxury-charcoal text-white border-luxury-charcoal shadow-sm"
                : "bg-white text-luxury-gray border-black/10 hover:border-black/30"
            }`}
          >
            {tab.label} <span className="opacity-60 ml-1">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <Card className="rounded-none border-black/10 shadow-sm bg-white overflow-hidden">
        <CardHeader className="py-4 border-b border-black/5">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-luxury-gray" />
            <Input
              type="search"
              placeholder="Rechercher par numéro, nom, téléphone, wilaya..."
              className="pl-9 bg-[#f9fafb] border-black/10 text-sm focus:bg-white transition-all rounded-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#fafafa]">
              <TableRow className="border-b border-black/5 hover:bg-transparent">
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider pl-6">N° Commande</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Date & Heure</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Client & Contact</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Destination</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Montant Net</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Statut</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#c5a059] mb-2" />
                    <p className="text-xs text-luxury-gray">Chargement du journal des commandes...</p>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <TableRow key={order.id} className="border-b border-black/5 hover:bg-black/[0.015] transition-colors">
                    <TableCell className="pl-6 py-4 font-mono font-semibold text-sm text-luxury-charcoal">
                      #{order.id}
                    </TableCell>

                    <TableCell className="text-xs text-luxury-gray">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-sm text-luxury-charcoal">{order.customer_name}</div>
                      <div className="text-xs text-luxury-gray font-mono">{order.phone}</div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm font-medium text-luxury-charcoal">{order.wilaya}</div>
                      {order.commune && <div className="text-xs text-luxury-gray">{order.commune}</div>}
                    </TableCell>

                    <TableCell className="font-mono font-bold text-sm text-luxury-charcoal">
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
                        className="h-8 px-3 rounded-none text-xs font-medium text-luxury-charcoal bg-black/5 hover:bg-black/10"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Gérer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-luxury-gray">
                    Aucune commande trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Détails & Traitement Commande */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto rounded-none border-black/10 p-6">
            <DialogHeader className="border-b border-black/5 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <DialogTitle className="text-xl font-outfit font-bold text-luxury-charcoal">
                    Commande #{selectedOrder.id}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-luxury-gray mt-0.5">
                    Enregistrée le {new Date(selectedOrder.created_at).toLocaleString("fr-FR")}
                  </DialogDescription>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Coordonnées Client & Expédition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-luxury-sand/50 border border-black/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gray">Destinataire</span>
                  <p className="text-base font-semibold text-luxury-charcoal mt-1">{selectedOrder.customer_name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href={`tel:${selectedOrder.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-black/10 text-xs font-medium text-luxury-charcoal hover:bg-black hover:text-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {selectedOrder.phone}
                    </a>
                    <a
                      href={`https://wa.me/213${selectedOrder.phone.replace(/^0/, '').replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs hover:bg-emerald-100"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-luxury-sand/50 border border-black/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gray">Adresse de livraison</span>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-luxury-gray shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-luxury-charcoal">{selectedOrder.wilaya} {selectedOrder.commune ? `- ${selectedOrder.commune}` : ""}</p>
                      <p className="text-xs text-luxury-gray mt-0.5">{selectedOrder.address}</p>
                    </div>
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-2 text-xs italic text-luxury-gray border-t border-black/5 pt-1.5">
                      Note : &laquo; {selectedOrder.notes} &raquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Changement de statut */}
              <div className="p-4 border border-black/10 bg-white space-y-3">
                <Label className="text-xs font-semibold text-luxury-charcoal uppercase tracking-wider">
                  Mettre à jour l&apos;état de traitement
                </Label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { key: "pending", label: "1. En attente", color: "hover:border-amber-400" },
                    { key: "confirmed", label: "2. Confirmée par tél.", color: "hover:border-blue-400" },
                    { key: "shipped", label: "3. Expédiée (Colis confié)", color: "hover:border-indigo-400" },
                    { key: "delivered", label: "4. Livrée & Encaissée", color: "hover:border-emerald-400" },
                    { key: "cancelled", label: "5. Annulée", color: "hover:border-red-400" },
                  ].map(st => (
                    <Button
                      key={st.key}
                      variant="outline"
                      size="sm"
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange(selectedOrder.id, st.key as OrderStatus)}
                      className={`text-xs rounded-none transition-all ${
                        selectedOrder.status === st.key
                          ? "bg-luxury-charcoal text-white border-luxury-charcoal"
                          : `bg-white text-luxury-gray border-black/10 ${st.color}`
                      }`}
                    >
                      {st.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Articles commandés */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal mb-3">
                  Articles dans le colis
                </h4>
                <div className="border border-black/10 divide-y divide-black/5">
                  {(selectedOrder.order_items || []).map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-luxury-sand border border-black/5 flex items-center justify-center overflow-hidden shrink-0">
                          {item.products?.image ? (
                            <img src={item.products.image} alt={item.products.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-luxury-gray" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-luxury-charcoal">{item.products?.name || "Smartphone"}</p>
                          <p className="text-xs text-luxury-gray">{item.variant_label || "Configuration Standard"}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-mono font-bold text-luxury-charcoal">
                          {formatPrice(item.unit_price_dzd * item.qty)} DZD
                        </p>
                        <p className="text-xs text-luxury-gray">
                          {item.qty} × {formatPrice(item.unit_price_dzd)} DZD
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Ligne Total */}
                  <div className="p-4 bg-[#faf9f7] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-luxury-gray">Mode de règlement :</span>
                      <p className="text-xs font-bold text-luxury-charcoal">Paiement à la livraison (Cash on Delivery)</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-luxury-gray">Total TTC à encaisser :</span>
                      <p className="text-xl font-mono font-black text-luxury-charcoal">
                        {formatPrice(selectedOrder.total_dzd)} DZD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-row justify-between border-t border-black/5 pt-4">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="rounded-none border-black/10 text-xs"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Imprimer le bon de livraison
              </Button>

              <Button
                onClick={() => setSelectedOrder(null)}
                className="bg-luxury-charcoal text-white hover:bg-black rounded-none text-xs"
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
