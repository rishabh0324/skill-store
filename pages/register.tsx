import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Layers, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [institutionName, setInstitutionName] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, institutionName, department }),
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
    <div className="max-w-md mx-auto py-8">
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan p-0.5 mx-auto shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Layers className="text-accent-cyan w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">Create Account</h2>
          <p className="text-xs text-slate-400">Join the SIH 2026 Academia–Industry Network</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@institution.edu.in"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Role Type</label>
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
            Complete Registration
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400 border-t border-white/5">
          <span>Already have an account? </span>
          <Link href="/login" className="text-primary-400 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
