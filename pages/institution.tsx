import React from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Building2,
  Mail,
  Award,
  Globe,
  MapPin,
  ShieldCheck,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function InstitutionDashboardPage() {
  const { user, logout } = useAuth();
  const profile = user?.institutionProfile;

  return (
    <AuthGuard allowedRoles={["INSTITUTION"]}>
      <div className="space-y-6 max-w-5xl mx-auto py-4">
        {/* Header Profile Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Institution")}`
              }
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{user?.name}</h1>
                <Badge variant="success" size="md">
                  <Building2 size={13} /> Institution / TPO Portal
                </Badge>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> {user?.email}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> Accredited Institutional Account
                </span>
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={logout} icon={<LogOut size={14} />}>
            Sign Out
          </Button>
        </div>

        {/* Institution Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={14} className="text-emerald-400" /> Institution Name
            </span>
            <h3 className="text-base font-bold text-white">
              {profile?.institutionName || "National Institute of Technology (NIT)"}
            </h3>
            <p className="text-xs text-slate-400">{profile?.code || "NIT-01"}</p>
          </Card>

          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} className="text-indigo-400" /> Institution Category
            </span>
            <h3 className="text-base font-bold text-white">
              {profile?.institutionType || "Tier-1 Institute (IIT/NIT/IIIT)"}
            </h3>
            <p className="text-xs text-slate-400">NIRF Ranked #{profile?.nirfRank || 9}</p>
          </Card>

          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} className="text-cyan-400" /> Location / Campus
            </span>
            <h3 className="text-base font-bold text-white">
              {profile?.city || "Tiruchirappalli"}, {profile?.state || "Tamil Nadu"}
            </h3>
            <p className="text-xs text-slate-400">Central Government Institution</p>
          </Card>
        </div>

        {/* Phase 2 Status Notice */}
        <Card className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent-cyan w-5 h-5" />
            <h3 className="text-base font-bold text-white">Phase 2: Institution Admin Authentication Active</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your institutional credentials and TPO administrator session have been authorized. Future phases will introduce branch-wise placement readiness heatmaps, talent supply vs market demand benchmarking, and automated NAAC/NIRF audit exports.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Active Role:</span>
            <Badge variant="success" size="sm">INSTITUTION</Badge>
            <span>•</span>
            <span className="font-semibold text-slate-200">Account ID:</span>
            <span className="font-mono text-[11px] text-slate-300">{user?.id}</span>
          </div>
        </Card>
      </div>
    </AuthGuard>
  );
}
