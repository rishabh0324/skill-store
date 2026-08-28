import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "cyan" | "purple" | "neutral";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}) => {
  const variants = {
    primary: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
    purple: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
    neutral: "bg-slate-800 text-slate-300 border border-slate-700",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 font-medium rounded-md",
    md: "text-xs px-2.5 py-1 font-medium rounded-lg",
  };

  return (
    <span className={cn("inline-flex items-center gap-1 shrink-0", variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
