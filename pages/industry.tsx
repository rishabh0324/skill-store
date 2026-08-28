import React from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Briefcase,
  Mail,
  Globe,
  Building,
  ShieldCheck,
  LogOut,
  Sparkles,
  Users,
} from "lucide-react";

export default function IndustryDashboardPage() {
  const { user, logout } = useAuth();
  const profile = user?.industryProfile;

  return (
    <AuthGuard allowedRoles={["INDUSTRY"]}>
      <div className="space-y-6 max-w-5xl mx-auto py-4">
        {/* Header Profile Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Recruiter")}`
              }
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500 shadow-glow-cyan"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{user?.name}</h1>
                <Badge variant="cyan" size="md">
                  <Briefcase size={13} /> Industry Partner Portal
                </Badge>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> {user?.email}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Corporate Partner
                </span>
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={logout} icon={<LogOut size={14} />}>
            Sign Out
          </Button>
        </div>

        {/* Corporate Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building size={14} className="text-cyan-400" /> Company / Organization
            </span>
            <h3 className="text-base font-bold text-white">
              {profile?.companyName || "Microsoft India / TechCorp"}
            </h3>
            <p className="text-xs text-slate-400">{profile?.domain || "Software & Cloud Systems"}</p>
          </Card>

          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe size={14} className="text-indigo-400" /> Company Website
            </span>
            <a
              href={profile?.companyWebsite || "https://example.com"}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-accent-cyan hover:underline truncate block"
            >
              {profile?.companyWebsite || "https://example.com"}
            </a>
            <p className="text-xs text-slate-400">Verified Corporate URL</p>
          </Card>

          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={14} className="text-emerald-400" /> Recruiter Designation
            </span>
            <h3 className="text-base font-bold text-white">
              {profile?.designation || "Principal Technical Recruiter"}
            </h3>
            <p className="text-xs text-slate-400">Campus Talent Acquisition</p>
          </Card>
        </div>

        {/* Phase 2 Status Notice */}
        <Card className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent-cyan w-5 h-5" />
            <h3 className="text-base font-bold text-white">Phase 2: Authentication & Role Verification Active</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your Industry recruiter session is authenticated and isolated. In subsequent phases, this dashboard will host the full skill-weighted job posting engine, ATS pipeline Kanban, and sub-50ms candidate vector matching.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Authenticated Role:</span>
            <Badge variant="cyan" size="sm">INDUSTRY</Badge>
            <span>•</span>
            <span className="font-semibold text-slate-200">Account ID:</span>
            <span className="font-mono text-[11px] text-slate-300">{user?.id}</span>
          </div>
        </Card>
      </div>
    </AuthGuard>
  );
}
