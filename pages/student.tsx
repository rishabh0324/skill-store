import React, { useState } from "react";
import { MetricCard } from "@/components/shared/MetricCard";
import { SkillRadarChart } from "@/components/student/SkillRadarChart";
import { RoadmapTimeline } from "@/components/student/RoadmapTimeline";
import { AssessmentCard } from "@/components/student/AssessmentCard";
import { JobMatchesList } from "@/components/student/JobMatchesList";
import {
  MOCK_SKILLS,
  MOCK_ASSESSMENTS,
  MOCK_ROADMAP,
  MOCK_JOBS,
} from "@/lib/mockData";
import {
  Sparkles,
  Award,
  Briefcase,
  Target,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function StudentPage() {
  const [skills, setSkills] = useState(MOCK_SKILLS);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("3");

  const handleAddSelfReportSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      category: "Technical" as const,
      proficiencyLevel: Number(newSkillLevel),
      verificationStatus: "SELF_REPORTED" as const,
      score: Number(newSkillLevel) * 20,
    };

    setSkills([...skills, newSkill]);
    setNewSkillName("");
    setIsAddSkillOpen(false);
  };

  const verifiedCount = skills.filter((s) => s.verificationStatus !== "SELF_REPORTED").length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3.5">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Aarav Sharma"
            className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500/50 shadow-glow"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Aarav Sharma</h2>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ShieldCheck size={11} /> Verified Portfolio
              </span>
            </div>
            <p className="text-xs text-slate-400">
              B.Tech Computer Science • National Institute of Technology • Class of 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="glass"
            size="sm"
            onClick={() => setIsAddSkillOpen(true)}
            icon={<Plus size={14} />}
          >
            Add Skill
          </Button>
          <a
            href="/p/aarav-sharma"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow transition-all"
          >
            <Sparkles size={13} />
            <span>View Public Profile</span>
          </a>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Placement Readiness"
          value="92%"
          trend={{ value: "+8% this month", positive: true }}
          icon={<Target size={18} />}
          iconBg="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
        />
        <MetricCard
          title="Verified Badges"
          value={`${verifiedCount} / ${skills.length}`}
          subtext="Outcome-Based (OBE)"
          icon={<Award size={18} />}
          iconBg="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        />
        <MetricCard
          title="Target Role Match"
          value="88%"
          subtext="Full-Stack AI Architect"
          icon={<Sparkles size={18} />}
          iconBg="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
        />
        <MetricCard
          title="Matched Openings"
          value={MOCK_JOBS.length}
          subtext="3 Direct Shortlists"
          icon={<Briefcase size={18} />}
          iconBg="bg-amber-500/15 text-amber-400 border border-amber-500/30"
        />
      </div>

      {/* Main Grid: Competency Radar & AI Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <SkillRadarChart skills={skills} />
        </div>
        <div className="lg:col-span-6">
          <RoadmapTimeline initialRoadmap={MOCK_ROADMAP} />
        </div>
      </div>

      {/* Available Skill Assessments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white">Skill Verification Assessments</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Take timed adaptive tests to earn verified badges visible to top recruiters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_ASSESSMENTS.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </div>
      </div>

      {/* AI-Matched Jobs */}
      <div>
        <JobMatchesList jobs={MOCK_JOBS} />
      </div>

      {/* Self-Report Skill Modal */}
      <Modal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        title="Add Self-Reported Competency"
        description="Self-reported skills will be tagged with a pending test to earn verification."
        maxWidth="md"
      >
        <form onSubmit={handleAddSelfReportSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kubernetes, Rust, GraphQL"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Self-Assessed Proficiency Level (1 to 5)
            </label>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs"
            >
              <option value="1" className="bg-slate-900">1 - Beginner / Fundamentals</option>
              <option value="2" className="bg-slate-900">2 - Elementary / Academic Projects</option>
              <option value="3" className="bg-slate-900">3 - Intermediate / Production Apps</option>
              <option value="4" className="bg-slate-900">4 - Advanced / High Proficiency</option>
              <option value="5" className="bg-slate-900">5 - Expert / Architect Level</option>
            </select>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddSkillOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Skill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
