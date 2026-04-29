"use client";

import { useState, useEffect } from "react";
import { Search, User, Calendar, ShoppingBag, CreditCard, Filter, MoreHorizontal, Loader2, ArrowUpRight, Smartphone } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles with customer role
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          phone,
          created_at,
          orders (id, total_dzd, status)
        `)
        .eq("role", "customer")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Process data to calculate totals
      const processedClients = profiles.map((p: any) => {
        const completedOrders = p.orders?.filter((o: any) => o.status === 'delivered') || [];
        const totalSpent = completedOrders.reduce((sum: number, o: any) => sum + (o.total_dzd || 0), 0);
        return {
          ...p,
          totalOrders: p.orders?.length || 0,
          totalSpent,
        };
      });

      setClients(processedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter((c) => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentItems = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-[28px] font-outfit font-black text-[#1a1a1a] tracking-tight uppercase">Clients</h1>
          <p className="text-[13px] font-medium text-slate-400 mt-1 flex items-center gap-2">
            <User size={14} className="text-[#f7bf33]" />
            Gérez votre base de clients et analysez leur fidélité
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher un client (Nom, Tel)..."
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-medium outline-none focus:border-[#f7bf33]/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="h-12 px-6 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#1a1a1a] font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2">
                <Filter size={16} />
                Filtres
            </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] p-6 rounded-[2rem] text-white shadow-xl shadow-black/10 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#f7bf33]">
                  <User size={28} />
              </div>
              <div className="flex flex-col">
                  <span className="text-[24px] font-black">{clients.length}</span>
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Total Clients</span>
              </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                  <ShoppingBag size={28} />
              </div>
              <div className="flex flex-col">
                  <span className="text-[24px] font-black text-[#1a1a1a]">
                    {clients.reduce((s, c) => s + c.totalOrders, 0)}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Commandes totales</span>
              </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <CreditCard size={28} />
              </div>
              <div className="flex flex-col">
                  <span className="text-[20px] font-black text-[#1a1a1a]">
                    {formatPrice(clients.reduce((s, c) => s + c.totalSpent, 0))} DZD
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Chiffre d'affaires cumulé</span>
              </div>
          </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="pl-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</TableHead>
                <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</TableHead>
                <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Commandes</TableHead>
                <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Total Dépensé</TableHead>
                <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inscrit le</TableHead>
                <TableHead className="pr-8 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 animate-spin text-[#f7bf33]" />
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Chargement de l'annuaire...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {currentItems.map((client, index) => (
                    <motion.tr 
                      key={client.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/40 transition-colors group"
                    >
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-[#1a1a1a] font-black text-xs group-hover:bg-[#f7bf33] group-hover:text-white transition-all">
                            {client.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[#1a1a1a] text-[14px] leading-tight">{client.full_name || 'Anonyme'}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: #{client.id.split('-')[0]}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                            <Smartphone size={12} className="text-slate-300" />
                            {client.phone || 'Pas de numéro'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-100 text-[12px] font-black text-[#1a1a1a]">
                          {client.totalOrders}
                        </span>
                      </TableCell>
                      <TableCell className="py-5 text-center">
                        <span className="text-[14px] font-black text-[#1a1a1a]">
                          {formatPrice(client.totalSpent)} <span className="text-[10px] text-slate-400">DZD</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                          <Calendar size={14} className="text-slate-300" />
                          {format(new Date(client.created_at), 'dd MMM yyyy', { locale: fr })}
                        </div>
                      </TableCell>
                      <TableCell className="pr-8 py-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 shadow-xl">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">Actions Client</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-[13px] font-medium py-2.5 rounded-lg">
                              <ArrowUpRight size={14} />
                              Voir le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-[13px] font-medium py-2.5 rounded-lg">
                              <ShoppingBag size={14} />
                              Historique achats
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-[13px] font-medium py-2.5 text-red-500 focus:text-red-500 rounded-lg">
                              Bloquer l'accès
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
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
