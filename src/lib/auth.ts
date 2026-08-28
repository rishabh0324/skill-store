import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserRole, UserSession } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "sih2026-super-secret-jwt-key-academia-industry";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signJwtToken(payload: UserSession): string {
  const options: SignOptions = {
    expiresIn: "7d",
  };
  return jwt.sign({ ...payload }, JWT_SECRET, options);
}

export function verifyJwtToken(token: string): UserSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserSession;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Preset Demo Accounts for Hackathon Evaluation
export const DEMO_USERS: Record<UserRole, UserSession> = {
  STUDENT: {
    id: "user-student-1",
    email: "aarav.sharma@institution.edu.in",
    name: "Aarav Sharma",
    role: "STUDENT",
    department: "Computer Science & Engineering",
    institutionName: "National Institute of Technology (NIT)",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  RECRUITER: {
    id: "user-recruiter-1",
    email: "priya.nair@microsoft.com",
    name: "Priya Nair",
    role: "RECRUITER",
    companyName: "Microsoft India",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  FACULTY: {
    id: "user-faculty-1",
    email: "dr.ramesh@institution.edu.in",
    name: "Dr. Ramesh Verma",
    role: "FACULTY",
    department: "Computer Science & Engineering",
    institutionName: "National Institute of Technology (NIT)",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  TPO_ADMIN: {
    id: "user-tpo-1",
    email: "tpo.head@institution.edu.in",
    name: "Prof. S. Meenakshi",
    role: "TPO_ADMIN",
    institutionName: "National Institute of Technology (NIT)",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  },
  ADMIN: {
    id: "user-admin-1",
    email: "admin@sih44-platform.gov.in",
    name: "System Administrator",
    role: "ADMIN",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  },
};
