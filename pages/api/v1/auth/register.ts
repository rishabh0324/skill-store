import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { hashPassword, signJwtToken } from "@/lib/auth";
import { UserRole, UserSession } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const {
      name,
      email,
      password,
      role,
      // Student
      collegeName,
      degree,
      department,
      graduationYear,
      // Industry
      companyName,
      companyWebsite,
      // Faculty
      institutionName,
      designation,
      // Institution
      institutionType,
    } = req.body;

    // 1. Basic Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Please provide a valid full name (at least 2 characters)." });
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
    }

    const validRoles: UserRole[] = ["STUDENT", "INDUSTRY", "FACULTY", "INSTITUTION", "ADMIN"];
    const targetRole = (role?.toUpperCase() || "STUDENT") as UserRole;

    if (!validRoles.includes(targetRole)) {
      return res.status(400).json({ success: false, message: "Invalid role selected." });
    }

    // 2. Role-specific validation
    if (targetRole === "STUDENT") {
      if (!collegeName || !degree || !department) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required student details (College, Degree, Department).",
        });
      }
    } else if (targetRole === "INDUSTRY") {
      if (!companyName || !companyWebsite) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required industry details (Company Name, Website).",
        });
      }
    } else if (targetRole === "FACULTY") {
      if (!institutionName || !department || !designation) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required faculty details (Institution, Department, Designation).",
        });
      }
    } else if (targetRole === "INSTITUTION") {
      if (!institutionName || !institutionType) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required institution details (Institution Name, Type).",
        });
      }
    }

    // 3. Check for Duplicate Account
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists. Please sign in instead.",
      });
    }

    // 4. Hash Password
    const passwordHash = await hashPassword(password);

    // 5. Create User + Role Profile Transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          passwordHash,
          role: targetRole,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        },
      });

      if (targetRole === "STUDENT") {
        await tx.studentProfile.create({
          data: {
            userId: user.id,
            collegeName: collegeName?.trim() || "Institute of Technology",
            degree: degree?.trim() || "B.Tech",
            department: department?.trim() || "Computer Science & Engineering",
            graduationYear: Number(graduationYear) || 2026,
            cgpa: 8.5,
          },
        });
      } else if (targetRole === "INDUSTRY") {
        await tx.industryProfile.create({
          data: {
            userId: user.id,
            companyName: companyName?.trim() || "Tech Corp",
            companyWebsite: companyWebsite?.trim() || "https://example.com",
            designation: "Talent Acquisition Lead",
          },
        });
      } else if (targetRole === "FACULTY") {
        await tx.facultyProfile.create({
          data: {
            userId: user.id,
            institutionName: institutionName?.trim() || "University Campus",
            department: department?.trim() || "Computer Science",
            designation: designation?.trim() || "Assistant Professor",
          },
        });
      } else if (targetRole === "INSTITUTION") {
        await tx.institutionProfile.create({
          data: {
            userId: user.id,
            institutionName: institutionName?.trim() || "University Campus",
            institutionType: institutionType || "Affiliated Engineering College",
            officialEmail: email.toLowerCase().trim(),
          },
        });
      }

      return user;
    });

    // 6. Fetch complete created session
    const fullUser = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: {
        studentProfile: true,
        industryProfile: true,
        facultyProfile: true,
        institutionProfile: true,
      },
    });

    const userSession: UserSession = {
      id: fullUser!.id,
      email: fullUser!.email,
      name: fullUser!.name,
      role: fullUser!.role as UserRole,
      avatarUrl: fullUser!.avatarUrl || undefined,
      studentProfile: fullUser!.studentProfile || undefined,
      industryProfile: fullUser!.industryProfile || undefined,
      facultyProfile: fullUser!.facultyProfile || undefined,
      institutionProfile: fullUser!.institutionProfile || undefined,
    };

    const token = signJwtToken(userSession);

    // Set secure cookie
    res.setHeader(
      "Set-Cookie",
      `sih_token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to bridgeNext ai.",
      data: {
        user: userSession,
        token,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected server error occurred during registration. Please try again later.",
    });
  }
}
