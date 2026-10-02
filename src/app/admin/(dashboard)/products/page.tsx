"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Pencil, Trash2, Loader2, Package, Sparkles, Check } from "lucide-react";
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
  DialogTrigger,
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
      brand_id: product.brand_id || "b-apple",
      category_id: product.category_id || "c-smartphones",
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit">
            Catalogue de Produits
          </h1>
          <p className="text-[13px] text-luxury-gray">
            Gérez votre sélection haut de gamme, tarifs DZD et fiches techniques.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger
            render={
              <Button
                onClick={() => { resetForm(); setIsModalOpen(true); }}
                className="bg-luxury-charcoal text-white hover:bg-black rounded-none shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un appareil
              </Button>
            }
          />
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-black/10 rounded-none p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-outfit font-bold">
                {editingId ? "Modifier l'Appareil" : "Ajouter un Nouvel Appareil"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Informations Générales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">Nom du modèle *</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: iPhone 16 Pro Max" 
                    className="border-black/10 rounded-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">Marque *</Label>
                  <Select 
                    value={formData.brand_id} 
                    onValueChange={(val) => setFormData({ ...formData, brand_id: val || "b-apple" })}
                  >
                    <SelectTrigger className="border-black/10 rounded-none">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Prix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">Prix de base (DZD) *</Label>
                  <Input 
                    type="number" 
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                    placeholder="285000" 
                    className="border-black/10 rounded-none font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">Prix promotionnel (Optionnel)</Label>
                  <Input 
                    type="number" 
                    value={formData.promo_price}
                    onChange={(e) => setFormData({ ...formData, promo_price: e.target.value })}
                    placeholder="275000" 
                    className="border-black/10 rounded-none font-mono"
                  />
                </div>
              </div>

              {/* Catégorie & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">Catégorie</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(val) => setFormData({ ...formData, category_id: val || "c-smartphones" })}
                  >
                    <SelectTrigger className="border-black/10 rounded-none">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">État de l&apos;appareil</Label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(val) => setFormData({ ...formData, condition: (val as "new" | "used") || "new" })}
                  >
                    <SelectTrigger className="border-black/10 rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Neuf sous blister</SelectItem>
                      <SelectItem value="used">Certifié Héritage (Occasion)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2 border border-black/10 cursor-pointer hover:bg-black/5">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-xs font-medium text-luxury-charcoal">En vedette (Homepage)</span>
                  </label>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-luxury-gray">URL du visuel principal</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="border-black/10 rounded-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-luxury-gray">Description d&apos;excellence</Label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full flex min-h-[90px] border border-black/10 bg-background p-3 text-sm focus:outline-none focus:border-luxury-charcoal"
                  placeholder="Points d'exception, garantie, état de la batterie..."
                />
              </div>

              {/* Fiche Technique */}
              <div className="p-4 bg-luxury-sand/50 border border-black/5 space-y-4">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-luxury-charcoal">
                  Fiche Technique Détaillée
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-luxury-gray">RAM</Label>
                    <Input 
                      value={formData.specs.ram}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, ram: e.target.value } })}
                      placeholder="ex: 8Go ou 12Go"
                      className="bg-white border-black/10 rounded-none h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-luxury-gray">Stockage</Label>
                    <Input 
                      value={formData.specs.storage}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, storage: e.target.value } })}
                      placeholder="ex: 256Go"
                      className="bg-white border-black/10 rounded-none h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-luxury-gray">Batterie</Label>
                    <Input 
                      value={formData.specs.battery}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, battery: e.target.value } })}
                      placeholder="ex: 5000 mAh"
                      className="bg-white border-black/10 rounded-none h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-luxury-gray">Écran</Label>
                    <Input 
                      value={formData.specs.screen}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, screen: e.target.value } })}
                      placeholder="ex: 6.8 OLED 120Hz"
                      className="bg-white border-black/10 rounded-none h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-luxury-gray">Processeur</Label>
                    <Input 
                      value={formData.specs.processor}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, processor: e.target.value } })}
                      placeholder="ex: A18 Pro / Snapdragon 8"
                      className="bg-white border-black/10 rounded-none h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-luxury-gray">Appareil photo</Label>
                    <Input 
                      value={formData.specs.camera}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, camera: e.target.value } })}
                      placeholder="ex: 48MP Triple capteur"
                      className="bg-white border-black/10 rounded-none h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-none">
                Annuler
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-luxury-charcoal text-white hover:bg-black rounded-none min-w-[120px]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-none border-black/10 shadow-sm overflow-hidden bg-white">
        <CardHeader className="py-4 border-b border-black/5">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-luxury-gray" />
              <Input
                type="search"
                placeholder="Rechercher par nom, marque..."
                className="pl-9 bg-[#f9fafb] border-black/10 text-sm focus:bg-white transition-all rounded-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-luxury-gray">État :</span>
              {["all", "new", "used"].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setConditionFilter(cond)}
                  className={`px-3 py-1 text-xs rounded-none border transition-colors ${
                    conditionFilter === cond
                      ? "bg-luxury-charcoal text-white border-luxury-charcoal"
                      : "bg-white text-luxury-gray border-black/10 hover:border-black/30"
                  }`}
                >
                  {cond === "all" ? "Tous" : cond === "new" ? "Neuf" : "Héritage"}
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
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Marque</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Catégorie</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Prix de Vente</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">État</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#c5a059]" />
                    <p className="text-xs text-luxury-gray mt-2">Chargement du catalogue...</p>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-black/[0.015] border-b border-black/5 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-none bg-luxury-sand border border-black/5 overflow-hidden flex items-center justify-center shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-luxury-gray" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-luxury-charcoal text-sm flex items-center gap-2">
                            {product.name}
                            {product.is_featured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-none text-[9px] font-bold bg-[#c5a059]/15 text-[#c5a059]">
                                <Sparkles className="w-2.5 h-2.5" /> Vedette
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-luxury-gray">
                            {product.specs?.storage || ""} {product.specs?.ram ? `• ${product.specs.ram}` : ""}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-luxury-gray text-xs">{product.brand?.name || "–"}</TableCell>
                    <TableCell className="text-luxury-gray text-xs">{product.category?.name || "–"}</TableCell>

                    <TableCell className="font-mono font-semibold text-luxury-charcoal text-sm">
                      {formatPrice(product.promo_price ?? product.base_price)} DZD
                      {product.promo_price && (
                        <div className="text-[10px] text-luxury-gray line-through">
                          {formatPrice(product.base_price)} DZD
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-semibold uppercase tracking-wider ${
                        product.condition === 'new' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-luxury-sand text-luxury-charcoal border border-black/10'
                      }`}>
                        {product.condition === "new" ? "Neuf" : "Héritage"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right pr-6 space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(product)}
                        className="h-8 w-8 text-luxury-gray hover:text-luxury-charcoal rounded-none"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(product.id)}
                        className="h-8 w-8 text-luxury-gray hover:text-red-600 rounded-none"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center text-sm text-luxury-gray">
                    Aucun appareil trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
