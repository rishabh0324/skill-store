import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  barClassName?: string;
  variant?: "primary" | "cyan" | "emerald" | "amber" | "gradient";
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  barClassName,
  variant = "gradient",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantGradients = {
    primary: "bg-indigo-500",
    cyan: "bg-cyan-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    gradient: "bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400",
  };

  return (
    <div className={cn("w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5", className)}>
      <div
        className={cn("h-full transition-all duration-500 rounded-full", variantGradients[variant], barClassName)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
