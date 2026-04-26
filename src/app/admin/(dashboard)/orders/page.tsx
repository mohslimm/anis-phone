"use client";

import { useState } from "react";
import { Search, Download, Eye, Clock, CheckCircle, Truck, Package, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Mock data for UI demonstration
  const [orders, setOrders] = useState([
    {
      id: "ORD-1A2B",
      created_at: "2026-04-18T10:30:00Z",
      status: "pending",
      total_dzd: 240000,
      customer: "Mohamed Amine",
      phone: "0550123456",
      wilaya: "16 - Alger",
      address: "Cité 5 Juillet, Bat 4, Bab Ezzouar",
      items: [
        { product: "iPhone 15 Pro", variant: "256Go Noir", qty: 1, unit_price: 240000 }
      ]
    },
    {
      id: "ORD-3C4D",
      created_at: "2026-04-17T15:45:00Z",
      status: "shipped",
      total_dzd: 75000,
      customer: "Sara Benali",
      phone: "0771987654",
      wilaya: "31 - Oran",
      address: "Rue Didouche Mourad, Centre Ville",
      items: [
        { product: "Redmi Note 13 Pro+", variant: "128Go Bleu", qty: 1, unit_price: 75000 }
      ]
    }
  ]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((current) =>
      current.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const exportCSV = () => {
    // Generate CSV string
    const headers = "ID,Date,Client,Telephone,Wilaya,Adresse,Montant(DZD),Statut\n";
    const csvContent = orders.map(o => 
      `${o.id},${new Date(o.created_at).toLocaleString()},${o.customer},${o.phone},"${o.wilaya}","${o.address}",${o.total_dzd},${o.status}`
    ).join("\n");
    
    // Create download link
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `anis_phone_commandes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const StatusIcon = ({ status }: { status: string }) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-indigo-500" />;
      case 'delivered': return <Package className="w-4 h-4 text-emerald-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return "En attente";
      case 'confirmed': return "Confirmée";
      case 'shipped': return "Expédiée";
      case 'delivered': return "Livrée";
      case 'cancelled': return "Annulée";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Commandes</h1>
          <p className="text-slate-500">Suivez et traitez les commandes de vos clients.</p>
        </div>

        <Button variant="outline" onClick={exportCSV} className="bg-white">
          <Download className="w-4 h-4 mr-2" />
          Exporter en CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Rechercher par numéro, nom ou téléphone..."
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="shipped">Expédiée</SelectItem>
                  <SelectItem value="delivered">Livrée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Wilaya</TableHead>
                <TableHead>Total (DZD)</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</TableCell>
                  <TableCell>
                    <div>{order.customer}</div>
                    <div className="text-xs text-slate-500">{order.phone}</div>
                  </TableCell>
                  <TableCell>{order.wilaya}</TableCell>
                  <TableCell className="font-medium">{order.total_dzd.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={order.status} />
                      <span className="text-sm font-medium">{getStatusLabel(order.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger 
                        render={
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-2" /> Détails
                          </Button>
                        } 
                      />
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex items-center justify-between mt-2">
                            <DialogTitle className="text-xl">Commande #{selectedOrder?.id}</DialogTitle>
                            <div className="flex items-center gap-2 mr-6 text-sm font-medium">
                              <StatusIcon status={selectedOrder?.status} />
                              {getStatusLabel(selectedOrder?.status)}
                            </div>
                          </div>
                          <DialogDescription>
                            Passée le {selectedOrder && new Date(selectedOrder.created_at).toLocaleString("fr-FR")}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedOrder && (
                          <div className="grid gap-6 py-4">
                            <div className="bg-slate-50 p-4 rounded-lg border grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-semibold text-slate-900 text-sm mb-1">Informations Client</h3>
                                <p className="text-sm text-slate-600">{selectedOrder.customer}</p>
                                <p className="text-sm text-slate-600">{selectedOrder.phone}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 text-sm mb-1">Adresse de livraison</h3>
                                <p className="text-sm text-slate-600">{selectedOrder.wilaya}</p>
                                <p className="text-sm text-slate-600">{selectedOrder.address}</p>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <Label className="text-base">Mettre à jour le statut</Label>
                              </div>
                              <Select 
                                value={selectedOrder.status} 
                                onValueChange={(val) => handleStatusChange(selectedOrder.id, val || "")}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente (Nouvelle commande)</SelectItem>
                                  <SelectItem value="confirmed">Confirmée par téléphone</SelectItem>
                                  <SelectItem value="shipped">Expédiée (Remise au livreur)</SelectItem>
                                  <SelectItem value="delivered">Livrée (Encaissement validé)</SelectItem>
                                  <SelectItem value="cancelled">Annulée</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-base mb-3 block">Articles commandés</Label>
                              <div className="border rounded-md overflow-hidden">
                                <Table>
                                  <TableHeader className="bg-slate-50">
                                    <TableRow>
                                      <TableHead>Produit</TableHead>
                                      <TableHead className="text-center">Qté</TableHead>
                                      <TableHead className="text-right">Prix Unitaire</TableHead>
                                      <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedOrder.items.map((item: any, idx: number) => (
                                      <TableRow key={idx}>
                                        <TableCell>
                                          <div className="font-medium">{item.product}</div>
                                          <div className="text-xs text-slate-500">{item.variant}</div>
                                        </TableCell>
                                        <TableCell className="text-center">{item.qty}</TableCell>
                                        <TableCell className="text-right">{item.unit_price.toLocaleString()} DZD</TableCell>
                                        <TableCell className="text-right font-medium text-slate-900">
                                          {(item.qty * item.unit_price).toLocaleString()} DZD
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow className="bg-slate-50">
                                      <TableCell colSpan={3} className="text-right font-semibold">Total Général</TableCell>
                                      <TableCell className="text-right font-bold text-lg text-blue-600">
                                        {selectedOrder.total_dzd.toLocaleString()} DZD
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" className="w-full sm:w-auto">Fermer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    Aucune commande trouvée.
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
