"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  Star, 
  Crown, 
  ArrowUpRight, 
  MessageSquare,
  Download,
  Calendar,
  Loader2
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
import { DataService, Customer, Order } from "@/lib/data-service";
import { formatPrice } from "@/lib/format";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const data = await DataService.getCustomers();
        setCustomers(data);
      } catch (e) {
        console.error("Failed to load customers:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const openCustomerDetails = async (customer: Customer) => {
    setSelectedCustomer(customer);
    try {
      const allOrders = await DataService.getOrders();
      const phoneClean = customer.phone.replace(/\s+/g, "");
      const matched = allOrders.filter(
        o => o.phone.replace(/\s+/g, "") === phoneClean || o.customer_name === customer.name
      );
      setCustomerOrders(matched);
    } catch (e) {
      console.error("Failed to load customer orders:", e);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.wilaya.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const exportCustomersCSV = () => {
    const headers = "Nom,Email,Telephone,Wilaya,Commandes,Total_Depense_DZD,Derniere_Commande,Statut\n";
    const csvContent = filteredCustomers.map(c =>
      `"${c.name}","${c.email}","${c.phone}","${c.wilaya}",${c.orders_count},${c.total_spent_dzd},"${c.last_order_date}","${c.status}"`
    ).join("\n");

    const blob = new Blob([headers + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clients_anis_phone_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const vipCount = customers.filter(c => c.status === "vip").length;
  const totalRevenueFromCustomers = customers.reduce((acc, c) => acc + c.total_spent_dzd, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit">
            Répertoire & Fidélité Clients (CRM)
          </h1>
          <p className="text-[13px] text-luxury-gray">
            Suivi des acheteurs récurrents, panier moyen et contacts directs.
          </p>
        </div>

        <Button
          onClick={exportCustomersCSV}
          variant="outline"
          className="border-black/10 text-luxury-charcoal hover:bg-black/5 rounded-none"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter Répertoire CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 p-5 rounded-none flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-luxury-gray font-semibold">Total Clients</span>
            <div className="text-2xl font-bold text-luxury-charcoal mt-1">{customers.length}</div>
            <span className="text-xs text-emerald-600 font-medium">Boutique & Commandes</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-luxury-charcoal">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-black/10 p-5 rounded-none flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Membres VIP Prestige</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{vipCount}</div>
            <span className="text-xs text-luxury-gray">&gt; 3 acquisitions</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-black/10 p-5 rounded-none flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-luxury-gray font-semibold">Volume d&apos;Achats Cumulé</span>
            <div className="text-2xl font-bold text-luxury-charcoal mt-1 font-mono">
              {formatPrice(totalRevenueFromCustomers)} DZD
            </div>
            <span className="text-xs text-luxury-gray">Panier moyen élevé</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#c5a059]/15 flex items-center justify-center text-[#c5a059]">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-none border-black/10 shadow-sm bg-white overflow-hidden">
        <CardHeader className="py-4 border-b border-black/5">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-luxury-gray" />
              <Input
                type="search"
                placeholder="Rechercher par nom, téléphone, wilaya..."
                className="pl-9 bg-[#f9fafb] border-black/10 text-sm focus:bg-white transition-all rounded-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-luxury-gray">Statut :</span>
              {["all", "vip", "active", "new"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 text-xs rounded-none border transition-colors ${
                    statusFilter === st
                      ? "bg-luxury-charcoal text-white border-luxury-charcoal"
                      : "bg-white text-luxury-gray border-black/10 hover:border-black/30"
                  }`}
                >
                  {st === "all" ? "Tous" : st === "vip" ? "VIP" : st === "active" ? "Actifs" : "Nouveaux"}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#fafafa]">
              <TableRow className="border-b border-black/5 hover:bg-transparent">
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider pl-6">Client</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Téléphone</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Wilaya</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider text-center">Commandes</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Total Dépensé</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Segment</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#c5a059] mb-2" />
                    <p className="text-xs text-luxury-gray">Chargement du répertoire client...</p>
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-b border-black/5 hover:bg-black/[0.015] transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-luxury-sand border border-black/5 flex items-center justify-center font-bold text-xs text-luxury-charcoal">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-luxury-charcoal">{customer.name}</div>
                          <div className="text-xs text-luxury-gray">{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-mono font-medium text-luxury-charcoal">
                      {customer.phone}
                    </TableCell>

                    <TableCell className="text-xs text-luxury-gray">
                      {customer.wilaya}
                    </TableCell>

                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/5 font-mono text-xs font-bold text-luxury-charcoal">
                        {customer.orders_count}
                      </span>
                    </TableCell>

                    <TableCell className="font-mono font-bold text-sm text-luxury-charcoal">
                      {formatPrice(customer.total_spent_dzd)} DZD
                    </TableCell>

                    <TableCell>
                      {customer.status === "vip" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                          <Crown className="w-3 h-3 text-amber-600" /> VIP Prestige
                        </span>
                      ) : customer.status === "active" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                          Fidèle
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Nouveau
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openCustomerDetails(customer)}
                        className="h-8 px-3 rounded-none text-xs font-medium bg-black/5 hover:bg-black/10 text-luxury-charcoal"
                      >
                        Fiche Client
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-luxury-gray">
                    Aucun client trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Fiche Client Détaillée */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-none border-black/10 p-6">
            <DialogHeader className="border-b border-black/5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-outfit font-bold text-luxury-charcoal flex items-center gap-2">
                    {selectedCustomer.name}
                    {selectedCustomer.status === "vip" && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-sans font-medium">
                        VIP
                      </span>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-luxury-gray mt-0.5">
                    Client enregistré • Wilaya : {selectedCustomer.wilaya}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Coordonnées */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-luxury-sand/50 border border-black/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gray">Contacts direct</span>
                  <div className="mt-2 space-y-2">
                    <a
                      href={`tel:${selectedCustomer.phone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-2 text-xs font-mono font-medium text-luxury-charcoal hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" /> {selectedCustomer.phone}
                    </a>
                    <a
                      href={`https://wa.me/213${selectedCustomer.phone.replace(/^0/, '').replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Ouvrir WhatsApp
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-luxury-sand/50 border border-black/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gray">Statistiques d&apos;achat</span>
                  <div className="mt-2">
                    <p className="text-xl font-bold font-mono text-luxury-charcoal">
                      {formatPrice(selectedCustomer.total_spent_dzd)} DZD
                    </p>
                    <p className="text-xs text-luxury-gray mt-0.5">
                      {selectedCustomer.orders_count} commande(s) passée(s)
                    </p>
                  </div>
                </div>
              </div>

              {/* Historique des commandes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal mb-3">
                  Historique de commandes récentes
                </h4>
                {customerOrders.length > 0 ? (
                  <div className="border border-black/10 divide-y divide-black/5">
                    {customerOrders.map(order => (
                      <div key={order.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
                        <div>
                          <span className="font-mono font-bold text-luxury-charcoal">#{order.id}</span>
                          <span className="text-luxury-gray ml-2">
                            {new Date(order.created_at).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold text-luxury-charcoal">
                            {formatPrice(order.total_dzd)} DZD
                          </span>
                          <span className="px-2 py-0.5 border text-[10px] uppercase font-semibold">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-luxury-gray italic">
                    Aucune commande archivée pour ce numéro.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedCustomer(null)} className="bg-luxury-charcoal text-white rounded-none">
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
