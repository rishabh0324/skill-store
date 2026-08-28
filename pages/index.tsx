import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Award,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  const personas = [
    {
      title: "Student Portal",
      desc: "Skill radar mapping, proctored adaptive tests, automated gap-roadmaps, and 1-click verified job applications.",
      path: "/student",
      icon: GraduationCap,
      badge: "Self & Verified Tests",
      color: "from-indigo-600 to-primary-500",
      accent: "text-indigo-400 border-indigo-500/30",
    },
    {
      title: "Industry Recruiter Desk",
      desc: "Custom skill-weight posting, AI vector applicant ranking (0-100%), and interactive ATS pipeline tracker.",
      path: "/recruiter",
      icon: Briefcase,
      badge: "Vector ATS Matcher",
      color: "from-cyan-600 to-blue-600",
      accent: "text-cyan-400 border-cyan-500/30",
    },
    {
      title: "Faculty & Mentor Hub",
      desc: "1-on-1 mentorship scheduling, capstone rubric reviews, and automated industry curriculum gap advisory.",
      path: "/faculty",
      icon: Award,
      badge: "OBE & Guidance",
      color: "from-amber-600 to-orange-500",
      accent: "text-amber-400 border-amber-500/30",
    },
    {
      title: "Institutional TPO Center",
      desc: "Branch-wise placement readiness heatmaps, campus talent supply vs recruiter demand, and NAAC/NIRF exports.",
      path: "/tpo",
      icon: Building2,
      badge: "NAAC & NIRF Analytics",
      color: "from-emerald-600 to-teal-500",
      accent: "text-emerald-400 border-emerald-500/30",
    },
  ];

  const highlights = [
    {
      icon: Sparkles,
      title: "AI Skill-Gap Engine",
      desc: "Vector cosine distance comparison against live industry job descriptions generates personalized 4-week recovery roadmaps.",
    },
    {
      icon: ShieldCheck,
      title: "Verifiable Digital Badges",
      desc: "NEP 2020 aligned Outcome-Based Education (OBE) competency badges directly tied to assessed problem-solving skills.",
    },
    {
      icon: Zap,
      title: "Zero-Latency ATS Match",
      desc: "Recruiters filter thousands of verified candidates in milliseconds using multi-factor proficiency ranking.",
    },
    {
      icon: BarChart3,
      title: "Accreditation Reporting",
      desc: "Automated CSV and visual exports tailored for NAAC Criterion 5 and NIRF institutional progression audits.",
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6 pb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-glow">
          <Sparkles size={14} className="text-accent-cyan animate-spin" />
          <span>Smart India Hackathon 2026 • Problem Statement 44</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Next-Gen <span className="gradient-text">Academia–Industry</span> Collaboration Platform
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bridging the gap between engineering curriculum and real-world hiring demand through
          <strong className="text-white"> AI skill-gap mapping, verified portfolios, adaptive assessments, and smart recruitment</strong>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/student">
            <Button variant="primary" size="lg" icon={<GraduationCap size={18} />}>
              Launch Student Hub
            </Button>
          </Link>
          <Link href="/recruiter">
            <Button variant="secondary" size="lg" icon={<Briefcase size={18} />}>
              Recruiter Desk
            </Button>
          </Link>
          <Link href="/tpo">
            <Button variant="outline" size="lg" icon={<BarChart3 size={18} />}>
              Institutional KPIs
            </Button>
          </Link>
        </div>
      </section>

      {/* Role Navigation Cards */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Select a Persona to Experience the Platform</h2>
          <p className="text-xs text-slate-400 mt-1">
            Toggle between stakeholders to test live workflows and end-to-end interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p, idx) => {
            const Icon = p.icon;
            return (
              <Link key={idx} href={p.path} className="group">
                <Card hoverEffect className="h-full flex flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} p-0.5 flex items-center justify-center text-white shadow-md`}
                      >
                        <Icon size={20} />
                      </div>
                      <Badge variant="neutral" size="sm" className={p.accent}>
                        {p.badge}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-accent-cyan transition-colors">
                    <span>Explore Portal</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Architectural Highlights */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Platform Core Architectural Pillars</h2>
            <Badge variant="cyan" size="sm">
              NEP 2020 Aligned
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Engineered for high-throughput institutional workloads with zero external latency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="p-2 w-fit rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20">
                  <Icon size={18} />
                </div>
                <h4 className="text-sm font-bold text-white">{h.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{h.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
