import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Layers, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("aarav.sharma@institution.edu.in");
  const [password, setPassword] = useState("Password@123");
  const [role, setRole] = useState("STUDENT");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();

      if (data.success) {
        if (role === "STUDENT") router.push("/student");
        else if (role === "RECRUITER") router.push("/recruiter");
        else if (role === "FACULTY") router.push("/faculty");
        else router.push("/tpo");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan p-0.5 mx-auto shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Layers className="text-accent-cyan w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">Sign in to NEXUS EDU</h2>
          <p className="text-xs text-slate-400">SIH 2026 Academia–Industry Collaboration Gateway</p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="space-y-1.5 pt-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Persona Fill:
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail("aarav.sharma@institution.edu.in");
                setRole("STUDENT");
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-left border border-white/5"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("priya.nair@microsoft.com");
                setRole("RECRUITER");
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-left border border-white/5"
            >
              💼 Recruiter
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("dr.ramesh@institution.edu.in");
                setRole("FACULTY");
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-left border border-white/5"
            >
              🏅 Faculty
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("tpo.head@institution.edu.in");
                setRole("TPO_ADMIN");
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-left border border-white/5"
            >
              🏛️ TPO Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs"
            >
              <option value="STUDENT" className="bg-slate-900">Student</option>
              <option value="RECRUITER" className="bg-slate-900">Industry Recruiter</option>
              <option value="FACULTY" className="bg-slate-900">Faculty / Mentor</option>
              <option value="TPO_ADMIN" className="bg-slate-900">TPO / Institutional Admin</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
            icon={<ArrowRight size={16} />}
          >
            Sign In to Portal
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400 border-t border-white/5">
          <span>New institutional partner or student? </span>
          <Link href="/register" className="text-primary-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
}
