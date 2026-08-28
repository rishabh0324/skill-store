"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { UserRole, UserSession, RegisterPayload, LoginPayload } from "@/types";
import { DEMO_PRESETS } from "@/lib/auth";

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<{ success: boolean; message: string; role?: UserRole }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string; role?: UserRole }>;
  logout: () => Promise<void>;
  quickDemoLogin: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
  getDashboardRouteForRole: (role: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getDashboardRouteForRole(role: UserRole): string {
  switch (role) {
    case "STUDENT":
      return "/student";
    case "INDUSTRY":
      return "/industry";
    case "FACULTY":
      return "/faculty";
    case "INSTITUTION":
      return "/institution";
    case "ADMIN":
      return "/admin";
    default:
      return "/";
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/auth/me");
      const data = await res.json();
      if (data.success && data.data?.user) {
        setUser(data.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginPayload) => {
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();

      if (data.success && data.data?.user) {
        setUser(data.data.user);
        return {
          success: true,
          message: data.message || "Login successful",
          role: data.data.user.role,
        };
      }
      return {
        success: false,
        message: data.message || "Login failed. Please check your credentials.",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "An error occurred during login.",
      };
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success && data.data?.user) {
        setUser(data.data.user);
        return {
          success: true,
          message: data.message || "Registration successful",
          role: data.data.user.role,
        };
      }
      return {
        success: false,
        message: data.message || "Registration failed. Please check your inputs.",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "An error occurred during registration.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const quickDemoLogin = async (role: UserRole) => {
    const preset = DEMO_PRESETS[role];
    if (preset) {
      const result = await login({
        email: preset.email,
        password: "Password@123",
      });
      if (result.success && result.role) {
        router.push(getDashboardRouteForRole(result.role));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        quickDemoLogin,
        refreshUser,
        getDashboardRouteForRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
