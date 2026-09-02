import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Layers,
  Mail,
  Lock,
  User,
  Phone,
  GraduationCap,
  Briefcase,
  Award,
  Building2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid official or academic email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please accept the terms of service and privacy policy to continue.");
      return;
    }

    setIsLoading(true);

    const result = await register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      password,
      confirmPassword,
      role: selectedRole,
    });

    if (result.success) {
      setSuccessMessage("Account created! Redirecting to your personalized onboarding...");
      setTimeout(() => {
        router.push("/onboarding");
      }, 500);
    } else {
      setErrorMessage(result.message);
      setIsLoading(false);
    }
  };

  const rolesList: { role: UserRole; label: string; icon: any; desc: string; badge: string }[] = [
    {
      role: "STUDENT",
      label: "Student",
      icon: GraduationCap,
      desc: "Skill verification, AI roadmaps & placements",
      badge: "Learner",
    },
    {
      role: "INDUSTRY",
      label: "Industry",
      icon: Briefcase,
      desc: "Talent recruitment & vector job drives",
      badge: "Recruiter",
    },
    {
      role: "FACULTY",
      label: "Faculty",
      icon: Award,
      desc: "1:1 Guidance & competency endorsements",
      badge: "Mentor",
    },
    {
      role: "INSTITUTION",
      label: "Institution",
      icon: Building2,
      desc: "TPO placement analytics & NAAC reports",
      badge: "TPO / Admin",
    },
  ];

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan p-0.5 mx-auto shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Layers className="text-accent-cyan w-6 h-6" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Create bridgeNext ai Account</h2>
          <p className="text-xs text-slate-400">Join the SIH 2026 Academia–Industry Collaboration Ecosystem</p>
        </div>

        {/* Role Selection Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            Step 1: Choose Your Platform Role
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {rolesList.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setSelectedRole(r.role)}
                  className={cn(
                    "p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2.5 relative group",
                    isSelected
                      ? "bg-primary-500/15 border-primary-500 shadow-glow"
                      : "bg-slate-900/60 border-white/5 hover:border-white/20 hover:bg-slate-900"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center",
                        isSelected
                          ? "bg-primary-500 text-white"
                          : "bg-white/5 text-slate-400 group-hover:text-slate-200"
                      )}
                    >
                      <Icon size={16} />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        isSelected
                          ? "bg-primary-500/20 text-primary-300 border-primary-500/40"
                          : "bg-white/5 text-slate-400 border-white/10"
                      )}
                    >
                      {r.badge}
                    </span>
                  </div>

                  <div>
                    <h4
                      className={cn(
                        "text-xs font-bold leading-tight",
                        isSelected ? "text-white" : "text-slate-300"
                      )}
                    >
                      {r.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-snug mt-0.5">{r.desc}</p>
                  </div>
                </button>
              );
            })}
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

        {/* Registration Inputs Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe / Dr. Sarah Jenkins"
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all pl-10"
              />
              <User size={16} className="absolute left-3.5 top-3 text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Official / Academic Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.edu / .com"
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all pl-10"
                />
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Phone Number (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all pl-10"
                />
                <Phone size={16} className="absolute left-3.5 top-3 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all pl-10"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all pl-10"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded bg-slate-900 border-white/20 text-primary-500 focus:ring-0"
            />
            <label htmlFor="terms" className="cursor-pointer select-none">
              I agree to the NEP 2020 OBE Collaboration Platform terms & privacy guidelines.
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            icon={<ArrowRight size={16} />}
          >
            Create Account & Continue to Onboarding →
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/5">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary-400 hover:text-primary-300">
            Sign In Here →
          </Link>
        </div>
      </Card>
    </div>
  );
}
