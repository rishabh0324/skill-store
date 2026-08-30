import React, { useState, useEffect } from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { PlacementTrendsChart } from "@/components/tpo/PlacementTrendsChart";
import { DepartmentBreakdown } from "@/components/tpo/DepartmentBreakdown";
import { AccreditationExportModal } from "@/components/tpo/AccreditationExportModal";
import {
  Building2,
  Mail,
  Award,
  Globe,
  MapPin,
  ShieldCheck,
  LogOut,
  Sparkles,
  Users,
  Briefcase,
  TrendingUp,
  Download,
  FileCheck,
} from "lucide-react";

export default function InstitutionDashboardPage() {
  const { user, logout } = useAuth();
  const profile = user?.institutionProfile;

  const [analytics, setAnalytics] = useState<any>(null);
  const [accreditation, setAccreditation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, accreditationRes] = await Promise.all([
        fetch("/api/v1/analytics"),
        fetch("/api/v1/analytics/accreditation"),
      ]);

      const [analyticsJson, accreditationJson] = await Promise.all([
        analyticsRes.json(),
        accreditationRes.json(),
      ]);

      if (analyticsJson.success && analyticsJson.data?.analytics) {
        setAnalytics(analyticsJson.data.analytics);
      }
      if (accreditationJson.success && accreditationJson.data?.accreditation) {
        setAccreditation(accreditationJson.data.accreditation);
      }
    } catch (e) {
      console.error("Error loading institutional analytics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AuthGuard allowedRoles={["INSTITUTION", "ADMIN"]}>
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* Header Profile Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Institution")}`
              }
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-glow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{profile?.institutionName || "National Institute of Technology"}</h1>
                <Badge variant="success" size="md">
                  <Building2 size={13} /> TPO & Dean Desk
                </Badge>
              </div>
              <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-1">
                <span>{profile?.institutionType || "Tier-1 Institute"}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> NIRF Ranked #{profile?.nirfRank || 9}
                </span>
                <span>•</span>
                <span className="text-slate-400">{profile?.city || "Tiruchirappalli"}, {profile?.state || "Tamil Nadu"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
              icon={<Download size={14} />}
            >
              Export NAAC / NIRF Reports
            </Button>
            <Button variant="outline" size="sm" onClick={logout} icon={<LogOut size={14} />}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* TPO Live Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Candidates Enrolled"
            value={analytics?.totalStudentsEnrolled || 540}
            subtext="Class of 2026 Cohort"
            icon={<Users size={18} />}
            iconBg="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
          />
          <MetricCard
            title="Campus Placement Rate"
            value={`${analytics?.overallPlacementRate || 88}%`}
            trend={{ value: "+12% YoY", positive: true }}
            icon={<TrendingUp size={18} />}
            iconBg="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          />
          <MetricCard
            title="Average Package CTC"
            value={analytics?.avgPackageCtc || "₹18.4 LPA"}
            subtext={`Highest: ${analytics?.highestPackageCtc || "₹45.0 LPA"}`}
            icon={<Award size={18} />}
            iconBg="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
          />
          <MetricCard
            title="Active Corporate Drives"
            value={analytics?.activeCorporateDrives || 12}
            subtext="Campus Placement Hub"
            icon={<Briefcase size={18} />}
            iconBg="bg-purple-500/15 text-purple-400 border border-purple-500/30"
          />
        </div>

        {/* Analytics Charts & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <PlacementTrendsChart
              data={analytics?.demandVsSupply || [
                { skill: "React / Next.js", industryDemand: 92, studentSupply: 78 },
                { skill: "Python / FastAPI", industryDemand: 88, studentSupply: 82 },
                { skill: "Docker & K8s", industryDemand: 85, studentSupply: 44 },
                { skill: "Vector DB & AI", industryDemand: 94, studentSupply: 52 },
                { skill: "PostgreSQL / ORM", industryDemand: 80, studentSupply: 75 },
                { skill: "DSA & Systems", industryDemand: 90, studentSupply: 86 },
              ]}
            />
          </div>

          <div className="lg:col-span-5">
            <DepartmentBreakdown
              departments={analytics?.departmentReadiness || [
                { department: "Computer Science & Engineering", total: 180, ready: 162, avgScore: 89 },
                { department: "Artificial Intelligence & Data Science", total: 120, ready: 104, avgScore: 87 },
                { department: "Information Technology", total: 140, ready: 118, avgScore: 84 },
                { department: "Electronics & Communication", total: 100, ready: 76, avgScore: 78 },
              ]}
            />
          </div>
        </div>

        {/* Accreditation Export Modal */}
        <AccreditationExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          accreditationData={accreditation}
        />
      </div>
    </AuthGuard>
  );
}
