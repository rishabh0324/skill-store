import React, { useState, useEffect } from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { MentorshipSchedule } from "@/components/faculty/MentorshipSchedule";
import { CurriculumAdvisory } from "@/components/faculty/CurriculumAdvisory";
import { EndorsementDesk } from "@/components/faculty/EndorsementDesk";
import {
  Award,
  Mail,
  Building,
  BookOpen,
  UserCheck,
  ShieldCheck,
  LogOut,
  Sparkles,
  Calendar,
  Layers,
  GraduationCap,
} from "lucide-react";

export default function FacultyDashboardPage() {
  const { user, logout } = useAuth();
  const profile = user?.facultyProfile;

  const [sessions, setSessions] = useState<any[]>([]);
  const [endorsements, setEndorsements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mentorshipRes, endorsementsRes] = await Promise.all([
        fetch("/api/v1/mentorship"),
        fetch("/api/v1/endorsements"),
      ]);

      const [mentorshipJson, endorsementsJson] = await Promise.all([
        mentorshipRes.json(),
        endorsementsRes.json(),
      ]);

      if (mentorshipJson.success && mentorshipJson.data?.sessions) {
        setSessions(mentorshipJson.data.sessions);
      }
      if (endorsementsJson.success && endorsementsJson.data?.endorsements) {
        setEndorsements(endorsementsJson.data.endorsements);
      }
    } catch (e) {
      console.error("Error loading faculty telemetry:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const endorsedCount = endorsements.filter((e) => e.isEndorsed).length;
  const activeSlotsCount = sessions.filter((s) => s.status === "AVAILABLE" || s.slotStatus === "AVAILABLE").length;
  const confirmedBookingsCount = sessions.filter((s) => s.status === "CONFIRMED" || s.status === "BOOKED").length;

  return (
    <AuthGuard allowedRoles={["FACULTY", "ADMIN"]}>
      <div className="space-y-6 max-w-6xl mx-auto py-2">
        {/* Header Profile Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Faculty")}`
              }
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-glow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{user?.name}</h1>
                <Badge variant="warning" size="md">
                  <Award size={13} /> {profile?.designation || "Associate Professor & Mentor"}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-1">
                <span>{profile?.institutionName || "National Institute of Technology"}</span>
                <span>•</span>
                <span className="text-slate-400">{profile?.department || "Computer Science"}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> NEP 2020 OBE Mentor Verified
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <Button variant="outline" size="sm" onClick={logout} icon={<LogOut size={14} />}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Faculty Live Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Students Mentored"
            value="38"
            trend={{ value: "+6 this term", positive: true }}
            icon={<GraduationCap size={18} />}
            iconBg="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
          />
          <MetricCard
            title="Active Guidance Slots"
            value={activeSlotsCount + confirmedBookingsCount}
            subtext={`${confirmedBookingsCount} confirmed bookings`}
            icon={<Calendar size={18} />}
            iconBg="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
          />
          <MetricCard
            title="Competencies Endorsed"
            value={endorsedCount || 1}
            subtext="0.95x OBE Vector Credit"
            icon={<Award size={18} />}
            iconBg="bg-amber-500/15 text-amber-400 border border-amber-500/30"
          />
          <MetricCard
            title="Curriculum Recommendations"
            value="3"
            subtext="AI Feedback Active"
            icon={<Sparkles size={18} />}
            iconBg="bg-purple-500/15 text-purple-400 border border-purple-500/30"
          />
        </div>

        {/* Mentorship Guidance Schedule */}
        <MentorshipSchedule sessions={sessions} onRefresh={loadData} />

        {/* Student Competency Endorsement Desk */}
        <EndorsementDesk endorsements={endorsements} onEndorseSuccess={loadData} />

        {/* Industry-Driven Curriculum Advisory */}
        <CurriculumAdvisory />
      </div>
    </AuthGuard>
  );
}
