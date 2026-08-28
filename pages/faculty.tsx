import React from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Award,
  Mail,
  Building,
  BookOpen,
  UserCheck,
  ShieldCheck,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function FacultyDashboardPage() {
  const { user, logout } = useAuth();
  const profile = user?.facultyProfile;

  return (
    <AuthGuard allowedRoles={["FACULTY"]}>
      <div className="space-y-6 max-w-5xl mx-auto py-4">
        {/* Header Profile Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Faculty")}`
              }
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{user?.name}</h1>
                <Badge variant="warning" size="md">
                  <Award size={13} /> Faculty & Mentor Portal
                </Badge>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> {user?.email}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Institutional Mentor
                </span>
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={logout} icon={<LogOut size={14} />}>
            Sign Out
          </Button>
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building size={14} className="text-amber-400" /> Institution / College
            </span>
            <h3 className="text-base font-bold text-white">
              {profile?.institutionName || "National Institute of Technology (NIT)"}
            </h3>
            <p className="text-xs text-slate-400">NIRF Ranked Campus</p>
          </Card>

          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-indigo-400" /> Department
            </span>
            <h3 className="text-base font-bold text-white">
              {profile?.department || "Computer Science & Engineering"}
            </h3>
            <p className="text-xs text-slate-400">OBE Curriculum Committee</p>
          </Card>

          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck size={14} className="text-emerald-400" /> Academic Designation
            </span>
            <h3 className="text-base font-bold text-white">
              {profile?.designation || "Associate Professor & Industry Liaison"}
            </h3>
            <p className="text-xs text-slate-400">{profile?.specialization || "Distributed Systems & Cloud"}</p>
          </Card>
        </div>

        {/* Phase 2 Status Notice */}
        <Card className="p-6 rounded-2xl border border-amber-500/20 bg-amber-950/10 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent-cyan w-5 h-5" />
            <h3 className="text-base font-bold text-white">Phase 2: Faculty Role Authorization Active</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your faculty authentication and mentorship profile credentials have been confirmed. Upcoming phases will introduce 1-on-1 mentorship scheduling queues, capstone rubric evaluation, and industry-driven curriculum advisory telemetry.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Active Role:</span>
            <Badge variant="warning" size="sm">FACULTY</Badge>
            <span>•</span>
            <span className="font-semibold text-slate-200">Account ID:</span>
            <span className="font-mono text-[11px] text-slate-300">{user?.id}</span>
          </div>
        </Card>
      </div>
    </AuthGuard>
  );
}
