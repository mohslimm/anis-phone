"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Mock data (since we don't have enough history in DB yet)
const data = [
  { date: "01/04", ventes: 120000 },
  { date: "04/04", ventes: 250000 },
  { date: "08/04", ventes: 180000 },
  { date: "12/04", ventes: 320000 },
  { date: "16/04", ventes: 210000 },
  { date: "20/04", ventes: 450000 },
  { date: "24/04", ventes: 280000 },
  { date: "28/04", ventes: 520000 },
];

export function SalesChart() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Aperçu des Ventes (30 derniers jours)</CardTitle>
        <CardDescription>
          Évolution du chiffre d'affaires en DZD.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200" />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value}
                className="text-xs font-medium text-slate-500"
              />
              <YAxis 
                tickFormatter={(value) => `${(value / 1000)}k`} 
                tickLine={false}
                axisLine={false}
                className="text-xs font-medium text-slate-500"
              />
              <Tooltip 
                formatter={(value: any) => [`${Number(value).toLocaleString()} DZD`, "Chiffre d'affaires"]}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="ventes" 
                stroke="#2563eb" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorVentes)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
