import React from "react";
import { TargetRoleData } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Briefcase,
  TrendingUp,
  Cpu,
  Cloud,
  Brain,
  Layers,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface TargetRoleSelectorProps {
  roles: TargetRoleData[];
  selectedRoleId: string | null;
  onSelectRole: (roleId: string) => void;
  onGenerateRoadmap: (roleId: string) => void;
  isGenerating?: boolean;
}

export const TargetRoleSelector: React.FC<TargetRoleSelectorProps> = ({
  roles,
  selectedRoleId,
  onSelectRole,
  onGenerateRoadmap,
  isGenerating = false,
}) => {
  const getRoleIcon = (category: string, title: string) => {
    if (title.includes("AI") || category.includes("AI")) {
      return <Sparkles size={20} className="text-accent-cyan" />;
    }
    if (title.includes("DevOps") || category.includes("Cloud")) {
      return <Cloud size={20} className="text-indigo-400" />;
    }
    if (title.includes("Data") || title.includes("ML")) {
      return <Brain size={20} className="text-purple-400" />;
    }
    return <Cpu size={20} className="text-emerald-400" />;
  };

  return (
    <Card className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase size={18} className="text-primary-400" />
            Target Career Track & Benchmark Vectors
          </h3>
          <p className="text-xs text-slate-400">
            Select a target engineering profile to run multi-factor cosine vector gap matching against live corporate hiring benchmarks.
          </p>
        </div>
        <Badge variant="cyan" size="sm">
          {roles.length} Industry Tracks Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          const isCritical = role.industryDemandLevel === "CRITICAL";

          return (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between space-y-3 relative ${
                isSelected
                  ? "glass-panel border-2 border-primary-500 shadow-glow bg-primary-950/20"
                  : "glass-card border border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {getRoleIcon(role.category, role.title)}
                  </div>
                  <Badge
                    variant={isCritical ? "danger" : "purple"}
                    size="sm"
                  >
                    {role.industryDemandLevel} DEMAND
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">{role.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{role.description}</p>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="text-slate-400">Target CTC:</span>
                  <strong className="text-emerald-400 font-semibold">{role.avgSalaryRange}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  {role.requiredSkills.length} Vector Dimensions
                </span>

                <Button
                  variant={isSelected ? "primary" : "outline"}
                  size="sm"
                  disabled={isGenerating}
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateRoadmap(role.id);
                  }}
                  icon={
                    isGenerating && isSelected ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )
                  }
                >
                  {isSelected ? "Run AI Analysis" : "Select & Analyze"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
