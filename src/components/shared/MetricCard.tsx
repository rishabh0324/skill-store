import React from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  icon: React.ReactNode;
  iconBg?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  trend,
  icon,
  iconBg = "bg-primary-500/10 text-primary-400 border border-primary-500/20",
}) => {
  return (
    <Card hoverEffect className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-extrabold text-white mt-1.5 tracking-tight group-hover:text-primary-300 transition-colors">
            {value}
          </h4>
        </div>
        <div className={cn("p-2.5 rounded-xl shrink-0 shadow-sm", iconBg)}>
          {icon}
        </div>
      </div>

      {(subtext || trend) && (
        <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "font-semibold px-1.5 py-0.5 rounded text-[11px]",
                trend.positive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-rose-500/15 text-rose-400"
              )}
            >
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-slate-400">{subtext}</span>}
        </div>
      )}
    </Card>
  );
};
