"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Save, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Plus, 
  Layers, 
  AlertTriangle,
  PackageX
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DataService } from "@/lib/data-service";
import { formatPrice } from "@/lib/format";

interface InventoryItem {
  id: string;
  product_name: string;
  product_id: string;
  label: string;
  stock_qty: number;
  base_price: number;
  condition: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export default function StockPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Modal Réapprovisionnement rapide
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [addedQty, setAddedQty] = useState<number>(10);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const data = await DataService.getInventoryList();
      setItems(data);
    } catch (e) {
      console.error("Failed to load inventory:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const onQuantityChange = (id: string, value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    setItems((curr) =>
      curr.map((item) => {
        if (item.id === id) {
          let newStatus: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";
          if (num === 0) newStatus = "out_of_stock";
          else if (num < 5) newStatus = "low_stock";
          return { ...item, stock_qty: num, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleSaveStock = async (id: string, qty: number) => {
    setIsSaving(id);
    try {
      await DataService.updateStockQuantity(id, qty);
      setSaveSuccess(id);
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (e) {
      console.error("Error updating stock:", e);
      alert("Erreur lors de la mise à jour du stock");
    } finally {
      setIsSaving(null);
    }
  };

  const handleQuickRestock = async () => {
    if (!restockModalItem) return;
    const newTotal = restockModalItem.stock_qty + addedQty;
    await handleSaveStock(restockModalItem.id, newTotal);
    setItems(curr => curr.map(item => item.id === restockModalItem.id ? { ...item, stock_qty: newTotal } : item));
    setRestockModalItem(null);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.label.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, statusFilter]);

  // KPIs
  const totalVariants = items.length;
  const lowStockCount = items.filter((i) => i.status === "low_stock").length;
  const outOfStockCount = items.filter((i) => i.status === "out_of_stock").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit uppercase">
            Gestion des Stocks &amp; Inventaire
          </h1>
          <p className="text-xs text-luxury-gray mt-1">
            Surveillez et ajustez vos niveaux d&apos;inventaire en temps réel.
          </p>
        </div>

        <Button
          onClick={fetchInventory}
          variant="outline"
          className="rounded-xl border-slate-200 text-xs font-semibold hover:bg-slate-50 gap-2 h-10"
        >
          Actualiser l&apos;inventaire
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Articles Total</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{totalVariants}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-600 font-bold">Stock Faible (&lt; 5)</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-red-600 font-bold">Rupture Immédiate</span>
            <div className="text-2xl font-bold text-red-600 mt-1">{outOfStockCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <PackageX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Rechercher par produit, capacité, couleur..."
                className="pl-10 bg-slate-50 border-slate-200 text-xs focus:bg-white transition-all rounded-xl h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { key: "all", label: "Tous" },
                { key: "in_stock", label: "En stock" },
                { key: "low_stock", label: "Stock faible" },
                { key: "out_of_stock", label: "Rupture" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setStatusFilter(btn.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                    statusFilter === btn.key
                      ? "bg-[#0a0a14] text-white border-[#0a0a14]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-6">Produit</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Configuration</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prix indicatif</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Statut</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[140px]">Quantité</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#c5a059] mb-2" />
                    <p className="text-xs text-slate-400 font-medium">Chargement de l&apos;inventaire...</p>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isLow = item.status === "low_stock";
                  const isOut = item.status === "out_of_stock";

                  return (
                    <TableRow 
                      key={item.id} 
                      className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                        isOut ? "bg-red-50/20" : isLow ? "bg-amber-50/20" : ""
                      }`}
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-2">
                          {isOut && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                          <span className="font-semibold text-sm text-slate-900">
                            {item.product_name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-slate-500 font-medium">
                        {item.label}
                      </TableCell>

                      <TableCell className="text-sm font-mono font-bold text-slate-900">
                        {formatPrice(item.base_price)} DZD
                      </TableCell>

                      <TableCell>
                        {isOut ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
                            Rupture
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Faible ({item.stock_qty})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            En stock ({item.stock_qty})
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            min="0"
                            value={item.stock_qty}
                            onChange={(e) => onQuantityChange(item.id, e.target.value)}
                            className={`h-8 w-20 text-center font-mono font-bold rounded-lg text-xs ${
                              isOut ? "border-red-300 text-red-600 bg-red-50/50" : "border-slate-200"
                            }`}
                          />
                        </div>
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Bouton Réapprovisionner */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRestockModalItem(item);
                              setAddedQty(10);
                            }}
                            className="h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> +Ajouter
                          </Button>

                          {/* Bouton Sauvegarder */}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isSaving === item.id}
                            onClick={() => handleSaveStock(item.id, item.stock_qty)}
                            className={`h-8 px-3 rounded-lg text-xs font-semibold min-w-[75px] transition-all ${
                              saveSuccess === item.id
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "border-slate-200 text-slate-700 hover:bg-[#0a0a14] hover:text-white"
                            }`}
                          >
                            {isSaving === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : saveSuccess === item.id ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> OK
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5 mr-1" /> Sauver
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-sm text-slate-400">
                    Aucun article correspondant trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Réapprovisionnement Rapide */}
      {restockModalItem && (
        <Dialog open={!!restockModalItem} onOpenChange={() => setRestockModalItem(null)}>
          <DialogContent className="rounded-3xl max-w-md border-slate-200 p-6 bg-white shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-3">
              <DialogTitle className="text-lg font-outfit font-bold text-slate-900">Réapprovisionner le Stock</DialogTitle>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-sm font-bold text-slate-900">{restockModalItem.product_name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{restockModalItem.label}</p>
                <p className="text-xs text-slate-700 mt-2">Stock actuel : <strong>{restockModalItem.stock_qty} unités</strong></p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Unités à ajouter</Label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[5, 10, 20, 50].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAddedQty(preset)}
                      className={`py-2 text-xs font-bold border rounded-xl transition-colors ${
                        addedQty === preset
                          ? "bg-[#0a0a14] text-white border-[#0a0a14]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
                <Input
                  type="number"
                  min="1"
                  value={addedQty}
                  onChange={(e) => setAddedQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="rounded-xl border-slate-200 font-mono text-base h-10"
                />
              </div>

              <div className="p-3 bg-[#c5a059]/10 rounded-xl text-xs text-slate-800 border border-[#c5a059]/20">
                Nouveau stock calculé : <strong>{restockModalItem.stock_qty + addedQty} unités</strong>
              </div>
            </div>

            <DialogFooter className="gap-2 border-t border-slate-100 pt-3">
              <Button variant="ghost" onClick={() => setRestockModalItem(null)} className="rounded-xl text-xs font-semibold">
                Annuler
              </Button>
              <Button onClick={handleQuickRestock} className="bg-[#0a0a14] text-white hover:bg-black rounded-xl text-xs font-semibold">
                Confirmer l&apos;approvisionnement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
