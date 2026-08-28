import React, { useState } from "react";
import { CandidateItem } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

interface CandidatesPipelineProps {
  candidates: CandidateItem[];
}

const STAGES = [
  { id: "all", label: "All Applicants" },
  { id: "applied", label: "Applied" },
  { id: "review", label: "Under Review" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interview", label: "Interview" },
  { id: "offered", label: "Offered" },
];

export const CandidatesPipeline: React.FC<CandidatesPipelineProps> = ({
  candidates: initialCandidates,
}) => {
  const [candidates, setCandidates] = useState<CandidateItem[]>(initialCandidates);
  const [activeStage, setActiveStage] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const advanceStage = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus =
            c.status.toLowerCase() === "applied"
              ? "review"
              : c.status.toLowerCase() === "review"
              ? "shortlisted"
              : c.status.toLowerCase() === "shortlisted"
              ? "interview"
              : c.status.toLowerCase() === "interview"
              ? "offered"
              : c.status;
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesStage =
      activeStage === "all" ||
      c.status.toLowerCase() === activeStage.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.department || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="text-accent-cyan" size={20} />
            AI-Ranked Applicant Pipeline
          </h3>
          <p className="text-xs text-slate-400">
            Ranked by multi-factor cosine vector similarity matching your job skill weights.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-9 pr-3 py-1.5 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Pipeline Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/5 scrollbar-none">
        {STAGES.map((stage) => {
          const count =
            stage.id === "all"
              ? candidates.length
              : candidates.filter(
                  (c) => c.status.toLowerCase() === stage.id.toLowerCase()
                ).length;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeStage === stage.id
                  ? "bg-primary-500 text-white shadow-glow"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{stage.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Candidate List */}
      <div className="space-y-3">
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No candidates in this pipeline stage.
          </div>
        ) : (
          filteredCandidates.map((cand) => {
            const score = cand.matchScore || cand.vectorMatchScore || 85;
            return (
              <div
                key={cand.id}
                className="p-4 rounded-2xl glass-card border border-white/5 hover:border-primary-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={
                      cand.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cand.name)}`
                    }
                    alt={cand.name}
                    className="w-11 h-11 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white hover:text-primary-300 transition-colors">
                        {cand.name}
                      </h4>
                      <Badge
                        variant={
                          score >= 90 ? "success" : score >= 80 ? "cyan" : "warning"
                        }
                        size="sm"
                      >
                        {score}% Match
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{cand.department || cand.degree}</span>
                      <span>•</span>
                      <span className="text-slate-300 font-semibold">CGPA: {cand.cgpa}</span>
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(cand.skills || cand.verifiedSkills || []).map((s: any, i: number) => {
                        const skillName = typeof s === "string" ? s : s?.name || "Skill";
                        const isVerified = typeof s === "object" ? s?.verified : true;
                        return (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300 flex items-center gap-1"
                          >
                            {skillName}
                            {isVerified && <CheckCircle size={10} className="text-emerald-400" />}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Link href={`/p/${cand.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button variant="ghost" size="sm" icon={<ExternalLink size={13} />}>
                      Verified Portfolio
                    </Button>
                  </Link>
                  {cand.status.toLowerCase() !== "offered" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => advanceStage(cand.id)}
                      icon={<ArrowRight size={13} />}
                    >
                      Advance
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
