import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = true,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 md:p-6 transition-all duration-300",
        glass ? (hoverEffect ? "glass-card" : "glass-panel") : "bg-slate-900 border border-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
