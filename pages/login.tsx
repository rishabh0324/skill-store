import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Layers, Mail, Lock, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, getDashboardRouteForRole, quickDemoLogin } = useAuth();

  const [email, setEmail] = useState("student@sih.edu");
  const [password, setPassword] = useState("Password@123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // If already authenticated, redirect to role dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectUrl = (router.query.redirect as string) || getDashboardRouteForRole(user.role);
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, user, router, getDashboardRouteForRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const result = await login({ email, password });

    if (result.success && result.role) {
      setSuccessMessage("Login successful! Redirecting to your dashboard...");
      const redirectUrl = (router.query.redirect as string) || getDashboardRouteForRole(result.role);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    } else {
      setErrorMessage(result.message);
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password@123");
    setErrorMessage("");
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
          <h2 className="text-2xl font-black text-white tracking-tight">Sign In to NEXUS EDU</h2>
          <p className="text-xs text-slate-400">SIH 2026 Academia–Industry Collaboration Platform</p>
        </div>

        {/* Quick Demo Fill Buttons for Evaluators */}
        <div className="p-3.5 rounded-2xl bg-indigo-500/[0.07] border border-indigo-500/20 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} className="text-accent-cyan" /> 1-Click Demo Personas:
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Password@123</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill("STUDENT", "student@sih.edu")}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-left border border-white/5 hover:border-indigo-500/30 transition-all flex items-center gap-1.5"
            >
              <span>🎓</span>
              <span className="font-medium">Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("INDUSTRY", "recruiter@techcorp.com")}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-left border border-white/5 hover:border-cyan-500/30 transition-all flex items-center gap-1.5"
            >
              <span>💼</span>
              <span className="font-medium">Industry</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("FACULTY", "faculty@university.edu")}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-left border border-white/5 hover:border-amber-500/30 transition-all flex items-center gap-1.5"
            >
              <span>🏅</span>
              <span className="font-medium">Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("INSTITUTION", "admin@nit-campus.edu")}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-left border border-white/5 hover:border-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <span>🏛️</span>
              <span className="font-medium">Institution</span>
            </button>
          </div>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@organization.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-10 pr-3 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-[11px] text-primary-400 hover:text-primary-300 font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-10 pr-3 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
            icon={<ArrowRight size={16} />}
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400 border-t border-white/5">
          <span>Don't have an account? </span>
          <Link href="/register" className="text-primary-400 font-semibold hover:underline">
            Register your profile
          </Link>
        </div>
      </Card>
    </div>
  );
}
