import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken, getUserWithProfile, signJwtToken } from "@/lib/auth";
import { UserSession, UserRole } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const token =
      req.cookies.sih_token ||
      req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in to complete your onboarding.",
      });
    }

    const decoded = verifyJwtToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid session or expired token. Please log in again.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        studentProfile: true,
        industryProfile: true,
        facultyProfile: true,
        institutionProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User account not found." });
    }

    const role = user.role as UserRole;
    const body = req.body;

    if (role === "STUDENT") {
      const {
        phone,
        bio,
        avatarUrl,
        collegeName,
        university,
        degree,
        department,
        currentYear,
        currentSemester,
        graduationYear,
        cgpa,
        rollNo,
        skills,
        softSkills,
        certifications,
        experienceSummary,
        targetJobRole,
        preferredLocation,
        preferredIndustry,
      } = body;

      // Update User & StudentProfile
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: {
            phone: phone || user.phone,
            avatarUrl: avatarUrl || user.avatarUrl,
            isOnboarded: true,
          },
        });

        const studentProfile = await tx.studentProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            collegeName: collegeName || "National Institute of Technology",
            university: university || "Central Technical University",
            degree: degree || "B.Tech",
            department: department || "Computer Science & Engineering",
            currentYear: Number(currentYear) || 3,
            currentSemester: Number(currentSemester) || 6,
            graduationYear: Number(graduationYear) || 2026,
            cgpa: cgpa ? parseFloat(cgpa) : 8.5,
            rollNo: rollNo || null,
            bio: bio || null,
            targetJobRole: targetJobRole || "Full-Stack AI Solutions Architect",
            preferredLocation: preferredLocation || "Bengaluru / Remote",
            preferredIndustry: preferredIndustry || "AI & Cloud Software",
            softSkills: softSkills || "Problem Solving, Critical Thinking, Teamwork",
            certifications: certifications || null,
            experienceSummary: experienceSummary || null,
          },
          update: {
            collegeName: collegeName || undefined,
            university: university || undefined,
            degree: degree || undefined,
            department: department || undefined,
            currentYear: currentYear ? Number(currentYear) : undefined,
            currentSemester: currentSemester ? Number(currentSemester) : undefined,
            graduationYear: graduationYear ? Number(graduationYear) : undefined,
            cgpa: cgpa !== undefined ? parseFloat(cgpa) : undefined,
            rollNo: rollNo || undefined,
            bio: bio || undefined,
            targetJobRole: targetJobRole || undefined,
            preferredLocation: preferredLocation || undefined,
            preferredIndustry: preferredIndustry || undefined,
            softSkills: softSkills || undefined,
            certifications: certifications || undefined,
            experienceSummary: experienceSummary || undefined,
          },
        });

        // Seed initial student skills if passed
        if (Array.isArray(skills) && skills.length > 0) {
          for (const s of skills) {
            if (!s.name) continue;
            // Find or create skill in master taxonomy
            const masterSkill = await tx.skill.upsert({
              where: { name: s.name.trim() },
              create: {
                name: s.name.trim(),
                category: s.category || "Languages",
                industryBenchmark: 80.0,
              },
              update: {},
            });

            await tx.studentSkill.upsert({
              where: {
                studentProfileId_skillId: {
                  studentProfileId: studentProfile.id,
                  skillId: masterSkill.id,
                },
              },
              create: {
                studentProfileId: studentProfile.id,
                skillId: masterSkill.id,
                selfScore: s.selfScore ? parseFloat(s.selfScore) : 70.0,
                verificationStatus: "SELF_REPORTED",
              },
              update: {
                selfScore: s.selfScore ? parseFloat(s.selfScore) : undefined,
              },
            });
          }
        }
      });
    } else if (role === "INDUSTRY") {
      const {
        phone,
        designation,
        companyName,
        companyWebsite,
        domain,
        companyDescription,
        companySize,
        location,
        hiringAreas,
        skillsRequired,
      } = body;

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: {
            phone: phone || user.phone,
            isOnboarded: true,
          },
        });

        await tx.industryProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            companyName: companyName || "Tech Innovations Corp",
            companyWebsite: companyWebsite || "https://example.com",
            designation: designation || "Talent Acquisition Specialist",
            domain: domain || "Cloud & AI Software",
            companyDescription: companyDescription || "Enterprise software development and intelligence solutions.",
            companySize: companySize || "100-500",
            location: location || "Bengaluru / Hybrid",
            hiringAreas: hiringAreas || "Full-Stack, Data Engineering",
            skillsRequired: skillsRequired || "React, TypeScript, Python, PostgreSQL",
          },
          update: {
            companyName: companyName || undefined,
            companyWebsite: companyWebsite || undefined,
            designation: designation || undefined,
            domain: domain || undefined,
            companyDescription: companyDescription || undefined,
            companySize: companySize || undefined,
            location: location || undefined,
            hiringAreas: hiringAreas || undefined,
            skillsRequired: skillsRequired || undefined,
          },
        });
      });
    } else if (role === "FACULTY") {
      const {
        phone,
        institutionName,
        department,
        designation,
        qualifications,
        specialization,
        researchInterests,
        mentorshipAreas,
      } = body;

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: {
            phone: phone || user.phone,
            isOnboarded: true,
          },
        });

        await tx.facultyProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            institutionName: institutionName || "National Institute of Technology",
            department: department || "Computer Science & Engineering",
            designation: designation || "Associate Professor",
            qualifications: qualifications || "Ph.D. in Computer Science",
            specialization: specialization || "Distributed Systems & Machine Learning",
            researchInterests: researchInterests || "Cloud Architectures, Vector AI, NEP 2020 OBE",
            mentorshipAreas: mentorshipAreas || "Full-Stack Web, AI Research, Capstone Projects",
          },
          update: {
            institutionName: institutionName || undefined,
            department: department || undefined,
            designation: designation || undefined,
            qualifications: qualifications || undefined,
            specialization: specialization || undefined,
            researchInterests: researchInterests || undefined,
            mentorshipAreas: mentorshipAreas || undefined,
          },
        });
      });
    } else if (role === "INSTITUTION") {
      const {
        phone,
        tpoName,
        tpoDesignation,
        institutionName,
        institutionType,
        universityAffiliation,
        officialEmail,
        website,
        city,
        state,
        address,
        departmentsList,
        studentPopulation,
        code,
        nirfRank,
      } = body;

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: {
            phone: phone || user.phone,
            isOnboarded: true,
          },
        });

        await tx.institutionProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            tpoName: tpoName || user.name,
            tpoDesignation: tpoDesignation || "Head of Training & Placement",
            institutionName: institutionName || "National Institute of Technology",
            institutionType: institutionType || "Tier-1 Autonomous Institute",
            universityAffiliation: universityAffiliation || "Central University Board",
            officialEmail: officialEmail || user.email,
            website: website || "https://institute.ac.in",
            city: city || "Bengaluru",
            state: state || "Karnataka",
            address: address || "Campus Main Avenue",
            departmentsList: departmentsList || "CSE, IT, AI&DS, ECE, EEE",
            studentPopulation: studentPopulation ? Number(studentPopulation) : 3500,
            code: code || "INST-01",
            nirfRank: nirfRank ? Number(nirfRank) : 15,
          },
          update: {
            tpoName: tpoName || undefined,
            tpoDesignation: tpoDesignation || undefined,
            institutionName: institutionName || undefined,
            institutionType: institutionType || undefined,
            universityAffiliation: universityAffiliation || undefined,
            officialEmail: officialEmail || undefined,
            website: website || undefined,
            city: city || undefined,
            state: state || undefined,
            address: address || undefined,
            departmentsList: departmentsList || undefined,
            studentPopulation: studentPopulation ? Number(studentPopulation) : undefined,
            code: code || undefined,
            nirfRank: nirfRank ? Number(nirfRank) : undefined,
          },
        });
      });
    }

    // Retrieve fresh user & profile data
    const freshUser = await getUserWithProfile(user.id);

    if (!freshUser) {
      return res.status(500).json({ success: false, message: "Error loading updated profile." });
    }

    // Sign new JWT with isOnboarded = true
    const updatedSession: UserSession = {
      ...freshUser,
      isOnboarded: true,
    };

    const newToken = signJwtToken(updatedSession);

    res.setHeader(
      "Set-Cookie",
      `sih_token=${newToken}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    );

    return res.status(200).json({
      success: true,
      message: "Onboarding profile saved successfully!",
      data: {
        user: updatedSession,
        token: newToken,
        isOnboarded: true,
      },
    });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while saving your onboarding details. Please try again.",
    });
  }
}
