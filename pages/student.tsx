import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkillRadarChart } from "@/components/student/SkillRadarChart";
import { ProctoredAssessmentModal } from "@/components/student/ProctoredAssessmentModal";
import { AddSkillModal } from "@/components/student/AddSkillModal";
import { SkillGapMatrix } from "@/components/student/SkillGapMatrix";
import { TargetRoleSelector } from "@/components/student/TargetRoleSelector";
import { RoadmapTimeline } from "@/components/student/RoadmapTimeline";
import { JobMatchesList } from "@/components/student/JobMatchesList";
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Timer,
  Play,
  Layers,
  ArrowRight,
  TrendingUp,
  Target,
  BarChart3,
  Compass,
  AlertTriangle,
  AlertOctagon,
  BrainCircuit,
  Briefcase,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();
  const profile = user?.studentProfile;

  // Active View Tab: "ROADMAP_GAP" | "JOB_MATCHES" | "SKILL_MATRIX"
  const [activeTab, setActiveTab] = useState<"ROADMAP_GAP" | "JOB_MATCHES" | "SKILL_MATRIX">("ROADMAP_GAP");

  const [skills, setSkills] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [targetRoles, setTargetRoles] = useState<any[]>([]);
  const [roadmapData, setRoadmapData] = useState<any | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [skillsRes, assessmentsRes, rolesRes, roadmapRes, jobsRes] = await Promise.all([
        fetch("/api/v1/skills"),
        fetch("/api/v1/assessments"),
        fetch("/api/v1/roadmaps/targets"),
        fetch("/api/v1/roadmaps"),
        fetch("/api/v1/jobs"),
      ]);

      const [skillsJson, assessmentsJson, rolesJson, roadmapJson, jobsJson] = await Promise.all([
        skillsRes.json(),
        assessmentsRes.json(),
        rolesRes.json(),
        roadmapRes.json(),
        jobsRes.json(),
      ]);

      if (skillsJson.success && skillsJson.data) {
        setSkills(skillsJson.data);
      }
      if (assessmentsJson.success && assessmentsJson.data) {
        setAssessments(assessmentsJson.data);
      }
      if (rolesJson.success && rolesJson.data) {
        setTargetRoles(rolesJson.data);
      }
      if (roadmapJson.success && roadmapJson.data?.roadmap) {
        setRoadmapData(roadmapJson.data.roadmap);
        if (roadmapJson.data.roadmap.targetRoleId) {
          setSelectedRoleId(roadmapJson.data.roadmap.targetRoleId);
        } else if (rolesJson.data && rolesJson.data.length > 0) {
          setSelectedRoleId(rolesJson.data[0].id);
        }
      }
      if (jobsJson.success && jobsJson.data?.jobs) {
        setJobs(jobsJson.data.jobs);
      }
    } catch (e) {
      console.error("Error loading student telemetry:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateRoadmap = async (roleId: string) => {
    try {
      setIsGeneratingRoadmap(true);
      setSelectedRoleId(roleId);

      const res = await fetch("/api/v1/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRoleId: roleId }),
      });

      const json = await res.json();
      if (json.success && json.data?.roadmap) {
        setRoadmapData(json.data.roadmap);
      }
    } catch (e) {
      console.error("Error generating roadmap:", e);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleStepToggle = async (stepId: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/v1/roadmaps/steps/${stepId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });

      const json = await res.json();
      if (json.success && json.data?.roadmap) {
        setRoadmapData((prev: any) => ({
          ...prev,
          progressPercent: json.data.roadmap.progressPercent,
          steps: json.data.roadmap.steps,
        }));
      }
    } catch (e) {
      console.error("Error updating milestone:", e);
    }
  };

  const handleApplyJob = async (jobId: string) => {
    try {
      const res = await fetch("/api/v1/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const json = await res.json();
      if (json.success) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobId ? { ...j, isApplied: true, applicationStatus: "APPLIED" } : j
          )
        );
      }
    } catch (e) {
      console.error("Error applying for job opening:", e);
    }
  };

  const handleLaunchAssessment = (testId: string) => {
    setActiveTestId(testId);
    setIsTestModalOpen(true);
  };

  const verifiedSkillsCount = skills.filter((s) => s.isVerified || !!s.verifiedScore).length;
  const verifiedBadges = skills.filter((s) => s.badgeEarned);

  const fitScore = roadmapData?.overallFitScore ?? 89;
  const cosineScore = roadmapData?.cosineSimilarity ?? 0.948;

  return (
    <AuthGuard allowedRoles={["STUDENT"]}>
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* Profile & Credentials Header */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Student")}`
              }
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-glow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user?.name}</h1>
                <Badge variant="primary" size="md">
                  <GraduationCap size={13} /> Class of {profile?.graduationYear || 2026}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-1">
                <span>{profile?.degree || "B.Tech"} • {profile?.department || "Computer Science"}</span>
                <span>•</span>
                <span className="text-slate-400">{profile?.collegeName || "National Institute of Technology"}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={13} /> NEP 2020 OBE Profile Active
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center">
            <Link href={`/p/${user?.name?.toLowerCase().replace(/\s+/g, "-") || "aarav-sharma"}`}>
              <Button variant="secondary" size="sm" icon={<ExternalLink size={14} />}>
                Public Verified Portfolio
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddSkillOpen(true)}
              icon={<Plus size={14} />}
            >
              Add Competency
            </Button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab("ROADMAP_GAP")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "ROADMAP_GAP"
                ? "bg-primary-500 text-white shadow-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Compass size={15} />
            Phase 4: AI Skill-Gap Analysis & Roadmaps
          </button>

          <button
            onClick={() => setActiveTab("JOB_MATCHES")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "JOB_MATCHES"
                ? "bg-primary-500 text-white shadow-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Briefcase size={15} />
            Phase 5: AI-Matched Opportunities ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab("SKILL_MATRIX")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "SKILL_MATRIX"
                ? "bg-primary-500 text-white shadow-glow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 size={15} />
            Phase 3: Skill Radar & Adaptive Tests
          </button>
        </div>

        {/* High-Level Competency Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Tracked Skills
            </span>
            <p className="text-xl font-extrabold text-white">{skills.length}</p>
            <p className="text-[10px] text-slate-400">Master Matrix Competencies</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={12} /> Verified Badges
            </span>
            <p className="text-xl font-extrabold text-emerald-300">{verifiedSkillsCount}</p>
            <p className="text-[10px] text-slate-400">Proctored & Endorsed</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <BrainCircuit size={12} /> Vector Cosine Match
            </span>
            <p className="text-xl font-extrabold text-cyan-300">{(cosineScore * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-slate-400 font-mono">Similarity: {cosineScore.toFixed(3)}</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Target size={12} /> Target Role Fit
            </span>
            <p className="text-xl font-extrabold text-amber-300">{fitScore}%</p>
            <p className="text-[10px] text-slate-400 truncate">
              {roadmapData?.targetRole || roadmapData?.roleTitle || "Full-Stack AI Architect"}
            </p>
          </Card>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: PHASE 4 AI SKILL-GAP & LEARNING ROADMAPS      */}
        {/* ---------------------------------------------------- */}
        {activeTab === "ROADMAP_GAP" && (
          <div className="space-y-6">
            <TargetRoleSelector
              roles={targetRoles}
              selectedRoleId={selectedRoleId}
              onSelectRole={(roleId) => setSelectedRoleId(roleId)}
              onGenerateRoadmap={handleGenerateRoadmap}
              isGenerating={isGeneratingRoadmap}
            />

            {roadmapData?.gapSummary && (
              <div className="p-5 rounded-3xl glass-panel border border-primary-500/30 bg-primary-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-primary-500/20 text-accent-cyan flex items-center justify-center shrink-0 border border-primary-500/30">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      AI Competency Vector Analysis • {roadmapData.targetRole || roadmapData.roleTitle}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                      {roadmapData.gapSummary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">{roadmapData.estimatedWeeks || 4} Weeks</p>
                    <p className="text-[10px] text-slate-400">~{roadmapData.estimatedHours || 36} Recovery Hrs</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const el = document.getElementById("learning-roadmap");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    icon={<ArrowRight size={13} />}
                  >
                    View Roadmap
                  </Button>
                </div>
              </div>
            )}

            {roadmapData?.gaps && (
              <SkillGapMatrix
                gaps={roadmapData.gaps}
                onTakeAssessment={handleLaunchAssessment}
                onScrollToRoadmap={() => {
                  const el = document.getElementById("learning-roadmap");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            )}

            {roadmapData && (
              <RoadmapTimeline
                roadmap={roadmapData}
                onStepToggle={handleStepToggle}
              />
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: PHASE 5 AI-MATCHED OPPORTUNITIES & DRIVES     */}
        {/* ---------------------------------------------------- */}
        {activeTab === "JOB_MATCHES" && (
          <div className="space-y-6">
            <JobMatchesList jobs={jobs} onApply={handleApplyJob} />
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: PHASE 3 SKILL RADAR & ADAPTIVE ASSESSMENTS    */}
        {/* ---------------------------------------------------- */}
        {activeTab === "SKILL_MATRIX" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <SkillRadarChart skills={skills} />
              </div>

              <div className="lg:col-span-6">
                <Card className="p-6 space-y-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Award size={18} className="text-amber-400" />
                        Outcome-Based Education (OBE) Badges
                      </h3>
                      <Badge variant="purple" size="sm">NEP 2020 Aligned</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Cryptographically tied credentials verified via adaptive assessments and faculty endorsements.
                    </p>
                  </div>

                  <div className="space-y-2.5 my-2">
                    {verifiedBadges.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400">
                        No verified badges yet. Take an adaptive assessment below to earn your first OBE badge!
                      </div>
                    ) : (
                      verifiedBadges.map((s, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl glass-card border border-emerald-500/20 bg-emerald-950/10 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                              <CheckCircle2 size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">{s.badgeEarned}</p>
                              <p className="text-[10px] text-slate-400">
                                {s.name} • Verified Score: <span className="text-emerald-400 font-bold">{s.verifiedScore}%</span>
                              </p>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 text-emerald-300 border border-emerald-500/30 shrink-0">
                            OBE-V4
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 rounded-2xl bg-indigo-500/[0.06] border border-indigo-500/20 flex items-center justify-between text-xs text-slate-300">
                    <span>Share your public badge verification link with corporate recruiters</span>
                    <Link href={`/p/${user?.name?.toLowerCase().replace(/\s+/g, "-") || "aarav-sharma"}`}>
                      <span className="text-primary-400 font-bold hover:underline flex items-center gap-1">
                        Open <ArrowRight size={12} />
                      </span>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-accent-cyan" />
                    Adaptive Skill Verification Assessments
                  </h3>
                  <p className="text-xs text-slate-400">
                    Anti-cheat proctored tests with instant automated scoring to upgrade your skills from <em>Self-Reported</em> to <em>Assessment-Verified</em>.
                  </p>
                </div>
                <Badge variant="cyan" size="sm">{assessments.length} Available Tests</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assessments.map((test) => {
                  const isPassed = test.status === "passed";
                  return (
                    <div
                      key={test.id}
                      className="p-5 rounded-2xl glass-card border border-white/5 hover:border-primary-500/30 flex flex-col justify-between space-y-4 transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <Badge variant="neutral" size="sm">{test.difficulty}</Badge>
                          {isPassed ? (
                            <Badge variant="success" size="sm">
                              <CheckCircle2 size={11} className="mr-1" /> Passed ({test.bestScore}%)
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                              <Timer size={12} /> {test.durationMinutes} mins
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white leading-snug">{test.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{test.description}</p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-300">
                          <span className="text-slate-400">Reward Badge: </span>
                          <strong className="text-accent-cyan">{test.badgeReward}</strong>
                        </div>
                      </div>

                      <Button
                        variant={isPassed ? "secondary" : "primary"}
                        size="sm"
                        className="w-full"
                        onClick={() => handleLaunchAssessment(test.id)}
                        icon={<Play size={13} />}
                      >
                        {isPassed ? "Retake Assessment" : "Take Assessment"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers size={18} className="text-indigo-400" />
                    3-Tier Verification Matrix
                  </h3>
                  <p className="text-xs text-slate-400">
                    Breakdown of competencies according to NEP 2020 Outcome-Based Education verification hierarchy.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsAddSkillOpen(true)} icon={<Plus size={14} />}>
                  Add Skill
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Competency</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Self Score</th>
                      <th className="py-2.5 px-3">Verified Score</th>
                      <th className="py-2.5 px-3">Industry Benchmark</th>
                      <th className="py-2.5 px-3">Verification Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {skills.map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3 font-semibold text-white">{s.name}</td>
                        <td className="py-3 px-3 text-slate-400">{s.category}</td>
                        <td className="py-3 px-3 text-indigo-300 font-medium">{s.selfScore}%</td>
                        <td className="py-3 px-3">
                          {s.verifiedScore ? (
                            <span className="text-emerald-400 font-bold">{s.verifiedScore}%</span>
                          ) : (
                            <span className="text-slate-500 font-mono">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-cyan-300">{s.industryBenchmark}%</td>
                        <td className="py-3 px-3">
                          {s.verificationStatus === "ASSESSMENT_VERIFIED" ? (
                            <Badge variant="success" size="sm">
                              <CheckCircle2 size={11} className="mr-1" /> Assessment Verified
                            </Badge>
                          ) : s.verificationStatus === "FACULTY_ENDORSED" ? (
                            <Badge variant="warning" size="sm">
                              <Award size={11} className="mr-1" /> Faculty Endorsed
                            </Badge>
                          ) : (
                            <Badge variant="neutral" size="sm">
                              Self-Reported
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Modals */}
        <ProctoredAssessmentModal
          assessmentId={activeTestId}
          isOpen={isTestModalOpen}
          onClose={() => {
            setIsTestModalOpen(false);
            setActiveTestId(null);
          }}
          onAssessmentCompleted={loadData}
        />

        <AddSkillModal
          isOpen={isAddSkillOpen}
          onClose={() => setIsAddSkillOpen(false)}
          onSkillAdded={loadData}
        />
      </div>
    </AuthGuard>
  );
}
