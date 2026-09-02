import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { hashPassword, signJwtToken } from "@/lib/auth";
import { UserRole, UserSession } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { name, email, password, confirmPassword, phone, role } = req.body;

    // 1. Basic Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter your full name (at least 2 characters).",
      });
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid official or academic email address.",
      });
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match. Please re-enter your password.",
      });
    }

    // 2. Role Security Check - ADMIN is strictly prohibited from public registration
    const targetRole = (role?.toUpperCase() || "STUDENT") as UserRole;
    const allowedPublicRoles: UserRole[] = ["STUDENT", "INDUSTRY", "FACULTY", "INSTITUTION"];

    if (targetRole === "ADMIN" || !allowedPublicRoles.includes(targetRole)) {
      return res.status(403).json({
        success: false,
        message: "Administrative accounts cannot be created via public registration. Contact your platform supervisor.",
      });
    }

    // 3. Check for Existing Account
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists. Please log in instead.",
      });
    }

    // 4. Hash Password
    const passwordHash = await hashPassword(password);

    // 5. Create User & Initial Role Profile Container in Atomic Transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone ? phone.trim() : null,
          passwordHash,
          role: targetRole,
          isOnboarded: false, // Must complete onboarding steps
        },
      });

      // Create initial empty role profile container
      if (targetRole === "STUDENT") {
        await tx.studentProfile.create({
          data: {
            userId: user.id,
            collegeName: "To be updated in onboarding",
            degree: "B.Tech",
            department: "Engineering",
            graduationYear: new Date().getFullYear() + 2,
          },
        });
      } else if (targetRole === "INDUSTRY") {
        await tx.industryProfile.create({
          data: {
            userId: user.id,
            companyName: "To be updated in onboarding",
            companyWebsite: "https://company.example.com",
          },
        });
      } else if (targetRole === "FACULTY") {
        await tx.facultyProfile.create({
          data: {
            userId: user.id,
            institutionName: "To be updated in onboarding",
            department: "Engineering",
            designation: "Faculty Mentor",
          },
        });
      } else if (targetRole === "INSTITUTION") {
        await tx.institutionProfile.create({
          data: {
            userId: user.id,
            institutionName: "To be updated in onboarding",
            institutionType: "Engineering Institution",
          },
        });
      }

      return user;
    });

    // 6. Build Fresh User Session
    const userSession: UserSession = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone || undefined,
      role: newUser.role as UserRole,
      avatarUrl: newUser.avatarUrl || undefined,
      isOnboarded: false,
    };

    const token = signJwtToken(userSession);

    // 7. Set Secure HttpOnly Cookie
    res.setHeader(
      "Set-Cookie",
      `sih_token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully! Please complete your role onboarding profile.",
      data: {
        user: userSession,
        token,
        isOnboarded: false,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while creating your account. Please try again.",
    });
  }
}
