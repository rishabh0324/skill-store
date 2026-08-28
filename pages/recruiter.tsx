import React, { useState } from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { CandidatesPipeline } from "@/components/recruiter/CandidatesPipeline";
import { JobListingTable } from "@/components/recruiter/JobListingTable";
import { PostJobModal } from "@/components/recruiter/PostJobModal";
import { MetricCard } from "@/components/shared/MetricCard";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Briefcase,
  TrendingUp,
  Plus,
  Building,
} from "lucide-react";
import { MOCK_JOB_POSTINGS, MOCK_CANDIDATES } from "@/lib/mockData";
import { JobPostingItem } from "@/types";

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = useState<JobPostingItem[]>(MOCK_JOB_POSTINGS);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const handleCreateJob = (newJob: JobPostingItem) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  return (
    <AuthGuard allowedRoles={["INDUSTRY", "ADMIN"]}>
      <div className="space-y-6">
        {/* Recruiter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-semibold border border-accent-cyan/20">
                Corporate Recruiting Portal
              </span>
              <span className="text-xs text-slate-400">Microsoft India / TechCorp</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Campus Talent Acquisition Desk</h2>
            <p className="text-xs text-slate-300">
              Zero-latency vector competency matching with multi-factor weighted proficiency ranking.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsPostModalOpen(true)}
            icon={<Plus size={16} />}
          >
            Post Industry Opening
          </Button>
        </div>

        {/* Recruiter Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Drives"
            value={jobs.length}
            subtext="3 Technical Internships"
            icon={<Briefcase size={18} />}
            iconBg="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
          />
          <MetricCard
            title="Total Applicants"
            value="142"
            trend={{ value: "+18 today", positive: true }}
            icon={<Users size={18} />}
            iconBg="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
          />
          <MetricCard
            title="Top Vector Fit (>90%)"
            value="28"
            trend={{ value: "High Competency Fit", positive: true }}
            icon={<TrendingUp size={18} />}
            iconBg="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          />
          <MetricCard
            title="Shortlisted Pipeline"
            value="12"
            subtext="Ready for Tech Interview"
            icon={<Building size={18} />}
            iconBg="bg-amber-500/15 text-amber-400 border border-amber-500/30"
          />
        </div>

        {/* ATS Candidates Pipeline */}
        <CandidatesPipeline candidates={MOCK_CANDIDATES} />

        {/* Job Drives Table */}
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
