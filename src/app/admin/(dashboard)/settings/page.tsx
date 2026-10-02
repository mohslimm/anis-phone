"use client";

import { useState, useEffect } from "react";
import { 
  Store, 
  Truck, 
  Bell, 
  Shield, 
  Save, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  DollarSign, 
  Loader2,
  Search,
  Filter
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
import { formatPrice } from "@/lib/format";

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit">
            Paramètres & Configuration de la Boutique
          </h1>
          <p className="text-[13px] text-luxury-gray">
            Coordonnées showroom, contact client et grille tarifaire de livraison 58 Wilayas.
          </p>
        </div>

        {saveSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" /> Modifications enregistrées
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche : Infos Générales & Contact (1/3) */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="rounded-none border-black/10 shadow-sm bg-white">
            <CardHeader className="border-b border-black/5 pb-4">
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-[#c5a059]" />
                <CardTitle className="text-base font-outfit">Identité & Showroom</CardTitle>
              </div>
              <CardDescription className="text-xs">Informations visibles par les clients</CardDescription>
            </CardHeader>

            <CardContent className="p-5">
              <form onSubmit={handleSaveGeneral} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">Nom de l&apos;enseigne</Label>
                  <Input
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="border-black/10 rounded-none text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">Email Service Client</Label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="border-black/10 rounded-none text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">Hotline Commerciale</Label>
                  <Input
                    value={settings.phoneHotline}
                    onChange={(e) => setSettings({ ...settings, phoneHotline: e.target.value })}
                    className="border-black/10 rounded-none text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">WhatsApp Officiel</Label>
                  <Input
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="border-black/10 rounded-none text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">Adresse Showroom</Label>
                  <Input
                    value={settings.addressShowroom}
                    onChange={(e) => setSettings({ ...settings, addressShowroom: e.target.value })}
                    className="border-black/10 rounded-none text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-luxury-gray">Horaires d&apos;ouverture</Label>
                  <Input
                    value={settings.openingHours}
                    onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                    className="border-black/10 rounded-none text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-luxury-charcoal text-white hover:bg-black rounded-none text-xs mt-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sauvegarder les Coordonnées"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Options de notifications & sécurité */}
          <Card className="rounded-none border-black/10 shadow-sm bg-white">
            <CardHeader className="border-b border-black/5 pb-4">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#c5a059]" />
                <CardTitle className="text-base font-outfit">Sécurité & Alertes</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-luxury-charcoal">Alerte sonore de commande</p>
                  <p className="text-[11px] text-luxury-gray">Joue un signal lors d&apos;un nouvel achat</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundNotifications}
                  onChange={(e) => setSettings({ ...settings, soundNotifications: e.target.checked })}
                  className="rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer border-t border-black/5 pt-3">
                <div>
                  <p className="text-xs font-semibold text-luxury-charcoal">Mode Maintenance</p>
                  <p className="text-[11px] text-luxury-gray">Restreint l&apos;accès public temporairement</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="rounded"
                />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Colonne Droite : Grille Tarifaire Livraison 58 Wilayas (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-none border-black/10 shadow-sm bg-white overflow-hidden">
            <CardHeader className="py-4 border-b border-black/5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#c5a059]" />
                  <div>
                    <CardTitle className="text-base font-outfit">
                      Tarification Livraison — 58 Wilayas d&apos;Algérie
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Ajustez le coût à domicile et en bureau de retrait (Stop-Desk)
                    </CardDescription>
                  </div>
                </div>

                <Button
                  onClick={handleSaveAllWilayas}
                  disabled={isSaving}
                  className="bg-luxury-charcoal text-white hover:bg-black rounded-none text-xs"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Sauvegarder Grille Wilayas
                </Button>
              </div>

              {/* Filtres Wilayas */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-luxury-gray" />
                  <Input
                    type="search"
                    placeholder="Rechercher une wilaya par nom ou code (ex: 16 Alger, 31 Oran)..."
                    className="pl-8 bg-[#f9fafb] border-black/10 text-xs rounded-none h-8"
                    value={wilayaSearch}
                    onChange={(e) => setWilayaSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-1">
                  {["all", "Centre", "Est", "Ouest", "Sud"].map((z) => (
                    <button
                      key={z}
                      onClick={() => setZoneFilter(z)}
                      className={`px-2.5 py-1 text-xs rounded-none border transition-colors ${
                        zoneFilter === z
                          ? "bg-luxury-charcoal text-white border-luxury-charcoal"
                          : "bg-white text-luxury-gray border-black/10 hover:border-black/30"
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
                <TableHeader className="bg-[#fafafa] sticky top-0 z-10">
                  <TableRow className="border-b border-black/5 hover:bg-transparent">
                    <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider pl-6 w-[80px]">Code</TableHead>
                    <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Wilaya</TableHead>
                    <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Région</TableHead>
                    <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Délai estimé</TableHead>
                    <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider w-[150px]">À Domicile (DZD)</TableHead>
                    <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider w-[150px] pr-6">Bureau StopDesk (DZD)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWilayas.map((w) => (
                    <TableRow key={w.code} className="border-b border-black/5 hover:bg-black/[0.015]">
                      <TableCell className="pl-6 py-2.5 font-mono font-bold text-xs text-luxury-charcoal">
                        {w.code}
                      </TableCell>

                      <TableCell className="font-semibold text-xs text-luxury-charcoal">
                        {w.name}
                      </TableCell>

                      <TableCell>
                        <span className="text-[10px] px-2 py-0.5 bg-black/5 font-medium text-luxury-gray">
                          {w.zone}
                        </span>
                      </TableCell>

                      <TableCell className="text-xs text-luxury-gray font-mono">
                        {w.deliveryHours}
                      </TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="50"
                          value={w.homeDeliveryPrice}
                          onChange={(e) => handleWilayaPriceChange(w.code, "homeDeliveryPrice", e.target.value)}
                          className="h-8 font-mono text-xs text-right pr-2 rounded-none border-black/15"
                        />
                      </TableCell>

                      <TableCell className="pr-6">
                        <Input
                          type="number"
                          min="0"
                          step="50"
                          value={w.stopDeskPrice}
                          onChange={(e) => handleWilayaPriceChange(w.code, "stopDeskPrice", e.target.value)}
                          className="h-8 font-mono text-xs text-right pr-2 rounded-none border-black/15"
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
