import React, { useState, useEffect } from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { CandidatesPipeline } from "@/components/recruiter/CandidatesPipeline";
import { JobListingTable } from "@/components/recruiter/JobListingTable";
import { PostJobModal } from "@/components/recruiter/PostJobModal";
import {
  Briefcase,
  Mail,
  Globe,
  Building,
  ShieldCheck,
  LogOut,
  Sparkles,
  Users,
  Plus,
  TrendingUp,
  BrainCircuit,
  Filter,
} from "lucide-react";
import { JobPostingItem, CandidateItem } from "@/types";

export default function IndustryDashboardPage() {
  const { user, logout } = useAuth();
  const profile = user?.industryProfile;

  const [jobs, setJobs] = useState<JobPostingItem[]>([]);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsRes, candidatesRes] = await Promise.all([
        fetch("/api/v1/jobs"),
        fetch("/api/v1/applications"),
      ]);

      const jobsJson = await jobsRes.json();
      const candidatesJson = await candidatesRes.json();

      if (jobsJson.success && jobsJson.data?.jobs) {
        setJobs(jobsJson.data.jobs);
      }
      if (candidatesJson.success && candidatesJson.data?.candidates) {
        setCandidates(candidatesJson.data.candidates);
      }
    } catch (e) {
      console.error("Error loading recruiter telemetry:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateJob = async (newJobData: any) => {
    try {
      const res = await fetch("/api/v1/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJobData),
      });

      const json = await res.json();
      if (json.success) {
        await loadData();
      }
    } catch (e) {
      console.error("Error posting job opening:", e);
    }
  };

  const handleAdvanceCandidate = async (candidateId: string, nextStatus: string) => {
    try {
      const res = await fetch("/api/v1/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, status: nextStatus }),
      });

      const json = await res.json();
      if (json.success) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === candidateId || c.studentId === candidateId
              ? { ...c, status: nextStatus.toUpperCase() }
              : c
          )
        );
      }
    } catch (e) {
      console.error("Error advancing candidate:", e);
    }
  };

  const topFitCandidatesCount = candidates.filter(
    (c) => (c.matchScore || c.vectorMatchScore || 0) >= 85
  ).length;

  const shortlistedCount = candidates.filter(
    (c) =>
      c.status.toLowerCase() === "shortlisted" ||
      c.status.toLowerCase() === "technical_interview" ||
      c.status.toLowerCase() === "interview"
  ).length;

  return (
    <AuthGuard allowedRoles={["INDUSTRY", "ADMIN"]}>
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* Recruiter Header Profile Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Recruiter")}`
              }
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500 shadow-glow-cyan"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{user?.name}</h1>
                <Badge variant="cyan" size="md">
                  <Briefcase size={13} /> {profile?.companyName || "Microsoft India / TechCorp"}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-1">
                <span>{profile?.designation || "Principal Technical Recruiter"}</span>
                <span>•</span>
                <span className="text-slate-400">{profile?.domain || "Cloud & AI Platforms"}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Industry Partner
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPostModalOpen(true)}
              icon={<Plus size={15} />}
            >
              Post Industry Opening
            </Button>
            <Button variant="outline" size="sm" onClick={logout} icon={<LogOut size={13} />}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Recruiter Live Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Job Drives"
            value={jobs.length}
            subtext="Campus & Off-Campus Hiring"
            icon={<Briefcase size={18} />}
            iconBg="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
          />
          <MetricCard
            title="Total Applicants"
            value={candidates.length}
            trend={{ value: "+24 today", positive: true }}
            icon={<Users size={18} />}
            iconBg="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
          />
          <MetricCard
            title="Top Vector Matches (>85%)"
            value={topFitCandidatesCount}
            subtext="Tier-1 Verified Competency"
            icon={<BrainCircuit size={18} />}
            iconBg="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          />
          <MetricCard
            title="Shortlisted Pipeline"
            value={shortlistedCount}
            subtext="Ready for Tech Interview"
            icon={<TrendingUp size={18} />}
            iconBg="bg-amber-500/15 text-amber-400 border border-amber-500/30"
          />
        </div>

        {/* ATS Candidates Pipeline Tracker */}
        <CandidatesPipeline
          candidates={candidates}
          onAdvance={handleAdvanceCandidate}
        />

        {/* Active Job Drives Table */}
        <JobListingTable jobs={jobs} />

        {/* Post Job Modal */}
        <PostJobModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onJobCreated={handleCreateJob}
        />
      </div>
    </AuthGuard>
  );
}
