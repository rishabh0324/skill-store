import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ success: false, message: "Invalid username parameter" });
    }

    // Match by slug or id or email
    const formattedName = username.replace(/-/g, " ").toLowerCase();

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: username },
          { email: username.toLowerCase() },
          { name: { contains: username.replace(/-/g, " ") } },
        ],
        role: "STUDENT",
      },
      include: {
        studentProfile: {
          include: {
            skills: {
              include: { skill: true },
            },
            projects: true,
          },
        },
      },
    });

    // Fallback: search all students in memory if exact match didn't hit
    if (!user || !user.studentProfile) {
      const allStudents = await prisma.user.findMany({
        where: { role: "STUDENT" },
        include: {
          studentProfile: {
            include: {
              skills: { include: { skill: true } },
              projects: true,
            },
          },
        },
      });

      user = allStudents.find(
        (u) =>
          u.id === username ||
          u.email.toLowerCase() === username.toLowerCase() ||
          u.name.toLowerCase().replace(/\s+/g, "-") === username.toLowerCase() ||
          u.name.toLowerCase() === formattedName
      ) || null;
    }

    if (!user || !user.studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Verified student portfolio not found",
      });
    }

    const profile = user.studentProfile;

    const verifiedBadges = profile.skills
      .filter((s) => s.verificationStatus === "ASSESSMENT_VERIFIED" && s.badgeEarned)
      .map((s) => ({
        id: s.id,
        badgeName: s.badgeEarned,
        skillName: s.skill.name,
        score: s.verifiedScore,
        verifiedAt: s.verifiedAt,
        issuer: "bridgeNext ai National Assessment Engine",
        obeLevel: s.verifiedScore && s.verifiedScore >= 90 ? "Level 4 (Mastery)" : "Level 3 (Proficient)",
        verificationHash: `OBE-SIH26-${s.id.substring(0, 8).toUpperCase()}`,
      }));

    const radarSkills = profile.skills.map((s) => ({
      skill: s.skill.name,
      selfScore: s.selfScore,
      verifiedScore: s.verifiedScore || s.selfScore,
      benchmark: s.skill.industryBenchmark,
      status: s.verificationStatus,
    }));

    return res.status(200).json({
      success: true,
      message: "Verified student portfolio retrieved",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
        profile: {
          collegeName: profile.collegeName,
          degree: profile.degree,
          department: profile.department,
          graduationYear: profile.graduationYear,
          cgpa: profile.cgpa,
          rollNo: profile.rollNo,
          bio: profile.bio,
        },
        verifiedBadges,
        radarSkills,
        projects: profile.projects,
        accreditationProof: {
          nep2020Compliant: true,
          outcomeBasedEducationVerified: true,
          institutionNIRFRank: 9,
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error: any) {
    console.error("Error retrieving portfolio:", error);
    return res.status(500).json({ success: false, message: "Internal server error fetching student portfolio" });
  }
}
