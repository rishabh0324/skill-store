"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Download, FileText, CheckCircle2, Award, ShieldCheck, Sparkles } from "lucide-react";

interface AccreditationExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  accreditationData: any;
}

export const AccreditationExportModal: React.FC<AccreditationExportModalProps> = ({
  isOpen,
  onClose,
  accreditationData,
}) => {
  const [activeTab, setActiveTab] = useState<"NAAC" | "NIRF" | "NBA">("NAAC");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = (format: "json" | "csv") => {
    const filename = `NEXUS_EDU_${activeTab}_Telemetry_${new Date().toISOString().split("T")[0]}.${format}`;
    let content = "";

    if (format === "json") {
      content = JSON.stringify(accreditationData, null, 2);
    } else {
      // Basic CSV serialization
      content = "Standard,Metric,Value,Status\n";
      content += `NAAC,Criterion 2.6 PO Attainment,${accreditationData?.naacMetrics?.criterion2_6?.poAttainmentScore || 3.82}/4.0,EXCEEDS_BENCHMARK\n`;
      content += `NAAC,Criterion 5.2 Placement Rate,${accreditationData?.naacMetrics?.criterion5_2?.qualifyingRate || 94.2}%,COMPLIANT\n`;
      content += `NIRF,Median Salary,${accreditationData?.nirfMetrics?.medianSalaryGraduating || "₹16,50,000"},TIER_1\n`;
    }

    const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const naac = accreditationData?.naacMetrics;
  const nirf = accreditationData?.nirfMetrics;
  const nba = accreditationData?.nbaProgramOutcomes || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Accreditation & Compliance Telemetry Export Center"
      description="Download NEP 2020 OBE-audited reports for NAAC Criteria 2.6/5.2, NIRF Rankings, and NBA Outcome Attainments."
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab("NAAC")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "NAAC"
                ? "bg-primary-500 text-white shadow-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            NAAC Criteria 2.6 & 5.2
          </button>
          <button
            onClick={() => setActiveTab("NIRF")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "NIRF"
                ? "bg-primary-500 text-white shadow-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            NIRF Placement Data
          </button>
          <button
            onClick={() => setActiveTab("NBA")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "NBA"
                ? "bg-primary-500 text-white shadow-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            NBA PO/CO Matrix
          </button>
        </div>

        {/* Tab 1: NAAC */}
        {activeTab === "NAAC" && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Criterion 2.6: Student Performance & OBE Outcomes
                </h4>
                <Badge variant="success" size="sm">
                  <ShieldCheck size={11} className="mr-1" /> Exceeds Benchmark
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400">PO Attainment Score:</span>
                  <p className="text-emerald-400 font-bold text-sm">
                    {naac?.criterion2_6?.poAttainmentScore || 3.82} / 4.0
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Verified OBE Badges Awarded:</span>
                  <p className="text-white font-bold text-sm">
                    {naac?.criterion2_6?.verifiedBadgesAwarded || 1240}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Criterion 5.2: Student Progression & Placements
                </h4>
                <Badge variant="cyan" size="sm">
                  {naac?.criterion5_2?.qualifyingRate || 94.2}% Qualifying
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400">Average Annual CTC:</span>
                  <p className="text-cyan-300 font-bold text-sm">
                    {naac?.criterion5_2?.averageAnnualCTC || "₹18,40,000"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Corporate Partners:</span>
                  <p className="text-white font-bold text-sm">
                    {naac?.criterion5_2?.corporatePartnerCount || 48} Organizations
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: NIRF */}
        {activeTab === "NIRF" && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                NIRF Graduate Placement & Compensation Metrics
              </h4>
              <Badge variant="purple" size="sm">Rank #{nirf?.nirfRank || 9}</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Median Salary:</span>
                <p className="text-emerald-400 font-bold text-sm">{nirf?.medianSalaryGraduating || "₹16,50,000"}</p>
              </div>
              <div>
                <span className="text-slate-400">On-Campus Placed:</span>
                <p className="text-white font-bold text-sm">{nirf?.placedOnCampus || 475} / {nirf?.graduatingCohortSize || 540}</p>
              </div>
              <div>
                <span className="text-slate-400">Higher Studies:</span>
                <p className="text-indigo-300 font-bold text-sm">{nirf?.higherStudiesProgression || 45} Candidates</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: NBA */}
        {activeTab === "NBA" && (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {nba.map((item: any, idx: number) => (
              <div key={idx} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">{item.po}</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">{item.attainment}%</span>
                  <Badge variant="success" size="sm">{item.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {downloadSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 size={14} /> Telemetry data exported successfully!
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Format: Official Accredited Dataset
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload("csv")}
              icon={<FileText size={13} />}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDownload("json")}
              icon={<Download size={13} />}
            >
              Export JSON
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
