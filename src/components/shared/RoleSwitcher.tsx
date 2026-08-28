import React, { useState } from "react";
import { useRouter } from "next/router";
import { UserRole } from "@/types";
import { GraduationCap, Briefcase, Award, Building2, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES: { role: UserRole; label: string; path: string; icon: any; color: string }[] = [
  {
    role: "STUDENT",
    label: "Student (Aarav)",
    path: "/student",
    icon: GraduationCap,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  },
  {
    role: "RECRUITER",
    label: "Recruiter (Microsoft)",
    path: "/recruiter",
    icon: Briefcase,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  },
  {
    role: "FACULTY",
    label: "Faculty / Mentor",
    path: "/faculty",
    icon: Award,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  {
    role: "TPO_ADMIN",
    label: "TPO & Institute Admin",
    path: "/tpo",
    icon: Building2,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
];

export const RoleSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = router.pathname || "";
  const [isOpen, setIsOpen] = useState(false);

  const currentRole = ROLES.find((r) => pathname.startsWith(r.path)) || ROLES[0];

  const handleSelectRole = (r: typeof ROLES[0]) => {
    setIsOpen(false);
    router.push(r.path);
  };

  const Icon = currentRole.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-card border border-white/10 text-xs font-medium text-slate-200 hover:text-white hover:border-primary-400/50 transition-all shadow-sm"
      >
        <span className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold text-[10px] uppercase tracking-wider">
          Demo Role
        </span>
        <Icon size={15} className={currentRole.color.split(" ")[0]} />
        <span>{currentRole.label}</span>
        <ChevronDown size={14} className={cn("transition-transform duration-200 text-slate-400", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl p-1.5 shadow-2xl z-50 border border-white/15 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 mb-1">
              Switch Live Persona
            </div>
            {ROLES.map((r) => {
              const RoleIcon = r.icon;
              const isSelected = r.role === currentRole.role;
              return (
                <button
                  key={r.role}
                  onClick={() => handleSelectRole(r)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all text-left group",
                    isSelected
                      ? "bg-primary-500/20 text-white font-medium border border-primary-500/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1 rounded-md border", r.color)}>
                      <RoleIcon size={14} />
                    </div>
                    <span>{r.label}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-primary-400" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
