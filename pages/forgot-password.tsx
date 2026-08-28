import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Layers, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success && data.data?.resetUrl) {
        setResetUrl(data.data.resetUrl);
      } else {
        setErrorMessage(data.message || "Failed to generate reset link.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan p-0.5 mx-auto shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Layers className="text-accent-cyan w-6 h-6" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Reset Your Password</h2>
          <p className="text-xs text-slate-400">
            Enter your registered official email address to receive password reset instructions.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {resetUrl ? (
          <div className="p-4 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle2 size={16} />
              <span>Password Reset Link Generated</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In a production system, this link is delivered via SMTP email. For hackathon evaluation, click below to test the reset flow:
            </p>
            <Link href={resetUrl}>
              <Button variant="secondary" size="sm" className="w-full mt-1" icon={<ArrowRight size={14} />}>
                Proceed to Reset Password
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input pl-10 pr-3 py-2.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
              icon={<ArrowRight size={16} />}
            >
              Generate Reset Instructions
            </Button>
          </form>
        )}

        <div className="text-center pt-2 text-xs text-slate-400 border-t border-white/5">
          <Link href="/login" className="text-primary-400 font-semibold hover:underline inline-flex items-center gap-1">
            <ArrowLeft size={13} /> Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
