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
} from "lucide-react";

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();
  const profile = user?.studentProfile;

  const [skills, setSkills] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [skillsRes, assessmentsRes] = await Promise.all([
        fetch("/api/v1/skills"),
        fetch("/api/v1/assessments"),
      ]);

      const skillsJson = await skillsRes.json();
      const assessmentsJson = await assessmentsRes.json();

      if (skillsJson.success && skillsJson.data) {
        setSkills(skillsJson.data);
      }
      if (assessmentsJson.success && assessmentsJson.data) {
        setAssessments(assessmentsJson.data);
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

  const handleLaunchAssessment = (testId: string) => {
    setActiveTestId(testId);
    setIsTestModalOpen(true);
  };

  const verifiedSkillsCount = skills.filter((s) => s.isVerified || !!s.verifiedScore).length;
  const verifiedBadges = skills.filter((s) => s.badgeEarned);

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

        {/* High-Level Competency Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Tracked Skills
            </span>
            <p className="text-xl font-extrabold text-white">{skills.length}</p>
            <p className="text-[10px] text-slate-400">In Master Competency Matrix</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={12} /> Verified Badges
            </span>
            <p className="text-xl font-extrabold text-emerald-300">{verifiedSkillsCount}</p>
            <p className="text-[10px] text-slate-400">Proctored & Endorsed</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider">
              Average Benchmark Fit
            </span>
            <p className="text-xl font-extrabold text-cyan-300">86.4%</p>
            <p className="text-[10px] text-slate-400">Tier-1 Corporate Ready</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
              Target Role Fit
            </span>
            <p className="text-xl font-extrabold text-amber-300">92%</p>
            <p className="text-[10px] text-slate-400">Cloud & AI Engineer</p>
          </Card>
        </div>

        {/* Radar Chart & Verified OBE Badges */}
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

        {/* Adaptive Assessment Center */}
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

        {/* 3-Tier Competency Breakdown Table */}
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
