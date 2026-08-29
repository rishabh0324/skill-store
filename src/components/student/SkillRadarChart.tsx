"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, ShieldCheck } from "lucide-react";

interface SkillRadarItem {
  name: string;
  selfScore: number;
  verifiedScore?: number | null;
  industryBenchmark: number;
  isVerified?: boolean;
}

interface SkillRadarChartProps {
  skills: SkillRadarItem[];
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ skills }) => {
  const chartData = skills.slice(0, 7).map((s) => ({
    subject: s.name.split(" ")[0],
    fullName: s.name,
    "My Competency": s.verifiedScore || s.selfScore,
    "Industry Benchmark": s.industryBenchmark,
    isVerified: !!s.verifiedScore,
  }));

  const verifiedCount = skills.filter((s) => s.isVerified || !!s.verifiedScore).length;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-accent-cyan" />
            Live Competency Radar
          </h3>
          <p className="text-xs text-slate-400">
            Real-time normalized comparison against corporate hiring benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm">
            <ShieldCheck size={12} className="mr-1" /> {verifiedCount} of {skills.length} Verified
          </Badge>
        </div>
      </div>

      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 9 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass-panel p-2.5 rounded-xl text-xs space-y-1 shadow-xl border border-white/10">
                      <p className="font-bold text-white">{data.fullName}</p>
                      <p className="text-indigo-400 font-medium">
                        Student Score: {data["My Competency"]}%
                      </p>
                      <p className="text-cyan-400 font-medium">
                        Industry Benchmark: {data["Industry Benchmark"]}%
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Status: {data.isVerified ? "✅ Assessment Verified" : "📝 Self-Reported"}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name="My Competency"
              dataKey="My Competency"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.4}
            />
            <Radar
              name="Industry Benchmark"
              dataKey="Industry Benchmark"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-glow" />
          <span className="text-slate-300">My Verified Score</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-glow-cyan" />
          <span className="text-slate-300">Target Benchmark (80%)</span>
        </div>
      </div>
    </Card>
  );
};
