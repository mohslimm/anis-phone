"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Identifiants incorrects. Veuillez réessayer.");
      setIsLoading(false);
      return;
    }

    router.refresh();
    router.replace(next);
  };

  return (
    <div className="w-full max-w-[400px] space-y-8 p-8 bg-white rounded-2xl border border-[#e9e9e9] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#e9e9e9] overflow-hidden">
            <Image
              src="/anis-phone-logo.png"
              alt="ANIS PHONE Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
        </div>
        <h1 className="text-[24px] font-bold text-[#1a1a1a] tracking-tight">Espace Admin</h1>
        <p className="text-[13px] text-[#9eaab7]">Connectez-vous pour gérer anis.phone</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="p-3 text-[12px] font-medium text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl animate-shake">
            {error}
          </div>
        )}
        
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[12px] font-semibold text-[#4b5563] ml-1">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#9eaab7]" />
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@anis.phone" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="pl-10 h-11 border-[#e9e9e9] rounded-xl focus:ring-[#f7bf33]/20 focus:border-[#f7bf33] transition-all"
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="password">{/* Hidden label context */}
            <span className="text-[12px] font-semibold text-[#4b5563] ml-1">Mot de passe</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#9eaab7]" />
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="pl-10 h-11 border-[#e9e9e9] rounded-xl focus:ring-[#f7bf33]/20 focus:border-[#f7bf33] transition-all"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-11 bg-[#1a1a1a] text-white hover:bg-black rounded-xl font-semibold text-[14px] shadow-sm transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>

      <div className="pt-4 text-center">
        <a href="/" className="text-[12px] text-[#9eaab7] hover:text-[#f7bf33] transition-colors">
          Retour au site client
        </a>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#f7bf33]" />
          <p className="text-[13px] text-[#9eaab7] font-medium">Préparation de l'accès...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
