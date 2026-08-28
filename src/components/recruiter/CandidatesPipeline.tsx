"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CandidateItem } from "@/types";
import {
  Users,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Mail,
  GraduationCap,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidatesPipelineProps {
  initialCandidates: CandidateItem[];
}

export const CandidatesPipeline: React.FC<CandidatesPipelineProps> = ({ initialCandidates }) => {
  const [candidates, setCandidates] = useState<CandidateItem[]>(initialCandidates);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const handleAdvanceStatus = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const nextStatus: Record<string, CandidateItem["status"]> = {
            APPLIED: "UNDER_REVIEW",
            UNDER_REVIEW: "SHORTLISTED",
            SHORTLISTED: "INTERVIEW_SCHEDULED",
            INTERVIEW_SCHEDULED: "OFFERED",
            OFFERED: "OFFERED",
          };
          return { ...c, status: nextStatus[c.status] || "OFFERED" };
        }
        return c;
      })
    );
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "ALL" || c.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Card className="h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">AI-Ranked Candidate Pipeline</h3>
            <Badge variant="cyan" size="sm">
              <Sparkles size={11} /> Vector Matched
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Candidates ranked by skill overlap, verified assessment performance, and academic criteria.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {["ALL", "SHORTLISTED", "UNDER_REVIEW", "APPLIED"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0",
                activeFilter === f
                  ? "bg-primary-500 text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              )}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search candidates by name, skill, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs"
        />
      </div>

      <div className="space-y-3">
        {filteredCandidates.map((cand) => (
          <div
            key={cand.id}
            className="p-4 rounded-xl glass-card border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-3.5">
              <img
                src={cand.avatarUrl}
                alt={cand.name}
                className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors">
                    {cand.name}
                  </h4>
                  <Badge
                    variant={
                      cand.matchScore >= 90 ? "success" : cand.matchScore >= 80 ? "cyan" : "warning"
                    }
                    size="sm"
                  >
                    {cand.matchScore}% Match
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{cand.department}</span>
                  <span>•</span>
                  <span className="text-slate-300 font-semibold">CGPA: {cand.cgpa}</span>
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cand.skills.map((s, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300 flex items-center gap-1"
                    >
                      {s.name}
                      {s.verified && <CheckCircle size={10} className="text-emerald-400" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
              <Badge
                variant={
                  cand.status === "SHORTLISTED"
                    ? "success"
                    : cand.status === "UNDER_REVIEW"
                    ? "warning"
                    : "neutral"
                }
                size="md"
              >
                {cand.status.replace("_", " ")}
              </Badge>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAdvanceStatus(cand.id)}
                icon={<ChevronRight size={14} />}
              >
                Advance
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
