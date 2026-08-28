import React from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { PlacementTrendsChart } from "@/components/tpo/PlacementTrendsChart";
import { DepartmentBreakdown } from "@/components/tpo/DepartmentBreakdown";
import { MetricCard } from "@/components/shared/MetricCard";
import { Button } from "@/components/ui/Button";
import {
  Users,
  TrendingUp,
  Building2,
  Award,
  Download,
  Filter,
} from "lucide-react";
import { MOCK_ANALYTICS } from "@/lib/mockData";

export default function TpoDashboardPage() {
  const exportAuditReport = () => {
    alert("NAAC Criterion 5 & NIRF Placement Compliance CSV generated successfully.");
  };

  return (
    <AuthGuard allowedRoles={["INSTITUTION", "ADMIN"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-semibold border border-accent-cyan/20">
                Institutional TPO Center
              </span>
              <span className="text-xs text-slate-400">Class of 2026</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              National Institute of Technology • Placement Intelligence
            </h2>
            <p className="text-xs text-slate-300">
              Real-time competency supply vs recruiter demand analytics aligned with NEP 2020 & Outcome-Based Education.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={exportAuditReport}
              icon={<Download size={14} />}
            >
              Export NAAC / NIRF Audit
            </Button>
          </div>
        </div>

        {/* High-Level Institutional KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Students Tracked"
            value={MOCK_ANALYTICS.totalStudents.toLocaleString()}
            subtext="Across 4 Engineering Branches"
            icon={<Users size={18} />}
            iconBg="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
          />
          <MetricCard
            title="Placement Readiness"
            value={`${MOCK_ANALYTICS.placementReadyPercentage || 84.5}%`}
            trend={{ value: "+12.4% vs 2025", positive: true }}
            icon={<TrendingUp size={18} />}
            iconBg="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          />
          <MetricCard
            title="Active Recruiters"
            value={MOCK_ANALYTICS.activeRecruiters || 48}
            subtext="Top Tier Tech & Core"
            icon={<Building2 size={18} />}
            iconBg="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
          />
          <MetricCard
            title="Total Offers"
            value={MOCK_ANALYTICS.totalOffers || 342}
            trend={{ value: "+28% YoY Growth", positive: true }}
            icon={<Award size={18} />}
            iconBg="bg-amber-500/15 text-amber-400 border border-amber-500/30"
          />
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <PlacementTrendsChart data={MOCK_ANALYTICS.skillDemandVsSupply || []} />
          </div>
          <div className="lg:col-span-6">
            <DepartmentBreakdown departments={(MOCK_ANALYTICS.departmentReadiness as any) || []} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
