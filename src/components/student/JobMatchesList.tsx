import React, { useState } from "react";
import { JobPostingItem } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building,
  ArrowRight,
  Clock,
} from "lucide-react";

interface JobMatchesListProps {
  jobs: JobPostingItem[];
  onApply?: (jobId: string) => Promise<void> | void;
}

export const JobMatchesList: React.FC<JobMatchesListProps> = ({
  jobs,
  onApply,
}) => {
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const handleApply = async (jobId: string) => {
    try {
      setApplyingId(jobId);
      if (onApply) {
        await onApply(jobId);
      }
    } catch (e) {
      console.error("Error applying for opening:", e);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <Card className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="text-accent-cyan" size={20} />
            AI-Matched Career & Placement Opportunities
          </h3>
          <p className="text-xs text-slate-400">
            Open hiring drives ranked by multi-dimensional cosine vector similarity matching your verified competencies.
          </p>
        </div>
        <Badge variant="cyan" size="sm">
          {jobs.length} Active Drives Matched
        </Badge>
      </div>

      <div className="space-y-3.5">
        {jobs.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No active job drives currently matching your criteria.
          </div>
        ) : (
          jobs.map((job) => {
            const isApplied = !!job.isApplied || !!job.applicationStatus;
            const score = job.matchScore ?? job.vectorMatchScore ?? 88;
            const isTopFit = score >= 90;
            const isApplying = applyingId === job.id;

            return (
              <div
                key={job.id}
                className="p-5 rounded-2xl glass-card border border-white/5 hover:border-primary-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                    <Briefcase className="text-accent-cyan w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white hover:text-primary-300 transition-colors">
                        {job.title}
                      </h4>
                      <Badge
                        variant={isTopFit ? "success" : score >= 80 ? "cyan" : "neutral"}
                        size="sm"
                      >
                        {score}% Vector Match
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        {job.type}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-300 font-semibold mt-0.5">
                      {job.companyName}
                    </p>

                    <p className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-slate-500" /> {job.location}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">
                        {job.stipendSalary || job.stipendOrSalary || "₹60,000/mo"}
                      </span>
                      <span>•</span>
                      <span>Min CGPA: {job.minCgpa || 7.5}</span>
                    </p>

                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {job.requiredSkills.map((s: any, idx: number) => {
                          const name = s.name || s.skillName || "Skill";
                          return (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300 font-mono"
                            >
                              {name} {s.isMandatory && <strong className="text-rose-400">*</strong>}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  {isApplied ? (
                    <Badge variant="success" size="md">
                      <CheckCircle2 size={13} className="mr-1" /> Applied ({job.applicationStatus || "In Review"})
                    </Badge>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isApplying}
                      isLoading={isApplying}
                      onClick={() => handleApply(job.id)}
                      icon={<ArrowRight size={13} />}
                    >
                      1-Click Apply
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
