import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ success: false, message: "Invalid assessment ID" });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        skill: true,
        questions: {
          select: {
            id: true,
            questionText: true,
            optionsJson: true,
          },
        },
      },
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    const sanitizedQuestions = assessment.questions.map((q) => {
      let options: string[] = [];
      try {
        options = JSON.parse(q.optionsJson);
      } catch (e) {
        options = [];
      }
      return {
        id: q.id,
        questionText: q.questionText,
        options,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        id: assessment.id,
        title: assessment.title,
        description: assessment.description,
        difficulty: assessment.difficulty,
        durationMinutes: assessment.durationMinutes,
        totalQuestions: sanitizedQuestions.length,
        passingScore: assessment.passingScore,
        badgeReward: assessment.badgeReward,
        skillName: assessment.skill.name,
        questions: sanitizedQuestions,
      },
    });
  } catch (error: any) {
    console.error("Error retrieving assessment questions:", error);
    return res.status(500).json({ success: false, message: "Internal server error fetching test questions" });
  }
}
