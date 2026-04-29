"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Pencil, Trash2, Loader2, Package, MoreHorizontal, Image as ImageIcon, CheckCircle2, AlertCircle, Smartphone, Laptop, Tablet, Headphones, Watch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/admin/image-upload";
import { formatPrice } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
        supabase.from("products").select("*, brands(name), categories(name), variants(stock_qty)").order("created_at", { ascending: false }),
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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-[28px] font-outfit font-black text-[#1a1a1a] tracking-tight uppercase">Catalogue Produits</h1>
          <p className="text-[13px] font-medium text-slate-400 mt-1 flex items-center gap-2">
            <Package size={14} className="text-[#f7bf33]" />
            {products.length} produits enregistrés au total
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher un modèle..."
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-medium outline-none focus:border-[#f7bf33]/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
                <DialogTrigger asChild>
                    <button className="h-12 px-6 rounded-xl bg-[#1a1a1a] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10 flex items-center gap-2">
                        <Plus size={16} />
                        Nouveau
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-none p-0 bg-[#F8F9FB]">
                    <div className="p-8 bg-white rounded-t-[2rem] border-b border-slate-100">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-outfit font-black uppercase tracking-tight">Ajouter au Catalogue</DialogTitle>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">Nouveau produit Anis Phone</p>
                        </DialogHeader>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Side: Basic Info */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Modèle du produit</Label>
                                    <Input 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="ex: iPhone 15 Pro Max" 
                                        className="h-12 rounded-xl border-slate-200 focus:ring-0 focus:border-[#f7bf33] font-medium text-[13px]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Marque</Label>
                                        <Select value={formData.brand_id} onValueChange={(val) => setFormData({...formData, brand_id: val})}>
                                            <SelectTrigger className="h-12 rounded-xl border-slate-200 font-medium text-[13px]">
                                                <SelectValue placeholder="Choisir..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-100">
                                                {brands.map(b => (
                                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Catégorie</Label>
                                        <Select value={formData.category_id} onValueChange={(val) => setFormData({...formData, category_id: val})}>
                                            <SelectTrigger className="h-12 rounded-xl border-slate-200 font-medium text-[13px]">
                                                <SelectValue placeholder="Choisir..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-100">
                                                {categories.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prix de base (DZD)</Label>
                                        <Input 
                                            type="number" 
                                            value={formData.base_price}
                                            onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                                            placeholder="0.00" 
                                            className="h-12 rounded-xl border-slate-200 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prix Promotion</Label>
                                        <Input 
                                            type="number" 
                                            value={formData.promo_price}
                                            onChange={(e) => setFormData({...formData, promo_price: e.target.value})}
                                            placeholder="Optionnel" 
                                            className="h-12 rounded-xl border-slate-200 font-bold text-[#f7bf33]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Media & More */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Images du produit</Label>
                                    <ImageUpload 
                                        value={formData.images}
                                        onChange={(urls) => setFormData({...formData, images: urls})}
                                        onRemove={(url) => setFormData({...formData, images: formData.images.filter(u => u !== url)})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">État de l'appareil</Label>
                                    <div className="flex gap-4">
                                        {['new', 'used'].map((cond) => (
                                            <button
                                                key={cond}
                                                onClick={() => setFormData({...formData, condition: cond})}
                                                className={`flex-1 h-12 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all ${
                                                    formData.condition === cond 
                                                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                                                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                {cond === 'new' ? 'Neuf' : 'Occasion'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tech Specs */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-[#f7bf33] rounded-full" />
                                <h3 className="text-[13px] font-black uppercase tracking-widest">Spécifications Techniques</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RAM</Label>
                                    <Input 
                                        value={formData.specs.ram}
                                        onChange={(e) => setFormData({...formData, specs: {...formData.specs, ram: e.target.value}})}
                                        placeholder="ex: 12Go" 
                                        className="h-11 rounded-xl bg-slate-50 border-none text-[12px] font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stockage</Label>
                                    <Input 
                                        value={formData.specs.storage}
                                        onChange={(e) => setFormData({...formData, specs: {...formData.specs, storage: e.target.value}})}
                                        placeholder="ex: 512Go" 
                                        className="h-11 rounded-xl bg-slate-50 border-none text-[12px] font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Batterie</Label>
                                    <Input 
                                        value={formData.specs.battery}
                                        onChange={(e) => setFormData({...formData, specs: {...formData.specs, battery: e.target.value}})}
                                        placeholder="ex: 4500mAh" 
                                        className="h-11 rounded-xl bg-slate-50 border-none text-[12px] font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white rounded-b-[2rem] border-t border-slate-100 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsAddRouteOpen(false)} className="h-12 px-6 rounded-xl text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                            Annuler
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="h-12 px-10 rounded-xl bg-[#1a1a1a] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmer l'ajout"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#1a1a1a]">Tous les Produits</h3>
              <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                      <Filter size={18} />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                      <MoreHorizontal size={18} />
                  </button>
              </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="pl-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Produit</TableHead>
                        <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identité</TableHead>
                        <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prix</TableHead>
                        <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock</TableHead>
                        <TableHead className="py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">État</TableHead>
                        <TableHead className="pr-8 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-32 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative">
                                        <Loader2 className="w-10 h-10 animate-spin text-[#f7bf33]" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Smartphone size={16} className="text-[#1a1a1a]" />
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Chargement du catalogue...</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {currentItems.map((product, index) => {
                                const stock = product.variants?.reduce((sum: number, v: any) => sum + (v.stock_qty || 0), 0) || 0;
                                return (
                                    <motion.tr 
                                        key={product.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/40 transition-colors group"
                                    >
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                    {product.images?.[0] ? (
                                                        <img 
                                                            src={product.images[0]} 
                                                            alt={product.name} 
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                (e.target.parentElement?.querySelector('.fallback-icon') as HTMLElement)?.classList.remove('hidden');
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className={`${product.images?.[0] ? 'hidden' : ''} fallback-icon`}>
                                                        <ImageIcon className="w-6 h-6 text-slate-200" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#1a1a1a] text-[14px] leading-tight group-hover:text-[#f7bf33] transition-colors">{product.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref: {product.id.split('-')[0]}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[12px] font-bold text-slate-600">{product.brands?.name || "–"}</span>
                                                <span className="text-[10px] font-medium text-slate-400">{product.categories?.name || "–"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex flex-col">
                                                <span className="font-black text-[#1a1a1a] text-[14px]">{formatPrice(product.promo_price ?? product.base_price)}</span>
                                                {product.promo_price && (
                                                    <span className="text-[10px] text-slate-400 line-through font-medium">{formatPrice(product.base_price)} DZD</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${stock > 5 ? 'bg-emerald-500' : stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                    <span className={`text-[11px] font-black uppercase tracking-wider ${stock > 0 ? 'text-[#1a1a1a]' : 'text-red-500'}`}>
                                                        {stock} unités
                                                    </span>
                                                </div>
                                                <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${stock > 5 ? 'bg-emerald-500' : stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${Math.min((stock / 20) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                                product.condition === 'new' 
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                                            }`}>
                                                {product.condition === 'new' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                {product.condition === "new" ? "Neuf" : "Occasion"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="pr-8 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-100 rounded-xl transition-all">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 border-slate-200/60 shadow-xl">
                                                    <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">Actions Produit</DropdownMenuLabel>
                                                    <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-[13px] font-semibold gap-3 focus:bg-slate-50 cursor-pointer">
                                                        <Pencil size={16} className="text-slate-400" />
                                                        Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-[13px] font-semibold gap-3 focus:bg-slate-50 cursor-pointer">
                                                        <Plus size={16} className="text-slate-400" />
                                                        Gérer le Stock
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-slate-50 my-1" />
                                                    <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-[13px] font-bold gap-3 text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                                                        <Trash2 size={16} />
                                                        Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
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
