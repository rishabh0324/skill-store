"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { ShieldAlert, ArrowRight, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface AuthGuardProps {
  allowedRoles?: UserRole[];
  requireOnboarded?: boolean;
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  allowedRoles,
  requireOnboarded = true,
  children,
}) => {
  const { user, loading, isAuthenticated, logout, getDashboardRouteForRole } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(3);

  const isRoleAuthorized =
    !allowedRoles || (user && allowedRoles.includes(user.role));

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }

    // If authenticated but onboarding is incomplete, redirect to /onboarding
    if (
      !loading &&
      isAuthenticated &&
      user &&
      requireOnboarded &&
      !user.isOnboarded &&
      router.pathname !== "/onboarding"
    ) {
      router.replace("/onboarding");
    }
  }, [loading, isAuthenticated, user, requireOnboarded, router]);

  // Handle automatic redirect if accessing wrong role's dashboard
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!loading && isAuthenticated && !isRoleAuthorized && user) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      } else {
        router.replace(getDashboardRouteForRole(user.role));
      }
    }
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, isRoleAuthorized, countdown, user, router, getDashboardRouteForRole]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Verifying security credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requireOnboarded && user && !user.isOnboarded && router.pathname !== "/onboarding") {
    return null; // Will redirect to /onboarding
  }

  if (!isRoleAuthorized && user) {
    const userDashboard = getDashboardRouteForRole(user.role);

    return (
      <div className="max-w-lg mx-auto py-16 px-4">
        <Card className="p-8 text-center space-y-5 border border-rose-500/20 bg-rose-950/10">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert size={28} />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white">Unauthorized Role Access</h2>
            <p className="text-xs text-slate-300">
              You are currently authenticated as a{" "}
              <Badge variant="cyan" size="sm" className="inline-flex">
                {user.role}
              </Badge>
              . You do not have permission to view this route.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-400">
            Redirecting to your authorized <strong>{user.role} Dashboard</strong> in{" "}
            <span className="text-rose-400 font-bold text-sm">{countdown}s</span>...
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => router.replace(userDashboard)}
              icon={<ArrowRight size={15} />}
            >
              Go to My Dashboard
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={logout}
              icon={<LogOut size={15} />}
            >
              Log Out
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
