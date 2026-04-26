"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Pencil, Trash2, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/admin/image-upload";
import { formatPrice } from "@/lib/format";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    category_id: "",
    base_price: "",
    promo_price: "",
    description: "",
    condition: "new",
    images: [] as string[],
    specs: {
      ram: "",
      storage: "",
      battery: "",
    }
  });

  const supabase = createClient();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [pdRes, brRes, catRes] = await Promise.all([
        supabase.from("products").select("*, brands(name), categories(name)").order("created_at", { ascending: false }),
        supabase.from("brands").select("*").order("name"),
        supabase.from("categories").select("*").order("name"),
      ]);

      if (pdRes.data) setProducts(pdRes.data);
      if (brRes.data) setBrands(brRes.data);
      if (catRes.data) setCategories(catRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.brand_id || !formData.base_price) {
      alert("Veuillez remplir les champs obligatoires (Nom, Marque, Prix)");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("products").insert([{
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substring(2, 5),
        brand_id: formData.brand_id,
        category_id: formData.category_id || null,
        base_price: parseFloat(formData.base_price),
        promo_price: formData.promo_price ? parseFloat(formData.promo_price) : null,
        description: formData.description,
        condition: formData.condition,
        images: formData.images,
        specs: formData.specs
      }]);

      if (error) throw error;

      setIsAddRouteOpen(false);
      fetchInitialData();
      // Reset form
      setFormData({
        name: "",
        brand_id: "",
        category_id: "",
        base_price: "",
        promo_price: "",
        description: "",
        condition: "new",
        images: [],
        specs: { ram: "", storage: "", battery: "" }
      });
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brands?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">Catalogue de Produits</h1>
          <p className="text-[13px] text-[#9eaab7]">Gérez votre inventaire avec précision.</p>
        </div>

        <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#f7bf33] text-[#1a1a1a] hover:bg-[#e5a800] border-none shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Button>
            }
          />
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-[#e9e9e9] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Ajouter un Nouveau Produit</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Informations Générales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-[#4b5563]">Nom du produit *</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ex: iPhone 15 Pro" 
                    className="border-[#e9e9e9] focus:border-[#f7bf33] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-[#4b5563]">Marque *</Label>
                  <Select 
                    value={formData.brand_id} 
                    onValueChange={(val) => setFormData({...formData, brand_id: val})}
                  >
                    <SelectTrigger className="border-[#e9e9e9]">
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

              {/* Upload des Photos */}
              <div className="space-y-3">
                <Label className="text-[13px] font-medium text-[#4b5563]">Photos du produit</Label>
                <ImageUpload 
                  value={formData.images}
                  onChange={(urls) => setFormData({...formData, images: urls})}
                  onRemove={(url) => setFormData({...formData, images: formData.images.filter(u => u !== url)})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-[#4b5563]">Prix de Base (DZD) *</Label>
                  <Input 
                    type="number" 
                    value={formData.base_price}
                    onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                    placeholder="240000" 
                    className="border-[#e9e9e9]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-[#4b5563]">Prix Promo (Optionnel)</Label>
                  <Input 
                    type="number" 
                    value={formData.promo_price}
                    onChange={(e) => setFormData({...formData, promo_price: e.target.value})}
                    placeholder="Prix réduit" 
                    className="border-[#e9e9e9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-[#4b5563]">Catégorie</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(val) => setFormData({...formData, category_id: val})}
                  >
                    <SelectTrigger className="border-[#e9e9e9]">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-[#4b5563]">État</Label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(val) => setFormData({...formData, condition: val})}
                  >
                    <SelectTrigger className="border-[#e9e9e9]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Neuf</SelectItem>
                      <SelectItem value="used">Occasion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-[#4b5563]">Description</Label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full flex min-h-[100px] rounded-xl border border-[#e9e9e9] bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f7bf33]/20 focus:border-[#f7bf33] transition-all"
                  placeholder="Points forts, garantie, accessoires inclus..."
                ></textarea>
              </div>

              <div className="p-4 border border-[#e9e9e9] rounded-2xl bg-[#faf9f7] space-y-4 shadow-sm">
                <h3 className="font-semibold text-[14px] text-[#1a1a1a]">Fiche Technique</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-[#9eaab7]">RAM</Label>
                    <Input 
                      value={formData.specs.ram}
                      onChange={(e) => setFormData({...formData, specs: {...formData.specs, ram: e.target.value}})}
                      placeholder="ex: 8Go" 
                      className="bg-white border-[#e9e9e9]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-[#9eaab7]">Stockage</Label>
                    <Input 
                      value={formData.specs.storage}
                      onChange={(e) => setFormData({...formData, specs: {...formData.specs, storage: e.target.value}})}
                      placeholder="ex: 256Go" 
                      className="bg-white border-[#e9e9e9]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-[#9eaab7]">Batterie</Label>
                    <Input 
                      value={formData.specs.battery}
                      onChange={(e) => setFormData({...formData, specs: {...formData.specs, battery: e.target.value}})}
                      placeholder="ex: 5000 mAh" 
                      className="bg-white border-[#e9e9e9]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setIsAddRouteOpen(false)} className="text-[#6b7280]">Annuler</Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-[#1a1a1a] text-white hover:bg-black min-w-[120px]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-[#e9e9e9] rounded-2xl shadow-sm overflow-hidden bg-white">
        <CardHeader className="py-4 border-b border-[#f3f4f6]">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9eaab7]" />
              <Input
                type="search"
                placeholder="Rechercher un produit..."
                className="pl-10 bg-[#f9fafb] border-[#e9e9e9] focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto border-[#e9e9e9] text-[#6b7280]">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#fafafa]">
              <TableRow className="hover:bg-transparent border-b border-[#f3f4f6]">
                <TableHead className="text-[11px] font-semibold text-[#9eaab7] uppercase tracking-wider pl-6">Produit</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#9eaab7] uppercase tracking-wider">Marque</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#9eaab7] uppercase tracking-wider">Catégorie</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#9eaab7] uppercase tracking-wider">Prix</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#9eaab7] uppercase tracking-wider">État</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#9eaab7] uppercase tracking-wider text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#f7bf33]" />
                    <p className="text-[13px] text-[#9eaab7] mt-2">Chargement du catalogue...</p>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-[#fafafa] border-b border-[#f3f4f6] transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] border border-[#e9e9e9] overflow-hidden flex items-center justify-center shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-[#9eaab7]" />
                          )}
                        </div>
                        <span className="font-medium text-[#1a1a1a] text-[14px]">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#6b7280] text-[13px]">{product.brands?.name || "–"}</TableCell>
                    <TableCell className="text-[#6b7280] text-[13px]">{product.categories?.name || "–"}</TableCell>
                    <TableCell className="font-semibold text-[#1a1a1a] text-[14px]">
                      {formatPrice(product.promo_price ?? product.base_price)} DZD
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${product.condition === 'new' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                        {product.condition === "new" ? "Neuf" : "Occasion"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6 space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9eaab7] hover:text-[#f7bf33] hover:bg-transparent">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9eaab7] hover:text-[#ef4444] hover:bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center text-[#9eaab7]">
                    Aucun produit trouvé.
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
