"use client";

import { useState } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  Printer, 
  Plus, 
  CheckCircle, 
  Clock, 
  Filter,
  Layers,
  ShoppingBag,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { DataService } from "@/lib/data-service";
import { formatPrice } from "@/lib/format";

interface ReportItem {
  id: string;
  name: string;
  type: "Ventes" | "Inventaire" | "Finance" | "Clients";
  period: string;
  dateGenerated: string;
  status: "Prêt" | "Génération";
  format: "CSV / PDF";
}

const INITIAL_REPORTS: ReportItem[] = [
  { id: "rep-1", name: "Bilan Mensuel des Ventes — Avril 2026", type: "Ventes", period: "01/04 - 30/04/2026", dateGenerated: "2026-04-18", status: "Prêt", format: "CSV / PDF" },
  { id: "rep-2", name: "Audit d'Inventaire & Valorisation du Stock", type: "Inventaire", period: "Temps Réel", dateGenerated: "2026-04-18", status: "Prêt", format: "CSV / PDF" },
  { id: "rep-3", name: "Performance & Marge par Maison (Apple, Samsung, Xiaomi)", type: "Finance", period: "T1 2026", dateGenerated: "2026-04-15", status: "Prêt", format: "CSV / PDF" },
  { id: "rep-4", name: "Distribution Géographique des Colis (58 Wilayas)", type: "Ventes", period: "Derniers 30 jours", dateGenerated: "2026-04-12", status: "Prêt", format: "CSV / PDF" },
  { id: "rep-5", name: "Fichier CRM Clients VIP & Fréquence d'Achat", type: "Clients", period: "Année 2026", dateGenerated: "2026-04-10", status: "Prêt", format: "CSV / PDF" },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [newReportType, setNewReportType] = useState<"Ventes" | "Inventaire" | "Finance" | "Clients">("Ventes");
  const [newReportPeriod, setNewReportPeriod] = useState<string>("Ce mois");

  const handleDownload = async (report: ReportItem) => {
    let content = "";
    let filename = "";

    if (report.type === "Inventaire") {
      const items = await DataService.getInventoryList();
      content = "Produit,Configuration,Quantite_Stock,Prix_Indicatif_DZD,Statut\n";
      content += items.map(i => `"${i.product_name}","${i.label}",${i.stock_qty},${i.base_price},"${i.status}"`).join("\n");
      filename = `rapport_inventaire_anis_phone_${Date.now()}.csv`;
    } else if (report.type === "Clients") {
      const customers = await DataService.getCustomers();
      content = "Nom,Email,Telephone,Wilaya,Commandes,Total_Depense_DZD,Statut\n";
      content += customers.map(c => `"${c.name}","${c.email}","${c.phone}","${c.wilaya}",${c.orders_count},${c.total_spent_dzd},"${c.status}"`).join("\n");
      filename = `rapport_clients_anis_phone_${Date.now()}.csv`;
    } else {
      const orders = await DataService.getOrders();
      content = "ID_Commande,Date,Client,Telephone,Wilaya,Montant_DZD,Statut\n";
      content += orders.map(o => `"${o.id}","${o.created_at}","${o.customer_name}","${o.phone}","${o.wilaya}",${o.total_dzd},"${o.status}"`).join("\n");
      filename = `rapport_ventes_anis_phone_${Date.now()}.csv`;
    }

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = () => {
    const newRep: ReportItem = {
      id: `rep-${Date.now()}`,
      name: `Rapport de ${newReportType} — ${newReportPeriod}`,
      type: newReportType,
      period: newReportPeriod,
      dateGenerated: new Date().toISOString().split("T")[0],
      status: "Prêt",
      format: "CSV / PDF"
    };
    setReports([newRep, ...reports]);
    setIsGenerateOpen(false);
  };

  const filteredReports = reports.filter(r => typeFilter === "all" || r.type === typeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit">
            Rapports & Synthèses Analytiques
          </h1>
          <p className="text-[13px] text-luxury-gray">
            Génération, export comptable et documents d&apos;aide à la décision.
          </p>
        </div>

        <Button
          onClick={() => setIsGenerateOpen(true)}
          className="bg-luxury-charcoal text-white hover:bg-black rounded-none shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Générer un Rapport
        </Button>
      </div>

      {/* Main Table */}
      <Card className="rounded-none border-black/10 shadow-sm bg-white overflow-hidden">
        <CardHeader className="py-4 border-b border-black/5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-luxury-gray font-semibold">
              Rapports Disponibles ({filteredReports.length})
            </span>

            <div className="flex items-center gap-1.5">
              {["all", "Ventes", "Inventaire", "Finance", "Clients"].map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1 text-xs rounded-none border transition-colors ${
                    typeFilter === t
                      ? "bg-luxury-charcoal text-white border-luxury-charcoal"
                      : "bg-white text-luxury-gray border-black/10 hover:border-black/30"
                  }`}
                >
                  {t === "all" ? "Tous" : t}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#fafafa]">
              <TableRow className="border-b border-black/5 hover:bg-transparent">
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider pl-6">Intitulé du document</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Catégorie</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Période couverte</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Émis le</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider">Statut</TableHead>
                <TableHead className="text-[11px] font-semibold text-luxury-gray uppercase tracking-wider text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((r) => (
                <TableRow key={r.id} className="border-b border-black/5 hover:bg-black/[0.015] transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#c5a059]/15 flex items-center justify-center text-[#c5a059] shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-sm text-luxury-charcoal">{r.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-luxury-gray font-medium">
                    {r.type}
                  </TableCell>

                  <TableCell className="text-xs text-luxury-charcoal font-medium">
                    {r.period}
                  </TableCell>

                  <TableCell className="text-xs text-luxury-gray font-mono">
                    {r.dateGenerated}
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> {r.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right pr-6 space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(r)}
                      className="h-8 px-3 rounded-none text-xs text-luxury-charcoal hover:bg-black/5 border border-black/10"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Télécharger CSV
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.print()}
                      className="h-8 w-8 text-luxury-gray hover:text-luxury-charcoal rounded-none border border-black/10"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Générer Rapport */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="rounded-none max-w-md border-black/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-outfit font-bold">Générer un Rapport Personnalisé</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-luxury-gray">Type d&apos;analyse</Label>
              <Select 
                value={newReportType} 
                onValueChange={(val: any) => setNewReportType(val)}
              >
                <SelectTrigger className="border-black/10 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ventes">Rapport des Ventes & Livraisons</SelectItem>
                  <SelectItem value="Inventaire">Audit des Stocks & Alertes</SelectItem>
                  <SelectItem value="Finance">Performance Financière & Marges</SelectItem>
                  <SelectItem value="Clients">Export CRM & Clients Fidèles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-luxury-gray">Période temporelle</Label>
              <Select 
                value={newReportPeriod} 
                onValueChange={(val: any) => setNewReportPeriod(val)}
              >
                <SelectTrigger className="border-black/10 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aujourd'hui">Aujourd&apos;hui</SelectItem>
                  <SelectItem value="Cette semaine">7 derniers jours</SelectItem>
                  <SelectItem value="Ce mois">Mois en cours (Avril 2026)</SelectItem>
                  <SelectItem value="Ce trimestre">Premier Trimestre (T1 2026)</SelectItem>
                  <SelectItem value="Temps Réel">Totalité des archives</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-luxury-sand text-xs text-luxury-gray">
              Le fichier sera immédiatement synthétisé à partir de vos données en temps réel et mis à disposition pour téléchargement.
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsGenerateOpen(false)} className="rounded-none text-xs">
              Annuler
            </Button>
            <Button onClick={handleGenerate} className="bg-luxury-charcoal text-white hover:bg-black rounded-none text-xs">
              Compiler et générer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
