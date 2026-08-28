import React from "react";
import { MetricCard } from "@/components/shared/MetricCard";
import { PlacementTrendsChart } from "@/components/tpo/PlacementTrendsChart";
import { DepartmentBreakdown } from "@/components/tpo/DepartmentBreakdown";
import { MOCK_ANALYTICS } from "@/lib/mockData";
import { Building2, Users, Award, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TpoPage() {
  const handleExportNaac = () => {
    alert("Exporting NAAC Criterion 5 & NIRF Placement Analytics Summary CSV...");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3.5">
          <img
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
            alt="Prof. S. Meenakshi"
            className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Prof. S. Meenakshi</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                TPO & Dean of Industry Relations
              </span>
            </div>
            <p className="text-xs text-slate-400">
              National Institute of Technology (NIT) • NIRF Rank #9
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportNaac}
            icon={<Download size={14} />}
          >
            Export NAAC / NIRF Audit
          </Button>
        </div>
      </div>

      {/* Institutional KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Cohort Size"
          value={MOCK_ANALYTICS.totalStudents}
          subtext="Graduating Batch 2026"
          icon={<Users size={18} />}
          iconBg="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
        />
        <MetricCard
          title="Placement Readiness"
          value={`${MOCK_ANALYTICS.placementReadyPercentage}%`}
          trend={{ value: "+12.4% vs 2025", positive: true }}
          icon={<TrendingUp size={18} />}
          iconBg="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        />
        <MetricCard
          title="Active Recruiters"
          value={MOCK_ANALYTICS.activeRecruiters}
          subtext="Top Tier Tech & Core"
          icon={<Building2 size={18} />}
          iconBg="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
        />
        <MetricCard
          title="Total Offers"
          value={MOCK_ANALYTICS.totalOffers}
          trend={{ value: "+28% YoY Growth", positive: true }}
          icon={<Award size={18} />}
          iconBg="bg-amber-500/15 text-amber-400 border border-amber-500/30"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <PlacementTrendsChart data={MOCK_ANALYTICS.skillDemandVsSupply} />
        </div>
        <div className="lg:col-span-6">
          <DepartmentBreakdown departments={MOCK_ANALYTICS.departmentReadiness} />
        </div>
      </div>
    </div>
  );
}
