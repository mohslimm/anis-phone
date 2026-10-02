"use client";

import { 
  HelpCircle, 
  PhoneCall, 
  Truck, 
  PackageCheck, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div className="space-y-8 max-w-5xl pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-luxury-charcoal font-outfit">
          Centre d&apos;Aide & Guide Opérationnel
        </h1>
        <p className="text-[13px] text-luxury-gray">
          Standard opérationnel pour la gestion quotidienne de la boutique en ligne Anis Phone.
        </p>
      </div>

      {/* Guide E-Commerce Algérie : Pipeline de Traitement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-none border-black/10 shadow-sm bg-white">
          <CardHeader className="border-b border-black/5 pb-4">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 mb-2">
              <PhoneCall className="w-4 h-4" />
            </div>
            <CardTitle className="text-base font-outfit">1. Confirmation Vocale</CardTitle>
            <CardDescription className="text-xs">Étape obligatoire sous 2h</CardDescription>
          </CardHeader>
          <CardContent className="p-5 text-xs text-luxury-gray leading-relaxed space-y-3">
            <p>
              En Algérie, <strong>100% des commandes</strong> doivent être confirmées par un appel vocal avant préparation du colis.
            </p>
            <div className="p-3 bg-luxury-sand text-luxury-charcoal space-y-1.5 border border-black/5">
              <p className="font-semibold text-[11px] uppercase tracking-wider">Script d&apos;appel type :</p>
              <p className="italic">
                &laquo; Bonjour M./Mme [Nom], je vous contacte de la part de la boutique Anis Phone suite à votre commande du [Modèle]. Confirmez-vous votre adresse de livraison à [Wilaya - Commune] ? &raquo;
              </p>
            </div>
            <p>
              Passez le statut à <strong className="text-blue-700">Confirmée</strong> dès validation du client.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-none border-black/10 shadow-sm bg-white">
          <CardHeader className="border-b border-black/5 pb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 mb-2">
              <Truck className="w-4 h-4" />
            </div>
            <CardTitle className="text-base font-outfit">2. Préparation & Expédition</CardTitle>
            <CardDescription className="text-xs">Emballage sécurisé & scellés</CardDescription>
          </CardHeader>
          <CardContent className="p-5 text-xs text-luxury-gray leading-relaxed space-y-3">
            <p>
              Imprimez le bon de commande depuis l&apos;onglet <strong>Commandes</strong>. Vérifiez le numéro IMEI pour tout appareil neuf ou d&apos;occasion.
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Apposer l&apos;autocollant scellé de garantie Anis Phone.</li>
              <li>Insérer la facture tamponnée dans la pochette plastique du colis.</li>
              <li>Remettre le colis au transporteur (Yalidine, Maystro, ZR Express).</li>
            </ul>
            <p>
              Passez le statut à <strong className="text-indigo-700">Expédiée</strong> pour générer le lien de suivi.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-none border-black/10 shadow-sm bg-white">
          <CardHeader className="border-b border-black/5 pb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 mb-2">
              <PackageCheck className="w-4 h-4" />
            </div>
            <CardTitle className="text-base font-outfit">3. Encaissement & Clôture</CardTitle>
            <CardDescription className="text-xs">Réception des fonds (COD)</CardDescription>
          </CardHeader>
          <CardContent className="p-5 text-xs text-luxury-gray leading-relaxed space-y-3">
            <p>
              Le livreur encaisse le montant en espèces directement auprès du client à la livraison.
            </p>
            <p>
              Dès réception du bordereau de virement du transporteur, passez le statut à <strong className="text-emerald-700">Livrée & Encaissée</strong> pour comptabiliser les revenus dans le Dashboard.
            </p>
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200">
              Le client est automatiquement segmenté dans le CRM avec son chiffre d&apos;affaires cumulé.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Foire Aux Questions Opérationnelles */}
      <Card className="rounded-none border-black/10 shadow-sm bg-white">
        <CardHeader className="border-b border-black/5 pb-4">
          <CardTitle className="text-lg font-outfit">Foire Aux Questions (FAQ Opérateurs)</CardTitle>
          <CardDescription className="text-xs">Solutions rapides aux situations courantes</CardDescription>
        </CardHeader>

        <CardContent className="p-6 divide-y divide-black/5 text-xs space-y-4">
          <div className="pt-2">
            <h4 className="font-semibold text-sm text-luxury-charcoal mb-1">
              Que faire si le client ne répond pas aux appels de confirmation ?
            </h4>
            <p className="text-luxury-gray leading-relaxed">
              Effectuez 3 tentatives espacées de 3 heures (Matin, Début d&apos;après-midi, Fin de journée). Envoyez un message WhatsApp avec le récapitulatif de la commande. Si aucune réponse après 24 heures, conservez la commande en attente avant d&apos;envisager l&apos;annulation pour libérer le stock.
            </p>
          </div>

          <div className="pt-4">
            <h4 className="font-semibold text-sm text-luxury-charcoal mb-1">
              Comment modifier les tarifs de livraison pour une Wilaya spécifique ?
            </h4>
            <p className="text-luxury-gray leading-relaxed">
              Rendez-vous dans la section <strong>Paramètres</strong> &gt; <strong>Tarification Livraison</strong>. Recherchez la Wilaya souhaitée (ex: 31 Oran ou 30 Ouargla), saisissez le nouveau montant en DZD, puis cliquez sur &laquo; Sauvegarder Grille Wilayas &raquo;. La modification s&apos;applique instantanément au panier client.
            </p>
          </div>

          <div className="pt-4">
            <h4 className="font-semibold text-sm text-luxury-charcoal mb-1">
              Comment ajouter une nouvelle variante de stockage ou de couleur ?
            </h4>
            <p className="text-luxury-gray leading-relaxed">
              Dans l&apos;onglet <strong>Catalogue</strong>, cliquez sur l&apos;icône d&apos;édition (crayon) du produit concerné. Vous pouvez modifier la fiche technique et renseigner les spécifications RAM/Stockage exactes. Pour réapprovisionner les quantités, utilisez le bouton d&apos;action directe dans l&apos;onglet <strong>Inventaire</strong>.
            </p>
          </div>

          <div className="pt-4">
            <h4 className="font-semibold text-sm text-luxury-charcoal mb-1">
              Comment exporter les chiffres pour l&apos;expert-comptable ?
            </h4>
            <p className="text-luxury-gray leading-relaxed">
              Allez dans la section <strong>Rapports</strong>, choisissez &laquo; Bilan Mensuel des Ventes &raquo; ou cliquez sur &laquo; Exporter en CSV &raquo; depuis l&apos;onglet Commandes. Le fichier exporté est directement compatible avec Microsoft Excel, Google Sheets et vos logiciels comptables.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
