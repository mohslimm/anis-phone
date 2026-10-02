"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Smartphone, Lock, ArrowRight, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simule la connexion client instantanée
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem("anis_phone_customer_logged", "true");
      router.push("/account");
    }, 600);
  };

  return (
    <div className="bg-luxury-offwhite min-h-screen pt-32 pb-20 flex flex-col justify-center">
      <div className="container mx-auto px-6 max-w-md">
        <div className="bg-white border border-black/10 p-8 md:p-10 rounded-none shadow-xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#c5a059] to-[#99732e] text-[#060610] flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#c5a059] uppercase block mb-1">
              Espace Client Privilège
            </span>
            <h1 className="text-2xl font-outfit font-light text-luxury-charcoal">
              Connexion à Votre Espace
            </h1>
            <p className="text-xs text-luxury-gray mt-1">
              Accédez à vos commandes, garanties et factures 58 Wilayas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-luxury-gray">
                Numéro de Téléphone Algérie
              </Label>
              <Input
                type="tel"
                placeholder="0550 12 34 56"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-11 border-black/15 rounded-none font-mono text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs uppercase tracking-wider text-luxury-gray">
                  Code d&apos;accès / Mot de passe
                </Label>
                <Link href="/account" className="text-[11px] text-[#c5a059] hover:underline">
                  Suivi rapide sans mot de passe
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-black/15 rounded-none text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-luxury-charcoal text-white hover:bg-black rounded-none text-xs uppercase tracking-widest font-semibold transition-all mt-4"
            >
              {isSubmitting ? "Authentification en cours..." : "Accéder à mon compte"}
            </Button>
          </form>

          {/* Direct Track without login */}
          <div className="mt-8 pt-6 border-t border-black/5 text-center space-y-4">
            <p className="text-xs text-luxury-gray">
              Vous avez passé commande récemment ?
            </p>
            <Link href="/account">
              <Button variant="outline" className="w-full border-black/15 rounded-none text-xs hover:bg-black/5">
                Suivre mon colis en direct
              </Button>
            </Link>

            <div className="pt-2">
              <Link href="/admin/login" className="text-[11px] text-luxury-gray hover:text-black underline">
                Accès réservé aux gestionnaires de boutique (Console Admin)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
