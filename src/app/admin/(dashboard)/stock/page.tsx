"use client";

import { useState, useEffect } from "react";
import { Search, Save, AlertCircle, Loader2, Package, Smartphone, MoreVertical, RefreshCw, CheckCircle2, Laptop } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function StockPage() {
  const [variants, setVariants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("variants")
        .select(`
          *,
          products (name, id)
        `)
        .order("stock_qty", { ascending: true });

      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      console.error("Error fetching stock:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStock = async (variantId: string, newQty: number) => {
    setIsSaving(variantId);
    try {
      const { error } = await supabase
        .from("variants")
        .update({ stock_qty: newQty })
        .eq("id", variantId);

      if (error) throw error;
      
      setVariants(current => 
        current.map(v => v.id === variantId ? { ...v, stock_qty: newQty } : v)
      );
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsSaving('success-' + variantId);
      setTimeout(() => setIsSaving(null), 2000);
    }
  };

  const filteredVariants = variants.filter((v) => 
    v.products?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);
  const currentItems = filteredVariants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStockConfig = (qty: number) => {
    if (qty === 0) return { color: "bg-red-50 text-red-600 border-red-100", label: "Rupture", dot: "bg-red-500" };
    if (qty < 5) return { color: "bg-amber-50 text-amber-600 border-amber-100", label: "Faible", dot: "bg-amber-500" };
    return { color: "bg-emerald-50 text-emerald-600 border-emerald-100", label: "Sain", dot: "bg-emerald-500" };
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-[28px] font-outfit font-black text-[#1a1a1a] tracking-tight uppercase">Inventaire & Stock</h1>
          <p className="text-[13px] font-medium text-slate-400 mt-1 flex items-center gap-2">
            <RefreshCw size={14} className="text-[#f7bf33]" />
            Mise à jour en temps réel des quantités disponibles
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Filtrer par modèle ou spécification..."
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-medium outline-none focus:border-[#f7bf33]/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={fetchStock}
                className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#1a1a1a] transition-all"
            >
                <RefreshCw size={18} />
            </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="pl-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Produit Parent</TableHead>
                <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Variante / SKU</TableHead>
                <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Niveau d'alerte</TableHead>
                <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Quantité</TableHead>
                <TableHead className="pr-8 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 animate-spin text-[#f7bf33]" />
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Synchronisation de l'inventaire...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {currentItems.map((variant, index) => {
                    const config = getStockConfig(variant.stock_qty);
                    return (
                      <motion.tr 
                        key={variant.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/40 transition-colors group ${variant.stock_qty === 0 ? 'bg-red-50/30' : ''}`}
                      >
                        <TableCell className="pl-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#f7bf33]/10 group-hover:text-[#f7bf33] transition-colors">
                              {variant.products?.name?.toLowerCase().includes('macbook') || variant.products?.name?.toLowerCase().includes('laptop') ? (
                                <Laptop size={20} />
                              ) : (
                                <Smartphone size={20} />
                              )}
                            </div>
                            <span className="font-bold text-[#1a1a1a] text-[14px]">{variant.products?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-semibold text-slate-600">{variant.label}</span>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">SKU: {variant.id.split('-')[0].toUpperCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.color} border`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                            {config.label}
                          </span>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="flex justify-center">
                            <div className="relative group/input">
                                <input 
                                    type="number" 
                                    min="0"
                                    value={variant.stock_qty}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setVariants(current => current.map(v => v.id === variant.id ? { ...v, stock_qty: val } : v));
                                    }}
                                    className={`w-24 h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-center font-black text-[14px] focus:bg-white focus:border-[#f7bf33]/50 outline-none transition-all ${variant.stock_qty === 0 ? 'text-red-500 border-red-200 bg-red-50/50' : ''}`}
                                />
                                {variant.stock_qty === 0 && (
                                    <div className="absolute -top-1 -right-1">
                                        <AlertCircle size={14} className="text-red-500 fill-white" />
                                    </div>
                                )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="pr-8 py-5 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={isSaving === variant.id}
                            onClick={() => handleUpdateStock(variant.id, variant.stock_qty)}
                            className={`h-10 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all gap-2 disabled:opacity-80 ${
                              isSaving === 'success-' + variant.id 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-[#1a1a1a] text-white hover:bg-black'
                            }`}
                          >
                            {isSaving === variant.id ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : isSaving === 'success-' + variant.id ? (
                                <CheckCircle2 size={14} />
                            ) : (
                                <Save size={14} />
                            )}
                            {isSaving === 'success-' + variant.id ? 'Mis à jour' : 'Sauvegarder'}
                          </Button>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
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

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                  <AlertCircle size={28} />
              </div>
              <div className="flex flex-col">
                  <span className="text-[24px] font-black text-[#1a1a1a]">{variants.filter(v => v.stock_qty === 0).length}</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ruptures de stock</span>
              </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <RefreshCw size={28} />
              </div>
              <div className="flex flex-col">
                  <span className="text-[24px] font-black text-[#1a1a1a]">{variants.filter(v => v.stock_qty > 0 && v.stock_qty < 5).length}</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Stocks faibles</span>
              </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={28} />
              </div>
              <div className="flex flex-col">
                  <span className="text-[24px] font-black text-[#1a1a1a]">{variants.filter(v => v.stock_qty >= 5).length}</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Niveaux optimaux</span>
              </div>
          </div>
      </div>
    </div>
  );
}

