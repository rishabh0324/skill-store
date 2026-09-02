import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { comparePassword, signJwtToken, getUserWithProfile } from "@/lib/auth";
import { UserRole, UserSession } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 1. Query User from Database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        studentProfile: {
          include: {
            skills: { include: { skill: true } },
            projects: true,
            roadmaps: { include: { milestones: true } },
          },
        },
        industryProfile: {
          include: {
            jobPostings: true,
          },
        },
        facultyProfile: {
          include: {
            mentorshipSlots: true,
            endorsements: true,
          },
        },
        institutionProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated. Please contact the platform administrator.",
      });
    }

    // 2. Verify Password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    // 3. Build User Session
    const userSession: UserSession = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone || undefined,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl || undefined,
      isOnboarded: user.isOnboarded,
      studentProfile: user.studentProfile || undefined,
      industryProfile: user.industryProfile || undefined,
      facultyProfile: user.facultyProfile || undefined,
      institutionProfile: user.institutionProfile || undefined,
    };

    // 4. Sign JWT & Set Cookie
    const token = signJwtToken(userSession);

    res.setHeader(
      "Set-Cookie",
      `sih_token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    );

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        user: userSession,
        token,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during login. Please try again.",
    });
  }
}
