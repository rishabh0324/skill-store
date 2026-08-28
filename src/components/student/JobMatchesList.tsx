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
} from "lucide-react";

interface JobMatchesListProps {
  jobs: JobPostingItem[];
}

export const JobMatchesList: React.FC<JobMatchesListProps> = ({ jobs }) => {
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const handleApply = (jobId: string) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs((prev) => [...prev, jobId]);
    }
  };

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="text-accent-cyan" size={20} />
            AI-Matched Opportunities
          </h3>
          <p className="text-xs text-slate-400">
            Ranked by multi-factor cosine vector similarity matching your verified competencies.
          </p>
        </div>
        <Badge variant="cyan" size="sm">
          {jobs.length} Matches Found
        </Badge>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => {
          const isApplied = appliedJobs.includes(job.id) || job.applicationStatus === "APPLIED";
          const score = job.matchScore ?? job.vectorMatchScore ?? 88;

          return (
            <div
              key={job.id}
              className="p-4 rounded-2xl glass-card border border-white/5 hover:border-primary-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                  <Briefcase className="text-accent-cyan w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors">
                      {job.title}
                    </h4>
                    <Badge
                      variant={
                        score >= 90 ? "success" : score >= 80 ? "cyan" : "neutral"
                      }
                      size="sm"
                    >
                      {score}% Match
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{job.companyName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right hidden md:block mr-2">
                  <p className="text-xs font-semibold text-white">
                    {job.stipendSalary || job.stipendOrSalary || "₹45,000/mo"}
                  </p>
                  <p className="text-[10px] text-slate-400">{job.location}</p>
                </div>

                <Button
                  variant={isApplied ? "outline" : "primary"}
                  size="sm"
                  disabled={isApplied}
                  onClick={() => handleApply(job.id)}
                  icon={
                    isApplied ? (
                      <CheckCircle2 size={13} className="text-emerald-400" />
                    ) : undefined
                  }
                >
                  {isApplied ? "Applied" : "1-Click Apply"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
