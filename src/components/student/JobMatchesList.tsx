"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JobPostingItem } from "@/types";
import { Briefcase, MapPin, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobMatchesListProps {
  jobs: JobPostingItem[];
}

export const JobMatchesList: React.FC<JobMatchesListProps> = ({ jobs }) => {
  const [jobList, setJobList] = useState(jobs);
  const [appliedIds, setAppliedIds] = useState<string[]>(["job-1", "job-2"]);

  const handleApply = (jobId: string) => {
    setAppliedIds((prev) => [...prev, jobId]);
  };

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">AI-Matched Opportunities</h3>
            <Badge variant="cyan" size="sm">
              <Sparkles size={11} /> Top Fit
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by multi-factor cosine vector similarity matching your verified competencies.
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {jobList.map((job) => {
          const isApplied = appliedIds.includes(job.id);
          return (
            <div
              key={job.id}
              className="p-4 rounded-xl glass-card border border-white/5 hover:border-white/15 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                    <Briefcase className="text-accent-cyan w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors">
                        {job.title}
                      </h4>
                      <Badge
                        variant={
                          job.matchScore >= 90 ? "success" : job.matchScore >= 80 ? "cyan" : "neutral"
                        }
                        size="sm"
                      >
                        {job.matchScore}% Match
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{job.companyName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isApplied ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 size={13} />
                      {job.applicationStatus || "Applied"}
                    </span>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleApply(job.id)}
                      icon={<ArrowRight size={13} />}
                    >
                      1-Click Apply
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-slate-500" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="font-semibold text-emerald-300">{job.stipendSalary}</span>
                <span>•</span>
                <span>Min CGPA: {job.minCgpa}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-white/5">
                {job.requiredSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                  >
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
