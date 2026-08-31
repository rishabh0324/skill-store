import React from "react";
import { SkillGapItemData } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Play,
  ArrowUpRight,
  ShieldCheck,
  Award,
} from "lucide-react";

interface SkillGapMatrixProps {
  gaps: SkillGapItemData[];
  onTakeAssessment?: (assessmentId: string) => void;
  onScrollToRoadmap?: () => void;
}

export const SkillGapMatrix: React.FC<SkillGapMatrixProps> = ({
  gaps,
  onTakeAssessment,
  onScrollToRoadmap,
}) => {
  if (!gaps || gaps.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-accent-cyan" />
            Comparative Skill-Gap Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Multi-dimensional vector gap evaluation comparing student verified competencies against corporate benchmark thresholds.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <CheckCircle2 size={13} /> Strengths ({gaps.filter((g) => g.gapStatus === "MATCHED").length})
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <AlertTriangle size={13} /> Moderate ({gaps.filter((g) => g.gapStatus === "MODERATE_GAP").length})
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-rose-400 font-semibold">
            <AlertOctagon size={13} /> Critical ({gaps.filter((g) => g.gapStatus === "CRITICAL_GAP").length})
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-3">Competency & Domain</th>
              <th className="py-3 px-3">Student Score</th>
              <th className="py-3 px-3">Industry Target</th>
              <th className="py-3 px-3">Gap Delta</th>
              <th className="py-3 px-3">Priority / Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {gaps.map((item, idx) => {
              const isPositive = item.gapDelta >= 0;
              const isCritical = item.gapStatus === "CRITICAL_GAP";
              const isModerate = item.gapStatus === "MODERATE_GAP";

              return (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>{item.skillName}</span>
                        {item.isMandatory && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                            Mandatory
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{item.category}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-extrabold ${
                          item.verificationStatus === "ASSESSMENT_VERIFIED"
                            ? "text-emerald-400"
                            : item.verificationStatus === "FACULTY_ENDORSED"
                            ? "text-amber-400"
                            : item.studentScore > 0
                            ? "text-indigo-300"
                            : "text-slate-500"
                        }`}
                      >
                        {item.studentScore > 0 ? `${item.studentScore}%` : "—"}
                      </span>
                      {item.verificationStatus === "ASSESSMENT_VERIFIED" && (
                        <span title="Assessment Verified"><ShieldCheck size={13} className="text-emerald-400" /></span>
                      )}
                      {item.verificationStatus === "FACULTY_ENDORSED" && (
                        <span title="Faculty Endorsed"><Award size={13} className="text-amber-400" /></span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 capitalize">
                      {item.verificationStatus.replace(/_/g, " ").toLowerCase()}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-bold text-cyan-300">{item.targetBenchmark}%</span>
                    <p className="text-[10px] text-slate-400">Weight: {item.weight}/5</p>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                        isPositive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : isCritical
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {isPositive ? `+${item.gapDelta}%` : `${item.gapDelta}%`}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    {isPositive ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 size={11} className="mr-1" /> Benchmark Met
                      </Badge>
                    ) : isCritical ? (
                      <Badge variant="danger" size="sm">
                        <AlertOctagon size={11} className="mr-1" /> Critical Gap
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        <AlertTriangle size={11} className="mr-1" /> Moderate Gap
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    {item.hasAssessment && item.assessmentId && onTakeAssessment ? (
                      <Button
                        variant={isPositive ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => onTakeAssessment(item.assessmentId!)}
                        icon={<Play size={11} />}
                      >
                        {isPositive ? "Retake Test" : "Verify Skill"}
                      </Button>
                    ) : onScrollToRoadmap ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onScrollToRoadmap}
                        icon={<ArrowUpRight size={12} />}
                      >
                        Milestone
                      </Button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
