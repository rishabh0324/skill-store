import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token =
    req.cookies.sih_token ||
    req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const session = token ? verifyJwtToken(token) : null;

  if (req.method === "GET") {
    try {
      const { category } = req.query;

      // 1. Fetch Master Skills
      const masterSkills = await prisma.skill.findMany({
        where: category && typeof category === "string" ? { category } : undefined,
        orderBy: { name: "asc" },
      });

      let studentSkillsMap: Record<string, any> = {};

      // 2. If student is logged in, fetch their specific skill verification records
      if (session && session.role === "STUDENT") {
        const studentProfile = await prisma.studentProfile.findUnique({
          where: { userId: session.id },
          include: {
            skills: {
              include: { skill: true },
            },
          },
        });

        if (studentProfile) {
          studentProfile.skills.forEach((ss) => {
            studentSkillsMap[ss.skillId] = ss;
          });
        }
      }

      const formattedSkills = masterSkills.map((s) => {
        const studentRecord = studentSkillsMap[s.id];
        return {
          id: s.id,
          name: s.name,
          category: s.category,
          description: s.description,
          industryBenchmark: s.industryBenchmark,
          icon: s.icon,
          selfScore: studentRecord?.selfScore ?? 50.0,
          verifiedScore: studentRecord?.verifiedScore ?? null,
          verificationStatus: studentRecord?.verificationStatus ?? "NOT_STARTED",
          badgeEarned: studentRecord?.badgeEarned ?? null,
          isVerified: studentRecord?.verificationStatus === "ASSESSMENT_VERIFIED",
          verifiedAt: studentRecord?.verifiedAt ?? null,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Skills retrieved successfully",
        data: formattedSkills,
      });
    } catch (error: any) {
      console.error("Error fetching skills:", error);
      return res.status(500).json({ success: false, message: "Internal server error fetching skills" });
    }
  }

  if (req.method === "POST") {
    try {
      if (!session || session.role !== "STUDENT") {
        return res.status(401).json({ success: false, message: "Only authenticated students can self-report skills" });
      }

      const { name, category, selfScore } = req.body;

      if (!name || typeof name !== "string") {
        return res.status(400).json({ success: false, message: "Skill name is required" });
      }

      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: session.id },
      });

      if (!studentProfile) {
        return res.status(404).json({ success: false, message: "Student profile not found" });
      }

      // Upsert master skill if new
      const skillRecord = await prisma.skill.upsert({
        where: { name: name.trim() },
        update: {},
        create: {
          name: name.trim(),
          category: category || "Languages",
          description: `Self-reported competence in ${name.trim()}`,
          industryBenchmark: 75.0,
          icon: "Sparkles",
        },
      });

      const parsedScore = Math.min(100, Math.max(0, Number(selfScore) || 70.0));

      // Upsert Student Skill
      const studentSkill = await prisma.studentSkill.upsert({
        where: {
          studentProfileId_skillId: {
            studentProfileId: studentProfile.id,
            skillId: skillRecord.id,
          },
        },
        update: {
          selfScore: parsedScore,
        },
        create: {
          studentProfileId: studentProfile.id,
          skillId: skillRecord.id,
          selfScore: parsedScore,
          verificationStatus: "SELF_REPORTED",
        },
        include: { skill: true },
      });

      return res.status(201).json({
        success: true,
        message: "Skill recorded in competency radar",
        data: {
          id: studentSkill.skill.id,
          name: studentSkill.skill.name,
          category: studentSkill.skill.category,
          selfScore: studentSkill.selfScore,
          verifiedScore: studentSkill.verifiedScore,
          verificationStatus: studentSkill.verificationStatus,
          industryBenchmark: studentSkill.skill.industryBenchmark,
          isVerified: studentSkill.verificationStatus === "ASSESSMENT_VERIFIED",
        },
      });
    } catch (error: any) {
      console.error("Error reporting skill:", error);
      return res.status(500).json({ success: false, message: "Internal server error saving skill" });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
