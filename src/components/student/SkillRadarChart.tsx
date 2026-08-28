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
import { SkillItem } from "@/types";
import { Sparkles, CheckCircle } from "lucide-react";

interface SkillRadarChartProps {
  skills: SkillItem[];
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ skills }) => {
  const chartData = skills.map((s) => ({
    subject: s.name.split(" ")[0],
    score: s.score || s.proficiencyLevel * 20,
    fullMark: 100,
    verified: s.verificationStatus !== "SELF_REPORTED",
  }));

  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Competency Radar Graph</h3>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle size={10} /> OBE Mapped
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Normalized skill distribution based on verified tests and faculty endorsements.
          </p>
        </div>
      </div>

      <div className="w-full h-64 my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
            <PolarAngleAxis
              dataKey="subject"
              stroke="#94a3b8"
              tick={{ fill: "#cbd5e1", fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="rgba(255, 255, 255, 0.15)"
              tick={{ fill: "#64748b", fontSize: 9 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass-panel p-2.5 rounded-xl border border-white/20 text-xs shadow-xl">
                      <p className="font-bold text-white">{data.subject}</p>
                      <p className="text-cyan-400 font-semibold">Proficiency: {data.score}%</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Status: {data.verified ? "Verified Credential" : "Self Reported"}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name="Skill Score"
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-primary-500 shadow-glow" />
          <span>Top Strength: React & Next.js (92%)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Primary Gap: Containerization (60%)</span>
        </div>
      </div>
    </Card>
  );
};
