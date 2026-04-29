"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, TrendingUp, ShoppingCart, AlertTriangle, Users, Package, LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  trending: TrendingUp,
  cart: ShoppingCart,
  alert: AlertTriangle,
  users: Users,
  package: Package,
};

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  iconName: string;
  accent: string;
  delay?: number;
}

export function KPICard({ title, value, change, iconName, accent, delay = 0 }: KPICardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = ICON_MAP[iconName] || Package;

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          delay, 
          ease: "power3.out" 
        }
      );
    }
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-black/5 transition-shadow group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
          style={{ backgroundColor: `${accent}15` }}
        >
          <Icon size={20} style={{ color: accent }} />
        </div>
        <span className="text-[10px] font-bold text-slate-400 border border-slate-100 rounded-lg px-2.5 py-1 uppercase tracking-wider">
          Ce mois
        </span>
      </div>
      <div className="text-[26px] font-outfit font-black text-[#1a1a1a] leading-none mb-1">
        {value}
      </div>
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</div>
      
      <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-50">
        <div className={`flex items-center justify-center w-5 h-5 rounded-full ${accent === '#ef4444' ? 'bg-red-50' : 'bg-emerald-50'}`}>
            <ArrowUpRight size={12} style={{ color: accent }} />
        </div>
        <span className="text-[12px] font-bold" style={{ color: accent }}>
          {change}
        </span>
      </div>
    </div>
  );
}
