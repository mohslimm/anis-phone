"use client";

import { useState, useEffect } from "react";
import { 
  Store, 
  Truck, 
  Shield, 
  Save, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  DollarSign, 
  Loader2,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataService, StoreSettings, WilayaDeliveryRate } from "@/lib/data-service";

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [wilayas, setWilayas] = useState<WilayaDeliveryRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filtre Wilayas
  const [wilayaSearch, setWilayaSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState<string>("all");

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const [st, wl] = await Promise.all([
          DataService.getSettings(),
          DataService.getWilayasDeliveryRates(),
        ]);
        setSettings(st);
        setWilayas(wl);
      } catch (e) {
        console.error("Error loading settings:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      await DataService.saveSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error("Save error:", e);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleWilayaPriceChange = (code: string, field: "homeDeliveryPrice" | "stopDeskPrice", value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    setWilayas(curr => curr.map(w => w.code === code ? { ...w, [field]: num } : w));
  };

  const handleSaveAllWilayas = async () => {
    setIsSaving(true);
    try {
      for (const w of wilayas) {
        await DataService.updateWilayaDeliveryRate(w.code, w.homeDeliveryPrice, w.stopDeskPrice);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error("Error saving wilayas:", e);
      alert("Erreur de sauvegarde des tarifs");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredWilayas = wilayas.filter(w => {
    const matchesSearch =
      w.name.toLowerCase().includes(wilayaSearch.toLowerCase()) ||
      w.code.includes(wilayaSearch);
    const matchesZone = zoneFilter === "all" || w.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  if (isLoading || !settings) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#c5a059] mb-3" />
        <p className="text-xs text-luxury-gray uppercase tracking-widest">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit uppercase">
            Paramètres &amp; Configuration
          </h1>
          <p className="text-xs text-luxury-gray mt-1">
            Coordonnées showroom, contact client et grille tarifaire de livraison 58 Wilayas d&apos;Algérie.
          </p>
        </div>

        {saveSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl">
            <Check className="w-4 h-4 text-emerald-600" /> Modifications enregistrées
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche : Paramètres Généraux (1/3) */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-100 pb-4 px-6 pt-6">
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-[#c5a059]" />
                <CardTitle className="text-base font-outfit">Showroom &amp; Contact</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Informations publiques visibles par les clients
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSaveGeneral} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Nom de l&apos;enseigne</Label>
                  <Input
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="border-slate-200 rounded-xl text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Téléphone Principal</Label>
                  <Input
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    className="border-slate-200 rounded-xl text-xs h-9 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">WhatsApp &amp; Support</Label>
                  <Input
                    value={settings.storeWhatsApp}
                    onChange={(e) => setSettings({ ...settings, storeWhatsApp: e.target.value })}
                    className="border-slate-200 rounded-xl text-xs h-9 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Email Showroom</Label>
                  <Input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                    className="border-slate-200 rounded-xl text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Adresse Showroom</Label>
                  <Input
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                    className="border-slate-200 rounded-xl text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Horaires d&apos;ouverture</Label>
                  <Input
                    value={settings.openingHours}
                    onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                    className="border-slate-200 rounded-xl text-xs h-9"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-[#0a0a14] text-white hover:bg-black rounded-xl text-xs font-semibold h-10 mt-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sauvegarder les Coordonnées"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Options de notifications & sécurité */}
          <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-100 pb-4 px-6 pt-6">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#c5a059]" />
                <CardTitle className="text-base font-outfit">Sécurité &amp; Alertes</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-luxury-charcoal">Alerte sonore de commande</p>
                  <p className="text-[11px] text-luxury-gray">Joue un signal lors d&apos;un nouvel achat</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundNotifications}
                  onChange={(e) => setSettings({ ...settings, soundNotifications: e.target.checked })}
                  className="rounded text-[#c5a059]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer border-t border-slate-100 pt-3">
                <div>
                  <p className="text-xs font-semibold text-luxury-charcoal">Mode Maintenance</p>
                  <p className="text-[11px] text-luxury-gray">Restreint l&apos;accès public temporairement</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="rounded text-[#c5a059]"
                />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Colonne Droite : Grille Tarifaire Livraison 58 Wilayas (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white overflow-hidden">
            <CardHeader className="py-5 px-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#c5a059]" />
                  <div>
                    <CardTitle className="text-base font-outfit">
                      Tarification Livraison &mdash; 58 Wilayas d&apos;Algérie
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Ajustez le coût à domicile et en bureau de retrait (StopDesk)
                    </CardDescription>
                  </div>
                </div>

                <Button
                  onClick={handleSaveAllWilayas}
                  disabled={isSaving}
                  className="bg-[#0a0a14] text-white hover:bg-black rounded-xl text-xs font-semibold h-9 px-4 gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Sauvegarder Grille Wilayas
                </Button>
              </div>

              {/* Filtres Wilayas */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Rechercher une wilaya par nom ou code (ex: 16 Alger, 31 Oran)..."
                    className="pl-9 bg-slate-50 border-slate-200 text-xs rounded-xl h-9"
                    value={wilayaSearch}
                    onChange={(e) => setWilayaSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-1">
                  {["all", "Centre", "Est", "Ouest", "Sud"].map((z) => (
                    <button
                      key={z}
                      onClick={() => setZoneFilter(z)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        zoneFilter === z
                          ? "bg-[#0a0a14] text-white border-[#0a0a14]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {z === "all" ? "Toutes" : z}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 max-h-[580px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                  <TableRow className="border-b border-slate-100 hover:bg-transparent">
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-6 w-[80px]">Code</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Wilaya</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Région</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Délai estimé</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[150px]">À Domicile (DZD)</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[150px] pr-6">Bureau StopDesk (DZD)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWilayas.map((w) => (
                    <TableRow key={w.code} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <TableCell className="pl-6 py-2.5 font-mono font-bold text-xs text-slate-900">
                        {w.code}
                      </TableCell>

                      <TableCell className="font-semibold text-xs text-slate-900">
                        {w.name}
                      </TableCell>

                      <TableCell>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-md font-semibold text-slate-600">
                          {w.zone}
                        </span>
                      </TableCell>

                      <TableCell className="text-xs text-slate-500 font-mono">
                        {w.deliveryHours}
                      </TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="50"
                          value={w.homeDeliveryPrice}
                          onChange={(e) => handleWilayaPriceChange(w.code, "homeDeliveryPrice", e.target.value)}
                          className="h-8 font-mono text-xs text-right pr-2 rounded-lg border-slate-200"
                        />
                      </TableCell>

                      <TableCell className="pr-6">
                        <Input
                          type="number"
                          min="0"
                          step="50"
                          value={w.stopDeskPrice}
                          onChange={(e) => handleWilayaPriceChange(w.code, "stopDeskPrice", e.target.value)}
                          className="h-8 font-mono text-xs text-right pr-2 rounded-lg border-slate-200"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
