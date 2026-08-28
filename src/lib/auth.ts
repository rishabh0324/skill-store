import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserRole, UserSession } from "@/types";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "sih2026-super-secret-jwt-key-academia-industry-platform";

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

export async function getUserWithProfile(userId: string): Promise<UserSession | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        industryProfile: true,
        facultyProfile: true,
        institutionProfile: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl || undefined,
      studentProfile: user.studentProfile || undefined,
      industryProfile: user.industryProfile || undefined,
      facultyProfile: user.facultyProfile || undefined,
      institutionProfile: user.institutionProfile || undefined,
    };
  } catch (error) {
    return null;
  }
}

// Preset Demo Profiles
export const DEMO_PRESETS: Record<UserRole, { email: string; name: string; role: UserRole }> = {
  STUDENT: {
    email: "student@sih.edu",
    name: "Aarav Sharma",
    role: "STUDENT",
  },
  INDUSTRY: {
    email: "recruiter@techcorp.com",
    name: "Priya Nair",
    role: "INDUSTRY",
  },
  FACULTY: {
    email: "faculty@university.edu",
    name: "Dr. Ramesh Verma",
    role: "FACULTY",
  },
  INSTITUTION: {
    email: "admin@nit-campus.edu",
    name: "Prof. S. Meenakshi",
    role: "INSTITUTION",
  },
  ADMIN: {
    email: "admin@sih-platform.gov.in",
    name: "National Platform Admin",
    role: "ADMIN",
  },
};
