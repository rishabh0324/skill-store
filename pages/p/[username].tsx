import React from "react";
import { useRouter } from "next/router";
import {
  ShieldCheck,
  Award,
  Github,
  Linkedin,
  ExternalLink,
  Code2,
  CheckCircle,
  FileDown,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function PublicPortfolioPage() {
  const router = useRouter();
  const { username } = router.query;

  const student = {
    name: "Aarav Sharma",
    username: (username as string) || "aarav-sharma",
    title: "Full-Stack Engineer & AI Systems Developer",
    institution: "National Institute of Technology (NIT)",
    department: "Computer Science & Engineering",
    batch: "Class of 2026",
    cgpa: 8.8,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    bio: "Passionate about designing resilient microservices, vector search indexing, and real-time distributed applications. Top 5% assessed competency in Next.js, Python, and PostgreSQL.",
    skills: [
      { name: "React.js & Next.js 14", score: 92, verified: true },
      { name: "Python & Fast-API", score: 88, verified: true },
      { name: "Machine Learning (PyTorch)", score: 84, verified: true },
      { name: "PostgreSQL & pgvector", score: 78, verified: true },
      { name: "Docker & Containers", score: 65, verified: false },
      { name: "System Design", score: 70, verified: false },
    ],
    projects: [
      {
        title: "AI-Powered Talent Vector Matcher",
        desc: "Built a sub-50ms candidate search engine utilizing cosine similarity embeddings on PostgreSQL pgvector.",
        tech: ["Next.js", "FastAPI", "pgvector", "Docker"],
        demoUrl: "https://demo.nexus-edu.in",
        repoUrl: "https://github.com/aarav-sharma/vector-matcher",
      },
      {
        title: "Distributed Mentorship Booking Queue",
        desc: "Designed an asynchronous scheduling engine with Redis distributed locks and WebSockets for real-time calendar synchronization.",
        tech: ["Node.js", "Redis", "Socket.io", "Prisma"],
        demoUrl: "https://demo.nexus-edu.in",
        repoUrl: "https://github.com/aarav-sharma/mentor-queue",
      },
    ],
    endorsements: [
      {
        by: "Dr. Ramesh Verma",
        role: "Associate Professor, NIT",
        comment:
          "Aarav demonstrates exceptional architectural rigor in system design and database indexing.",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Verified Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-indigo-500 shadow-glow"
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{student.name}</h1>
              <Badge variant="success" size="md">
                <ShieldCheck size={13} /> Institutional Verified
              </Badge>
            </div>

            <p className="text-sm text-cyan-300 font-semibold">{student.title}</p>
            <p className="text-xs text-slate-400">
              {student.department} • {student.institution} • {student.batch} (CGPA: {student.cgpa})
            </p>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed pt-1">{student.bio}</p>

            {/* Social & Download Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
              >
                <Github size={14} /> GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors">
                <FileDown size={14} /> Download Verified Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Skills Showcase */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Verified Competency Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Accredited assessments and mentor evaluations aligned with Outcome-Based Education (OBE).
            </p>
          </div>
          <Badge variant="cyan" size="sm">
            <Sparkles size={11} /> NEP 2020 OBE
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {student.skills.map((skill, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{skill.name}</span>
                  {skill.verified ? (
                    <Badge variant="success" size="sm">
                      <CheckCircle size={10} /> Verified ({skill.score}%)
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="sm">
                      Self-Reported
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Projects Showcase */}
      <Card className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Featured Capstone & Industry Projects</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Production-grade implementations with verified source code repositories.
          </p>
        </div>

        <div className="space-y-3">
          {student.projects.map((proj, i) => (
            <div key={i} className="p-4 rounded-xl glass-card border border-white/5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                <div className="flex items-center gap-2">
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <Github size={15} />
                  </a>
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-cyan hover:text-cyan-300 p-1"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{proj.desc}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-indigo-300 border border-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Faculty Endorsement */}
      <Card className="space-y-3">
        <h3 className="text-base font-bold text-white">Faculty & Mentor Endorsement</h3>
        {student.endorsements.map((end, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <p className="text-xs text-slate-300 italic leading-relaxed">"{end.comment}"</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-white">{end.by}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{end.role}</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
