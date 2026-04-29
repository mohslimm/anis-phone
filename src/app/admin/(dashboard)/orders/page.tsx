"use client";

import { useState, useEffect } from "react";
import { Search, Download, Eye, Clock, CheckCircle, Truck, Package, XCircle, MoreHorizontal, User, MapPin, Phone, Calendar, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (name, images)
          ),
          profiles (full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      
      setOrders(current => 
        current.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentItems = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'pending': return { label: "En attente", color: "bg-orange-50 text-orange-600 border-orange-100", icon: Clock };
      case 'confirmed': return { label: "Confirmée", color: "bg-blue-50 text-blue-600 border-blue-100", icon: CheckCircle };
      case 'shipped': return { label: "Expédiée", color: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: Truck };
      case 'delivered': return { label: "Livrée", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: Package };
      case 'cancelled': return { label: "Annulée", color: "bg-red-50 text-red-600 border-red-100", icon: XCircle };
      default: return { label: status, color: "bg-slate-50 text-slate-600", icon: Clock };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-[28px] font-outfit font-black text-[#1a1a1a] tracking-tight uppercase">Gestion Commandes</h1>
          <p className="text-[13px] font-medium text-slate-400 mt-1 flex items-center gap-2">
            <ShoppingBag size={14} className="text-[#f7bf33]" />
            {orders.length} commandes enregistrées sur la plateforme
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Numéro, client ou téléphone..."
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-medium outline-none focus:border-[#f7bf33]/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
                <SelectTrigger className="h-12 w-[180px] rounded-xl border-slate-200 font-bold text-[11px] uppercase tracking-widest">
                    <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-xl">
                    <SelectItem value="all" className="rounded-xl">Tous les statuts</SelectItem>
                    <SelectItem value="pending" className="rounded-xl">En attente</SelectItem>
                    <SelectItem value="confirmed" className="rounded-xl">Confirmée</SelectItem>
                    <SelectItem value="shipped" className="rounded-xl">Expédiée</SelectItem>
                    <SelectItem value="delivered" className="rounded-xl">Livrée</SelectItem>
                    <SelectItem value="cancelled" className="rounded-xl">Annulée</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="pl-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commande</TableHead>
                <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</TableHead>
                <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wilaya</TableHead>
                <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Montant</TableHead>
                <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</TableHead>
                <TableHead className="pr-8 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 animate-spin text-[#f7bf33]" />
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Chargement des commandes...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {currentItems.map((order, index) => {
                    const config = getStatusConfig(order.status);
                    const StatusIcon = config.icon;
                    return (
                      <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/40 transition-colors group"
                      >
                        <TableCell className="pl-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-black text-[#1a1a1a] text-[14px]">#{order.id.split('-')[0].toUpperCase()}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                              <Calendar size={10} />
                              {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm', { locale: fr })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#f7bf33]/10 group-hover:text-[#f7bf33] transition-colors">
                              <User size={18} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[#1a1a1a] text-[14px]">{order.profiles?.full_name || "Invité"}</span>
                              <span className="text-[11px] font-medium text-slate-400">{order.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin size={14} className="text-slate-300" />
                            <span className="text-[13px] font-semibold">{order.wilaya}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <span className="font-black text-[#1a1a1a] text-[15px]">{formatPrice(order.total_dzd)}</span>
                        </TableCell>
                        <TableCell className="py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${config.color} border shadow-sm`}>
                            <StatusIcon size={12} />
                            {config.label}
                          </span>
                        </TableCell>
                        <TableCell className="pr-8 py-5 text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="h-10 px-4 rounded-xl bg-slate-50 text-[#1a1a1a] font-bold text-[11px] uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white transition-all border border-transparent hover:border-[#1a1a1a]"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="w-4 h-4 mr-2" /> 
                                Gérer
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none p-0 bg-[#F8F9FB] shadow-2xl">
                              <div className="p-10 bg-white rounded-t-[2.5rem] border-b border-slate-100 flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter">Commande #{order.id.split('-')[0].toUpperCase()}</h2>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${config.color} border shadow-sm`}>
                                      {config.label}
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <Calendar size={14} className="text-[#f7bf33]" />
                                    Enregistrée le {format(new Date(order.created_at), 'PPPP à HH:mm', { locale: fr })}
                                  </p>
                                </div>
                                <Button variant="ghost" className="h-12 w-12 rounded-full hover:bg-slate-100">
                                  <Download size={20} />
                                </Button>
                              </div>

                              <div className="p-10 space-y-10">
                                {/* Customer & Shipping Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                        <User size={20} />
                                      </div>
                                      <h3 className="font-black uppercase tracking-widest text-[13px]">Profil Client</h3>
                                    </div>
                                    <div className="space-y-4">
                                      <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Nom complet</span>
                                        <span className="text-[15px] font-bold text-[#1a1a1a]">{order.profiles?.full_name || "Invité"}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Téléphone</span>
                                        <div className="flex items-center gap-2 text-[15px] font-bold text-indigo-600">
                                          <Phone size={14} />
                                          {order.phone}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                        <MapPin size={20} />
                                      </div>
                                      <h3 className="font-black uppercase tracking-widest text-[13px]">Livraison</h3>
                                    </div>
                                    <div className="space-y-4">
                                      <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Wilaya</span>
                                        <span className="text-[15px] font-bold text-[#1a1a1a]">{order.wilaya}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Adresse complète</span>
                                        <span className="text-[14px] font-medium text-slate-600 leading-relaxed">{order.address}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Order Status Update */}
                                <div className="bg-[#1a1a1a] p-8 rounded-[2rem] shadow-2xl shadow-black/20 text-white space-y-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-2 h-6 bg-[#f7bf33] rounded-full" />
                                      <h3 className="text-[14px] font-black uppercase tracking-[0.2em]">Flux Logistique</h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">Mise à jour instantanée</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                                    <div className="space-y-3">
                                      <Label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-1">Changer l'état</Label>
                                      <Select 
                                        value={order.status} 
                                        onValueChange={(val) => handleStatusChange(order.id, val)}
                                      >
                                        <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold text-[13px] focus:ring-[#f7bf33]/50">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-slate-100 p-2">
                                          <SelectItem value="pending" className="rounded-xl py-3">En attente (Vérification)</SelectItem>
                                          <SelectItem value="confirmed" className="rounded-xl py-3">Confirmée (Prête)</SelectItem>
                                          <SelectItem value="shipped" className="rounded-xl py-3">Expédiée (Livreur)</SelectItem>
                                          <SelectItem value="delivered" className="rounded-xl py-3">Livrée (Terminée)</SelectItem>
                                          <SelectItem value="cancelled" className="rounded-xl py-3 text-red-500">Annulée</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total à encaisser</div>
                                        <div className="text-3xl font-black text-[#f7bf33]">{formatPrice(order.total_dzd)}</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-6">
                                  <div className="flex items-center gap-3 px-4">
                                    <ShoppingBag size={20} className="text-slate-400" />
                                    <h3 className="font-black uppercase tracking-widest text-[15px]">Articles de la commande</h3>
                                  </div>
                                  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                                    <Table>
                                      <TableHeader className="bg-slate-50/50">
                                        <TableRow className="border-none">
                                          <TableHead className="pl-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Produit</TableHead>
                                          <TableHead className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Quantité</TableHead>
                                          <TableHead className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Prix Unit.</TableHead>
                                          <TableHead className="pr-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Sous-total</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {order.order_items?.map((item: any) => (
                                          <TableRow key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="pl-8 py-6">
                                              <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                                                  {item.products?.images?.[0] ? (
                                                    <img src={item.products.images[0]} className="w-full h-full object-cover" alt="" />
                                                  ) : (
                                                    <Smartphone size={20} className="text-slate-200" />
                                                  )}
                                                </div>
                                                <div className="flex flex-col">
                                                  <span className="font-bold text-[#1a1a1a] text-[14px]">{item.products?.name}</span>
                                                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">Variant ID: {item.variant_id?.split('-')[0]}</span>
                                                </div>
                                              </div>
                                            </TableCell>
                                            <TableCell className="text-center font-black text-[#1a1a1a]">x{item.qty}</TableCell>
                                            <TableCell className="text-right font-semibold text-slate-600">{formatPrice(item.unit_price_dzd)}</TableCell>
                                            <TableCell className="pr-8 text-right font-black text-[#1a1a1a] text-[15px]">{formatPrice(item.qty * item.unit_price_dzd)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </div>

                              <div className="p-8 bg-slate-50/50 rounded-b-[2.5rem] border-t border-slate-100 flex justify-end">
                                <Button variant="outline" className="h-12 px-10 rounded-2xl bg-white border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-100">
                                  Fermer la vue détaillée
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200 mb-2">
                        <ShoppingBag size={32} />
                      </div>
                      <h3 className="text-[14px] font-black uppercase tracking-widest text-slate-400">Aucune commande</h3>
                      <p className="text-[12px] text-slate-400 font-medium">Les nouvelles commandes apparaîtront ici.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Page {currentPage} sur {totalPages || 1}
            </div>
            <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="h-10 px-4 rounded-xl border-slate-200 text-[11px] font-bold uppercase tracking-widest"
                >
                    Précédent
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="h-10 px-4 rounded-xl border-slate-200 text-[11px] font-bold uppercase tracking-widest"
                >
                    Suivant
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

function Smartphone(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function Loader2(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`animate-spin ${props.className}`}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    )
}

