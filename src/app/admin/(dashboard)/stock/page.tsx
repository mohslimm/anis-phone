"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Save, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ArrowUpDown, 
  Plus, 
  Layers, 
  AlertTriangle,
  PackageCheck,
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit">
            Gestion des Stocks & Inventaire
          </h1>
          <p className="text-[13px] text-luxury-gray">
            Surveillez et ajustez vos niveaux d&apos;inventaire en temps réel.
          </p>
        </div>

        <Button
          onClick={fetchInventory}
          variant="outline"
          className="border-black/10 text-luxury-charcoal hover:bg-black/5"
        >
          Actualiser l&apos;inventaire
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 p-5 rounded-none flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-luxury-gray font-semibold">Articles Total</span>
            <div className="text-2xl font-bold text-luxury-charcoal mt-1">{totalVariants}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-luxury-charcoal">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-black/10 p-5 rounded-none flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Stock Faible (&lt; 5)</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-black/10 p-5 rounded-none flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-red-700 font-semibold">Rupture Immédiate</span>
            <div className="text-2xl font-bold text-red-600 mt-1">{outOfStockCount}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <PackageX className="w-5 h-5" />
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
                placeholder="Rechercher par produit, capacité, couleur..."
                className="pl-9 bg-[#f9fafb] border-black/10 text-sm focus:bg-white transition-all rounded-none"
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
                  className={`px-3 py-1.5 text-xs font-medium rounded-none border transition-colors whitespace-nowrap ${
                    statusFilter === btn.key
                      ? "bg-luxury-charcoal text-white border-luxury-charcoal"
                      : "bg-white text-luxury-gray border-black/10 hover:border-black/30"
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
            <TableHeader className="bg-[#fafafa]">
              <TableRow className="border-b border-black/5 hover:bg-transparent">
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider pl-6">Produit</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Configuration</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Prix indicatif</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Statut</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider w-[140px]">Quantité</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#c5a059] mb-2" />
                    <p className="text-xs text-luxury-gray">Chargement de l&apos;inventaire...</p>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isLow = item.status === "low_stock";
                  const isOut = item.status === "out_of_stock";

                  return (
                    <TableRow 
                      key={item.id} 
                      className={`border-b border-black/5 hover:bg-black/[0.015] transition-colors ${
                        isOut ? "bg-red-50/30" : isLow ? "bg-amber-50/20" : ""
                      }`}
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-2">
                          {isOut && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                          <span className="font-medium text-sm text-luxury-charcoal">
                            {item.product_name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-luxury-gray">
                        {item.label}
                      </TableCell>

                      <TableCell className="text-sm font-mono font-medium text-luxury-charcoal">
                        {formatPrice(item.base_price)} DZD
                      </TableCell>

                      <TableCell>
                        {isOut ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[11px] font-medium bg-red-100 text-red-800">
                            Rupture
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[11px] font-medium bg-amber-100 text-amber-800">
                            Faible ({item.stock_qty})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[11px] font-medium bg-emerald-100 text-emerald-800">
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
                            className={`h-8 w-20 text-center font-mono font-semibold rounded-none ${
                              isOut ? "border-red-400 text-red-600 bg-red-50/50" : "border-black/15"
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
                            className="h-8 px-2 text-xs text-luxury-gray hover:text-luxury-charcoal"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> +Ajouter
                          </Button>

                          {/* Bouton Sauvegarder */}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isSaving === item.id}
                            onClick={() => handleSaveStock(item.id, item.stock_qty)}
                            className={`h-8 px-3 rounded-none text-xs font-medium min-w-[75px] transition-all ${
                              saveSuccess === item.id
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "border-black/15 text-luxury-charcoal hover:bg-luxury-charcoal hover:text-white"
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
                  <TableCell colSpan={6} className="h-32 text-center text-sm text-luxury-gray">
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
          <DialogContent className="rounded-none max-w-md border-black/10">
            <DialogHeader>
              <DialogTitle className="text-lg font-outfit">Réapprovisionner le Stock</DialogTitle>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div>
                <p className="text-sm font-semibold text-luxury-charcoal">{restockModalItem.product_name}</p>
                <p className="text-xs text-luxury-gray">{restockModalItem.label}</p>
                <p className="text-xs text-luxury-charcoal mt-1">Stock actuel : <strong>{restockModalItem.stock_qty} unités</strong></p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-luxury-gray">Unités à ajouter</Label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[5, 10, 20, 50].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAddedQty(preset)}
                      className={`py-2 text-xs font-semibold border rounded-none transition-colors ${
                        addedQty === preset
                          ? "bg-luxury-charcoal text-white border-luxury-charcoal"
                          : "bg-white text-luxury-gray border-black/10 hover:border-black/30"
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
                  className="rounded-none border-black/15 font-mono text-base"
                />
              </div>

              <div className="p-3 bg-luxury-sand text-xs text-luxury-charcoal border border-black/5">
                Nouveau stock après validation : <strong>{restockModalItem.stock_qty + addedQty} unités</strong>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setRestockModalItem(null)} className="rounded-none">
                Annuler
              </Button>
              <Button onClick={handleQuickRestock} className="bg-luxury-charcoal text-white hover:bg-black rounded-none">
                Confirmer l&apos;approvisionnement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
