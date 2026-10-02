"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2, Loader2, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataService, Product, Brand, Category } from "@/lib/data-service";
import { formatPrice } from "@/lib/format";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    category_id: "",
    base_price: "",
    promo_price: "",
    description: "",
    condition: "new" as "new" | "used",
    is_featured: false,
    image_url: "",
    specs: {
      ram: "",
      storage: "",
      battery: "",
      screen: "",
      camera: "",
      processor: "",
    }
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, brs, cats] = await Promise.all([
        DataService.getProducts(),
        DataService.getBrands(),
        DataService.getCategories(),
      ]);
      setProducts(prods);
      setBrands(brs);
      setCategories(cats);
    } catch (e) {
      console.error("Error loading products data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      brand_id: brands[0]?.id || "b-apple",
      category_id: categories[0]?.id || "c-smartphones",
      base_price: "",
      promo_price: "",
      description: "",
      condition: "new",
      is_featured: false,
      image_url: "",
      specs: { ram: "", storage: "", battery: "", screen: "", camera: "", processor: "" }
    });
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      brand_id: product.brand_id || brands[0]?.id || "b-apple",
      category_id: product.category_id || categories[0]?.id || "c-smartphones",
      base_price: product.base_price.toString(),
      promo_price: product.promo_price?.toString() || "",
      description: product.description || "",
      condition: product.condition || "new",
      is_featured: !!product.is_featured,
      image_url: product.images?.[0] || "",
      specs: {
        ram: product.specs?.ram || "",
        storage: product.specs?.storage || "",
        battery: product.specs?.battery || "",
        screen: product.specs?.screen || "",
        camera: product.specs?.camera || "",
        processor: product.specs?.processor || "",
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment retirer cet article du catalogue ?")) return;
    try {
      await DataService.deleteProduct(id);
      await loadData();
    } catch (e) {
      console.error("Delete error:", e);
      alert("Erreur lors de la suppression");
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.base_price) {
      alert("Veuillez renseigner au moins le nom et le prix de base.");
      return;
    }

    setIsSaving(true);
    try {
      await DataService.saveProduct({
        id: editingId || undefined,
        name: formData.name.trim(),
        brand_id: formData.brand_id,
        category_id: formData.category_id,
        base_price: parseFloat(formData.base_price),
        promo_price: formData.promo_price ? parseFloat(formData.promo_price) : null,
        description: formData.description,
        condition: formData.condition,
        is_featured: formData.is_featured,
        images: formData.image_url.trim() ? [formData.image_url.trim()] : ["/hero/phone-aesthetic.jpg"],
        specs: formData.specs,
      });

      setIsModalOpen(false);
      resetForm();
      await loadData();
    } catch (e) {
      console.error("Save error:", e);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.brand?.name || "").toLowerCase().includes(q);
    const matchesCondition =
      conditionFilter === "all" || p.condition === conditionFilter;
    return matchesSearch && matchesCondition;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit uppercase">
            Catalogue de Produits
          </h1>
          <p className="text-xs text-luxury-gray mt-1">
            Gérez votre sélection officielle, tarifs DZD et fiches techniques.
          </p>
        </div>

        <Button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#0a0a14] text-white hover:bg-black rounded-xl shadow-sm h-10 px-4 text-xs font-semibold gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un appareil
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden bg-white">
        <CardHeader className="py-4 px-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-sm">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Rechercher par nom, marque..."
                className="pl-10 bg-slate-50 border-slate-200 text-xs focus:bg-white transition-all rounded-xl h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">État :</span>
              {[
                { key: "all", label: "Tous" },
                { key: "new", label: "Neuf Scellé" },
                { key: "used", label: "Héritage A+" },
              ].map((cond) => (
                <button
                  key={cond.key}
                  onClick={() => setConditionFilter(cond.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    conditionFilter === cond.key
                      ? "bg-[#0a0a14] text-white border-[#0a0a14]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {cond.label}
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
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Marque</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Catégorie</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prix DZD</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">État</TableHead>
                <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#c5a059]" />
                    <p className="text-xs text-slate-400 font-medium mt-2">Chargement du catalogue...</p>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} width={36} height={36} className="object-contain" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                            {product.name}
                            {product.is_featured && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#c5a059]/15 text-[#c5a059]">
                                <Sparkles className="w-2.5 h-2.5" /> Vedette
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {product.specs?.storage || ""} {product.specs?.ram ? `&bull; ${product.specs.ram}` : ""}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-600 text-xs font-medium">{product.brand?.name || "–"}</TableCell>
                    <TableCell className="text-slate-600 text-xs font-medium">{product.category?.name || "–"}</TableCell>

                    <TableCell className="font-mono font-bold text-slate-900 text-sm">
                      {formatPrice(product.promo_price ?? product.base_price)} DZD
                      {product.promo_price && (
                        <div className="text-[10px] text-slate-400 line-through">
                          {formatPrice(product.base_price)} DZD
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        product.condition === 'new' 
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {product.condition === "new" ? "Neuf" : "Héritage"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right pr-6 space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(product)}
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                        aria-label="Modifier le produit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(product.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        aria-label="Supprimer le produit"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center text-sm text-slate-400">
                    Aucun appareil trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-slate-200 rounded-3xl p-6 bg-white shadow-2xl">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-outfit font-bold text-slate-900">
              {editingId ? "Modifier l'Appareil" : "Ajouter un Nouvel Appareil"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Informations Générales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Nom de l&apos;Appareil</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Apple iPhone 16 Pro Max 256GB"
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Marque</Label>
                <Select
                  value={formData.brand_id}
                  onValueChange={(val) => setFormData({ ...formData, brand_id: val || "" })}
                >
                  <SelectTrigger className="rounded-xl border-slate-200 text-xs">
                    <SelectValue placeholder="Sélectionner la marque" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Catégorie</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(val) => setFormData({ ...formData, category_id: val || "" })}
                >
                  <SelectTrigger className="rounded-xl border-slate-200 text-xs">
                    <SelectValue placeholder="Sélectionner la catégorie" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Prix Standard (DZD)</Label>
                <Input
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  placeholder="ex: 245000"
                  className="rounded-xl border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Prix Promotionnel (Optionnel, DZD)</Label>
                <Input
                  type="number"
                  value={formData.promo_price}
                  onChange={(e) => setFormData({ ...formData, promo_price: e.target.value })}
                  placeholder="ex: 229000"
                  className="rounded-xl border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">État</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(val) => setFormData({ ...formData, condition: (val as "new" | "used") || "new" })}
                >
                  <SelectTrigger className="rounded-xl border-slate-200 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="new">Neuf Scellé</SelectItem>
                    <SelectItem value="used">Occasion Certifiée Héritage (A+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 w-full">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded text-[#c5a059]"
                  />
                  <span className="text-xs font-semibold text-slate-700">Mettre en vedette (Homepage)</span>
                </label>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">URL du visuel principal</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/... ou /products/..."
                className="rounded-xl border-slate-200 text-xs"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Description</Label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full flex min-h-[90px] border border-slate-200 rounded-xl bg-slate-50 p-3 text-xs focus:outline-none focus:border-[#0a0a14]"
                placeholder="Caractéristiques d'exception, garantie, état de la batterie..."
              />
            </div>

            {/* Fiche Technique */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Fiche Technique Détaillée
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-slate-400 font-semibold">RAM</Label>
                  <Input 
                    value={formData.specs.ram}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, ram: e.target.value } })}
                    placeholder="ex: 8Go ou 12Go"
                    className="bg-white border-slate-200 rounded-lg h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-slate-400 font-semibold">Stockage</Label>
                  <Input 
                    value={formData.specs.storage}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, storage: e.target.value } })}
                    placeholder="ex: 256Go"
                    className="bg-white border-slate-200 rounded-lg h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-slate-400 font-semibold">Batterie</Label>
                  <Input 
                    value={formData.specs.battery}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, battery: e.target.value } })}
                    placeholder="ex: 5000 mAh"
                    className="bg-white border-slate-200 rounded-lg h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-slate-400 font-semibold">Écran</Label>
                  <Input 
                    value={formData.specs.screen}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, screen: e.target.value } })}
                    placeholder="ex: 6.8 OLED 120Hz"
                    className="bg-white border-slate-200 rounded-lg h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-slate-400 font-semibold">Processeur</Label>
                  <Input 
                    value={formData.specs.processor}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, processor: e.target.value } })}
                    placeholder="ex: A18 Pro"
                    className="bg-white border-slate-200 rounded-lg h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-slate-400 font-semibold">Appareil photo</Label>
                  <Input 
                    value={formData.specs.camera}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, camera: e.target.value } })}
                    placeholder="ex: 48MP Triple capteur"
                    className="bg-white border-slate-200 rounded-lg h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl text-xs font-semibold">
              Annuler
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-[#0a0a14] text-white hover:bg-black rounded-xl text-xs font-semibold min-w-[120px]"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
