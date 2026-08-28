import React from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Shield,
  Mail,
  Users,
  Building,
  Key,
  ShieldCheck,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6 max-w-5xl mx-auto py-4">
        {/* Header Profile Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Admin")}`
              }
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{user?.name}</h1>
                <Badge variant="purple" size="md">
                  <Shield size={13} /> System Administrator
                </Badge>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> {user?.email}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> Root Security Clearance
                </span>
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={logout} icon={<LogOut size={14} />}>
            Sign Out
          </Button>
        </div>

        {/* System Administration Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={14} className="text-purple-400" /> Managed Roles
            </span>
            <h3 className="text-base font-bold text-white">4 Primary Stakeholders</h3>
            <p className="text-xs text-slate-400">Student, Industry, Faculty, Institution</p>
          </Card>

          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key size={14} className="text-cyan-400" /> Security Protocol
            </span>
            <h3 className="text-base font-bold text-white">JWT + Bcrypt (Salt: 10)</h3>
            <p className="text-xs text-slate-400">HTTP-Only SameSite Cookie</p>
          </Card>

          <Card className="p-5 space-y-2 border border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building size={14} className="text-emerald-400" /> Database Status
            </span>
            <h3 className="text-base font-bold text-white">Prisma Client Synchronized</h3>
            <p className="text-xs text-slate-400">SQLite / PostgreSQL Ready</p>
          </Card>
        </div>

        {/* Phase 2 Status Notice */}
        <Card className="p-6 rounded-2xl border border-purple-500/20 bg-purple-950/10 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent-cyan w-5 h-5" />
            <h3 className="text-base font-bold text-white">Phase 2: Master Governance & RBAC Foundation Complete</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All user authentication endpoints, role verification guards, and profile entity mappings are functioning securely. Platform administrators have system-wide authority across user records and audit logs.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Active Role:</span>
            <Badge variant="purple" size="sm">ADMIN</Badge>
            <span>•</span>
            <span className="font-semibold text-slate-200">Account ID:</span>
            <span className="font-mono text-[11px] text-slate-300">{user?.id}</span>
          </div>
        </Card>
      </div>
    </AuthGuard>
  );
}
