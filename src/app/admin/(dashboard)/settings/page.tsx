"use client";

import { useState } from "react";
import { Settings, User, Bell, Shield, Smartphone, Globe, Mail, Phone, MapPin, Save, Loader2, Camera, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call for now
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-outfit font-black text-[#1a1a1a] tracking-tight uppercase leading-none">
          Paramètres
        </h1>
        <p className="text-[13px] font-medium text-slate-400">
          Gérez les préférences de la boutique et de votre compte administrateur.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-white border border-slate-200/60 p-1.5 h-14 rounded-2xl shadow-sm gap-1">
          <TabsTrigger value="general" className="rounded-xl px-6 h-full data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white font-bold text-[11px] uppercase tracking-widest transition-all">
            <Globe className="w-4 h-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl px-6 h-full data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white font-bold text-[11px] uppercase tracking-widest transition-all">
            <User className="w-4 h-4 mr-2" />
            Profil Admin
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-6 h-full data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white font-bold text-[11px] uppercase tracking-widest transition-all">
            <Shield className="w-4 h-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-6 h-full data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white font-bold text-[11px] uppercase tracking-widest transition-all">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
                <h3 className="text-[16px] font-bold text-[#1a1a1a]">Informations de la Boutique</h3>
                <p className="text-[12px] text-slate-400 font-medium mt-1">Ces informations seront affichées sur le site client.</p>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nom de la boutique</Label>
                  <Input defaultValue="Anis Phone" className="h-12 rounded-xl bg-slate-50/50 border-slate-100 focus:border-[#f7bf33]/50 focus:bg-white transition-all text-[14px] font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Slogan</Label>
                  <Input defaultValue="Boutique Premium Smartphones" className="h-12 rounded-xl bg-slate-50/50 border-slate-100 focus:border-[#f7bf33]/50 focus:bg-white transition-all text-[14px] font-medium" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Logo de la boutique</Label>
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center group cursor-pointer hover:border-[#f7bf33]/50 transition-all">
                        <div className="flex flex-col items-center gap-1 text-slate-300 group-hover:text-[#f7bf33]">
                            <Camera size={24} />
                            <span className="text-[10px] font-bold uppercase">Logo</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Button variant="outline" size="sm" className="h-9 rounded-lg border-slate-200 text-[11px] font-bold uppercase tracking-wider">Changer le logo</Button>
                        <p className="text-[10px] text-slate-400 font-medium">PNG ou JPG, max 2MB. Recommandé : 512x512px.</p>
                    </div>
                </div>
              </div>

              <Separator className="bg-slate-50" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email de contact</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input defaultValue="contact@anisphone.dz" className="h-12 pl-12 rounded-xl bg-slate-50/50 border-slate-100 focus:border-[#f7bf33]/50 focus:bg-white transition-all text-[14px] font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input defaultValue="0550 00 00 00" className="h-12 pl-12 rounded-xl bg-slate-50/50 border-slate-100 focus:border-[#f7bf33]/50 focus:bg-white transition-all text-[14px] font-medium" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Adresse physique</Label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-4 w-4 text-slate-300" />
                    <textarea 
                        className="w-full min-h-[100px] p-4 pl-12 rounded-xl bg-slate-50/50 border border-slate-100 focus:border-[#f7bf33]/50 focus:bg-white transition-all text-[14px] font-medium outline-none resize-none"
                        defaultValue="Cité 500 logements, Tizi Ouzou, Algérie"
                    />
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 flex justify-end gap-3">
              <Button variant="ghost" className="h-12 px-6 rounded-xl text-slate-500 font-bold text-[11px] uppercase tracking-widest">Annuler</Button>
              <Button disabled={isLoading} className={`h-12 px-8 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-black/5 transition-all gap-2 ${isSuccess ? 'bg-emerald-500 text-white' : 'bg-[#1a1a1a] text-white hover:bg-black'}`}>
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : isSuccess ? <Save size={16} /> : <Save size={16} />}
                {isSuccess ? 'Enregistré' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
           <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-10 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f7bf33] to-[#e5a800] flex items-center justify-center text-[#1a1a1a] font-black text-3xl shadow-xl border-4 border-white">
                    A
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-slate-100 shadow-md text-slate-500 hover:text-[#1a1a1a] transition-all">
                    <Camera size={16} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">Administrateur Principal</h3>
              <p className="text-[13px] text-slate-400 font-medium mt-1">Dernière connexion: Il y a 10 minutes</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-10 text-left">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nom Complet</Label>
                    <Input defaultValue="Admin Anis Phone" className="h-12 rounded-xl bg-slate-50/50 border-slate-100 focus:border-[#f7bf33]/50 focus:bg-white transition-all text-[14px] font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email de Connexion</Label>
                    <Input defaultValue="admin@anis.phone" className="h-12 rounded-xl bg-slate-50/50 border-slate-100 focus:border-[#f7bf33]/50 focus:bg-white transition-all text-[14px] font-medium" />
                  </div>
              </div>
              
              <div className="w-full mt-10 pt-10 border-t border-slate-50 flex justify-center">
                <Button variant="ghost" className="h-12 px-6 rounded-xl text-red-500 hover:bg-red-50 font-bold text-[11px] uppercase tracking-widest gap-2">
                    <LogOut size={16} />
                    Déconnexion de cet appareil
                </Button>
              </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
