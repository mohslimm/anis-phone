"use client";

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
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f7bf33" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f7bf33" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            tickFormatter={(value) => `${(value / 1000)}k`} 
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip 
            cursor={{ stroke: '#f7bf33', strokeWidth: 2, strokeDasharray: '4 4' }}
            contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px'
            }}
            labelStyle={{ fontWeight: 800, color: '#1a1a1a', marginBottom: '4px', fontSize: '12px' }}
            itemStyle={{ fontSize: '11px', fontWeight: 600, color: '#f7bf33' }}
            formatter={(value: any) => [`${Number(value).toLocaleString()} DZD`, "CA"]}
          />
          <Area 
            type="monotone" 
            dataKey="ventes" 
            stroke="#f7bf33" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorVentes)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
