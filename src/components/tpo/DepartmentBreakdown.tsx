"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Building2, Award } from "lucide-react";

interface DepartmentBreakdownProps {
  departments: {
    department: string;
    total: number;
    ready: number;
    avgScore: number;
  }[];
}

export const DepartmentBreakdown: React.FC<DepartmentBreakdownProps> = ({ departments }) => {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Department-Wise Readiness Index</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Student cohort benchmarking aligned with NAAC Criterion 5 (Student Progression).
          </p>
        </div>
        <Badge variant="success" size="sm">
          <Award size={11} /> NAAC Compliant
        </Badge>
      </div>

      <div className="space-y-4">
        {departments.map((dept, i) => {
          const readyPct = Math.round((dept.ready / dept.total) * 100);
          return (
            <div key={i} className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{dept.department}</span>
                <span className="text-slate-300">
                  <strong className="text-accent-cyan">{dept.ready}</strong> / {dept.total} Students Ready ({readyPct}%)
                </span>
              </div>
              <Progress value={readyPct} variant={readyPct >= 80 ? "emerald" : readyPct >= 70 ? "cyan" : "amber"} />
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span>Avg Assessment Score: {dept.avgScore}%</span>
                <span className={readyPct >= 80 ? "text-emerald-400" : "text-amber-400"}>
                  {readyPct >= 80 ? "Tier-1 Ready" : "Skill Booster Assigned"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
