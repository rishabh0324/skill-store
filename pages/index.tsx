import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  GraduationCap,
  Briefcase,
  Award,
  Building2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, user, getDashboardRouteForRole } = useAuth();

  const personas = [
    {
      role: "STUDENT",
      title: "Student Portal",
      desc: "Skill verification, AI-driven competency mapping, personalized roadmaps, and verified recruiter placements.",
      icon: GraduationCap,
      href: "/student",
      registerHref: "/register",
      badge: "Competency Mapping",
      color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    },
    {
      role: "INDUSTRY",
      title: "Industry & Corporate Desk",
      desc: "Post openings with skill weights, leverage vector applicant ranking, and streamline hiring pipelines.",
      icon: Briefcase,
      href: "/industry",
      registerHref: "/register",
      badge: "Zero-Latency ATS",
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    },
    {
      role: "FACULTY",
      title: "Faculty & Mentor Hub",
      desc: "Manage 1-on-1 mentorship sessions, review capstone rubrics, and access industry curriculum advisory telemetry.",
      icon: Award,
      href: "/faculty",
      registerHref: "/register",
      badge: "Outcome-Based Education",
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      role: "INSTITUTION",
      title: "Institution & TPO Center",
      desc: "Track batch placement readiness, bridge campus skill gaps, and export compliance reports for NAAC/NIRF.",
      icon: Building2,
      href: "/institution",
      registerHref: "/register",
      badge: "NAAC & NIRF Analytics",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <div className="relative text-center max-w-4xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-primary-500/30 shadow-glow text-xs font-semibold text-primary-300">
          <ShieldCheck size={14} className="text-accent-cyan" />
          <span>Smart India Hackathon 2026 • Problem Statement 44</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Next-Gen <span className="gradient-text">Academia–Industry</span> Collaboration Engine
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bridging the gap between engineering curriculum and real-world corporate demand through authenticated role-based access, student skill mapping, verified portfolios, and intelligent placement workflows.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {isAuthenticated && user ? (
            <Link href={getDashboardRouteForRole(user.role)}>
              <Button variant="primary" size="lg" icon={<ArrowRight size={16} />}>
                Go to My {user.role} Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <Button variant="primary" size="lg" icon={<ArrowRight size={16} />}>
                  Create New Account
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Sign In to Portal
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 4 Primary Stakeholder Portals */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-white">4 Primary Stakeholder Ecosystems</h2>
          <p className="text-xs text-slate-400">Select a role to sign in or register with custom profile telemetry</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <Card key={p.role} className="p-5 flex flex-col justify-between space-y-4 hover:border-primary-500/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${p.color}`}>
                      <Icon size={20} />
                    </div>
                    <Badge variant="neutral" size="sm">
                      {p.badge}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <Link href={p.href} className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1">
                    Enter Portal <ArrowRight size={13} />
                  </Link>
                  <Link href={`/register?role=${p.role}`} className="text-[11px] text-slate-400 hover:text-white">
                    Register →
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Security & Authentication Architecture Highlights */}
      <Card className="p-8 border border-white/10 glass-panel space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <Badge variant="cyan" size="sm">
            Security & RBAC Architecture
          </Badge>
          <h3 className="text-xl font-bold text-white">Engineered for National-Scale Hackathon Workloads</h3>
          <p className="text-xs text-slate-400">Secure, encrypted, and isolated user sessions with strict role boundaries</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Lock size={16} />
            </div>
            <h4 className="font-bold text-white">Bcrypt Salt Hashing & JWT</h4>
            <p className="text-slate-400 leading-relaxed">
              Passwords hashed with 10-round salt iterations. Signed JWT sessions delivered via HTTP-Only SameSite cookies.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <h4 className="font-bold text-white">Strict Role-Based Access Control</h4>
            <p className="text-slate-400 leading-relaxed">
              Automatic route interceptors prevent cross-role unauthorized access and redirect users to their designated desks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users size={16} />
            </div>
            <h4 className="font-bold text-white">Normalized Relational Profiles</h4>
            <p className="text-slate-400 leading-relaxed">
              User credentials decoupled from Student, Industry, Faculty, and Institution profile tables via Prisma ORM relations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
