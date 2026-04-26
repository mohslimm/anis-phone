"use client";

import { useState } from "react";
import { Search, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock variants for stock management
  const [variants, setVariants] = useState([
    { id: "v1", product_name: "iPhone 15 Pro", label: "256Go Noir", stock_qty: 12 },
    { id: "v2", product_name: "iPhone 15 Pro", label: "256Go Titane", stock_qty: 3 },
    { id: "v3", product_name: "Samsung Galaxy S24 Ultra", label: "512Go Gris", stock_qty: 0 },
    { id: "v4", product_name: "Redmi Note 13 Pro+", label: "128Go Bleu", stock_qty: 25 },
  ]);

  const updateStock = (id: string, newStock: number) => {
    setVariants((current) =>
      current.map((v) => (v.id === id ? { ...v, stock_qty: newStock } : v))
    );
  };

  const getStockStatus = (qty: number) => {
    if (qty === 0) return { color: "bg-red-500", text: "Rupture de stock", badge: "bg-red-100 text-red-800" };
    if (qty < 5) return { color: "bg-orange-500", text: "Stock faible", badge: "bg-orange-100 text-orange-800" };
    return { color: "bg-emerald-500", text: "En stock", badge: "bg-emerald-100 text-emerald-800" };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestion des Stocks</h1>
        <p className="text-slate-500">Mettez à jour vos inventaires en temps réel.</p>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Rechercher par produit ou variante..."
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Variante</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[150px]">Quantité en Stock</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => {
                const status = getStockStatus(variant.stock_qty);
                return (
                  <TableRow key={variant.id} className={variant.stock_qty === 0 ? "bg-red-50/50" : ""}>
                    <TableCell className="font-medium">
                      {variant.stock_qty === 0 && <AlertCircle className="inline-block w-4 h-4 mr-2 text-red-500" />}
                      {variant.product_name}
                    </TableCell>
                    <TableCell className="text-slate-600">{variant.label}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${status.badge}`}>
                          {status.text}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        min="0"
                        value={variant.stock_qty}
                        onChange={(e) => updateStock(variant.id, parseInt(e.target.value) || 0)}
                        className={`h-8 font-medium ${variant.stock_qty === 0 ? "border-red-300 text-red-600 focus-visible:ring-red-500" : ""}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Save className="w-4 h-4 mr-2" />
                        Sauver
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
