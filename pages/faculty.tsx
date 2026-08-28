import React from "react";
import { MetricCard } from "@/components/shared/MetricCard";
import { MentorshipSchedule } from "@/components/faculty/MentorshipSchedule";
import { CurriculumAdvisory } from "@/components/faculty/CurriculumAdvisory";
import { MOCK_MENTORSHIPS } from "@/lib/mockData";
import { Award, Users, Calendar, Sparkles } from "lucide-react";

export default function FacultyPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3.5">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            alt="Dr. Ramesh Verma"
            className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Dr. Ramesh Verma</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Faculty & Mentor
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Associate Professor • Dept of Computer Science & Engineering • NIT
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Mentees"
          value="34"
          subtext="Assigned Students"
          icon={<Users size={18} />}
          iconBg="bg-amber-500/15 text-amber-400 border border-amber-500/30"
        />
        <MetricCard
          title="Mentorship Hours"
          value="48 hrs"
          trend={{ value: "+12 hrs this sem", positive: true }}
          icon={<Calendar size={18} />}
          iconBg="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
        />
        <MetricCard
          title="Project Badges Endorsed"
          value="52"
          subtext="Outcome-Based Rubrics"
          icon={<Award size={18} />}
          iconBg="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        />
        <MetricCard
          title="Curriculum Recommendations"
          value="3"
          subtext="Industry Feedback Loop"
          icon={<Sparkles size={18} />}
          iconBg="bg-purple-500/15 text-purple-400 border border-purple-500/30"
        />
      </div>

      {/* Main Grid: Mentorship Sessions and Curriculum Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <MentorshipSchedule sessions={MOCK_MENTORSHIPS} />
        </div>
        <div className="lg:col-span-6">
          <CurriculumAdvisory />
        </div>
      </div>
    </div>
  );
}
