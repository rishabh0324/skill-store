import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const token =
      req.cookies.sih_token ||
      req.headers.authorization?.replace(/^Bearer\s+/i, "");
    const session = token ? verifyJwtToken(token) : null;

    const assessments = await prisma.assessment.findMany({
      include: {
        skill: true,
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    let studentAttemptsMap: Record<string, any> = {};

    if (session) {
      const attempts = await prisma.assessmentAttempt.findMany({
        where: { userId: session.id },
        orderBy: { completedAt: "desc" },
      });

      attempts.forEach((a) => {
        if (!studentAttemptsMap[a.assessmentId] || a.isPassed) {
          studentAttemptsMap[a.assessmentId] = a;
        }
      });
    }

    const formatted = assessments.map((a) => {
      const attempt = studentAttemptsMap[a.id];
      return {
        id: a.id,
        skillId: a.skillId,
        skillName: a.skill.name,
        category: a.skill.category,
        title: a.title,
        description: a.description,
        difficulty: a.difficulty,
        durationMinutes: a.durationMinutes,
        totalQuestions: a.totalQuestions || a._count.questions,
        passingScore: a.passingScore,
        badgeReward: a.badgeReward,
        status: attempt ? (attempt.isPassed ? "passed" : "failed") : "available",
        bestScore: attempt ? attempt.score : null,
        isCompleted: !!attempt && attempt.isPassed,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Assessments retrieved successfully",
      data: formatted,
    });
  } catch (error: any) {
    console.error("Error fetching assessments:", error);
    return res.status(500).json({ success: false, message: "Internal server error fetching assessments" });
  }
}
