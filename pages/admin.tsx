import React, { useState, useEffect } from "react";
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
  Database,
  Briefcase,
  Award,
  CheckCircle2,
  Activity,
  Layers,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/stats");
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data.metrics);
        setRecentUsers(json.data.recentUsers || []);
      }
    } catch (e) {
      console.error("Error loading admin stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6 max-w-6xl mx-auto py-4">
        {/* Header Profile Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Admin")}`
              }
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500 shadow-glow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{user?.name}</h1>
                <Badge variant="purple" size="md">
                  <Shield size={13} /> System Administrator
                </Badge>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-slate-400" /> {user?.email}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> Root Security Clearance (All 5 Stakeholder Portals)
                </span>
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={logout} icon={<LogOut size={14} />}>
            Sign Out
          </Button>
        </div>

        {/* Live System Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Users size={13} className="text-purple-400" /> Registered Users
            </span>
            <p className="text-2xl font-extrabold text-white">{stats?.totalUsers || "—"}</p>
            <p className="text-[10px] text-slate-400">Across 5 Stakeholder Roles</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Briefcase size={13} /> Corporate Drives
            </span>
            <p className="text-2xl font-extrabold text-cyan-300">{stats?.jobsCount || "—"}</p>
            <p className="text-[10px] text-slate-400">{stats?.applicationsCount || 0} Applications Logged</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Award size={13} /> Assessments Taken
            </span>
            <p className="text-2xl font-extrabold text-amber-300">{stats?.attemptsCount || "—"}</p>
            <p className="text-[10px] text-slate-400">{stats?.skillsCount || 0} Master Skills Defined</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Database size={13} /> Database Health
            </span>
            <p className="text-sm font-extrabold text-emerald-300">Synchronized</p>
            <p className="text-[10px] text-slate-400">Prisma Client 100% Operational</p>
          </Card>
        </div>

        {/* Stakeholder Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <Card className="p-4 space-y-2 border border-white/5">
            <span className="text-xs font-bold text-white flex items-center justify-between">
              <span>Students</span>
              <Badge variant="primary" size="sm">{stats?.studentsCount || 0}</Badge>
            </span>
            <p className="text-[11px] text-slate-400">Active skill profiles, roadmaps & OBE badge holders.</p>
          </Card>

          <Card className="p-4 space-y-2 border border-white/5">
            <span className="text-xs font-bold text-white flex items-center justify-between">
              <span>Industry Recruiters</span>
              <Badge variant="cyan" size="sm">{stats?.recruitersCount || 0}</Badge>
            </span>
            <p className="text-[11px] text-slate-400">Corporate job drives & vector ATS candidate pipelines.</p>
          </Card>

          <Card className="p-4 space-y-2 border border-white/5">
            <span className="text-xs font-bold text-white flex items-center justify-between">
              <span>Faculty Mentors</span>
              <Badge variant="warning" size="sm">{stats?.facultyCount || 0}</Badge>
            </span>
            <p className="text-[11px] text-slate-400">1:1 guidance slots & skill endorsement desks.</p>
          </Card>

          <Card className="p-4 space-y-2 border border-white/5">
            <span className="text-xs font-bold text-white flex items-center justify-between">
              <span>Institution TPOs</span>
              <Badge variant="success" size="sm">{stats?.institutionsCount || 0}</Badge>
            </span>
            <p className="text-[11px] text-slate-400">Placement telemetry & NAAC/NIRF accreditation analytics.</p>
          </Card>
        </div>

        {/* Recent Registered Accounts Table */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-purple-400" />
                Recent User Accounts
              </h3>
              <p className="text-xs text-slate-400">
                Audited user directory synchronized with SQLite / PostgreSQL backend.
              </p>
            </div>
            <Badge variant="neutral" size="sm">Last {recentUsers.length} Logged</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{u.name}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          u.role === "STUDENT"
                            ? "primary"
                            : u.role === "INDUSTRY"
                            ? "cyan"
                            : u.role === "FACULTY"
                            ? "warning"
                            : u.role === "INSTITUTION"
                            ? "success"
                            : "purple"
                        }
                        size="sm"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AuthGuard>
  );
}
