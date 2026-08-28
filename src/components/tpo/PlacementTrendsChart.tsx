"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, ShieldAlert } from "lucide-react";

interface PlacementTrendsChartProps {
  data: { skill: string; industryDemand: number; studentSupply: number }[];
}

export const PlacementTrendsChart: React.FC<PlacementTrendsChartProps> = ({ data }) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Industry Skill Demand vs Campus Supply</h3>
            <Badge variant="cyan" size="sm">
              <TrendingUp size={11} /> Real-time Gap
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compares recruiter hiring search volume against verified campus student talent pools.
          </p>
        </div>
      </div>

      <div className="w-full h-64 my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
            <XAxis
              dataKey="skill"
              stroke="#94a3b8"
              tick={{ fill: "#cbd5e1", fontSize: 10 }}
            />
            <YAxis stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 10 }} domain={[0, 100]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-panel p-2.5 rounded-xl border border-white/20 text-xs shadow-xl space-y-1">
                      <p className="font-bold text-white">{label}</p>
                      <p className="text-indigo-400">Industry Demand: {payload[0]?.value}%</p>
                      <p className="text-cyan-400">Campus Supply: {payload[1]?.value}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              formatter={(value) => <span className="text-slate-300">{value}</span>}
            />
            <Bar dataKey="industryDemand" name="Industry Demand" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="studentSupply" name="Campus Supply" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span>Critical Bottleneck: Cloud & DevOps (41% Supply Deficit)</span>
        <span className="text-emerald-400 font-semibold">NIRF Metric Ready</span>
      </div>
    </Card>
  );
};
