import React, { useState } from "react";
import { MetricCard } from "@/components/shared/MetricCard";
import { CandidatesPipeline } from "@/components/recruiter/CandidatesPipeline";
import { JobListingTable } from "@/components/recruiter/JobListingTable";
import { PostJobModal } from "@/components/recruiter/PostJobModal";
import { MOCK_CANDIDATES, MOCK_JOBS } from "@/lib/mockData";
import { Users, Briefcase, Plus, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RecruiterPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [isPostOpen, setIsPostOpen] = useState(false);

  const handleJobCreated = (newJob: any) => {
    setJobs([newJob, ...jobs]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3.5">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            alt="Priya Nair"
            className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-500/50 shadow-glow-cyan"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Priya Nair</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Microsoft India
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Principal Technical Recruiter • Campus Talent Acquisition Lead
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPostOpen(true)}
            icon={<Plus size={14} />}
          >
            Post Industry Opening
          </Button>
        </div>
      </div>

      {/* Recruiter Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Drives"
          value={jobs.length}
          subtext="2 Internships, 1 FTE"
          icon={<Briefcase size={18} />}
          iconBg="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
        />
        <MetricCard
          title="Total Applicants"
          value="84"
          trend={{ value: "+24 today", positive: true }}
          icon={<Users size={18} />}
          iconBg="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
        />
        <MetricCard
          title="Shortlisted Talent"
          value="18"
          subtext="Top Tier Vector Fit"
          icon={<Sparkles size={18} />}
          iconBg="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        />
        <MetricCard
          title="Offers Released"
          value="6"
          subtext="Acceptance rate: 100%"
          icon={<CheckCircle2 size={18} />}
          iconBg="bg-amber-500/15 text-amber-400 border border-amber-500/30"
        />
      </div>

      {/* Main Grid: Pipeline and Job Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CandidatesPipeline initialCandidates={MOCK_CANDIDATES} />
        </div>
        <div className="lg:col-span-5">
          <JobListingTable jobs={jobs} />
        </div>
      </div>

      <PostJobModal
        isOpen={isPostOpen}
        onClose={() => setIsPostOpen(false)}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
}
