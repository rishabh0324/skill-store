import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const token =
      req.cookies.sih_token ||
      req.headers.authorization?.replace(/^Bearer\s+/i, "");
    const session = token ? verifyJwtToken(token) : null;

    if (!session) {
      return res.status(401).json({ success: false, message: "Authentication required to submit assessment" });
    }

    const { id: assessmentId } = req.query;
    const { answers = {}, timeSpentSeconds = 0 } = req.body;

    if (!assessmentId || typeof assessmentId !== "string") {
      return res.status(400).json({ success: false, message: "Invalid assessment ID" });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        skill: true,
        questions: true,
      },
    });

    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    // Evaluate answers
    const totalQuestions = assessment.questions.length;
    let correctCount = 0;

    const review = assessment.questions.map((q) => {
      const selectedIndex = answers[q.id] !== undefined ? Number(answers[q.id]) : -1;
      const isCorrect = selectedIndex === q.correctOptionIndex;
      if (isCorrect) correctCount++;

      let options: string[] = [];
      try {
        options = JSON.parse(q.optionsJson);
      } catch (e) {
        options = [];
      }

      return {
        questionId: q.id,
        questionText: q.questionText,
        options,
        selectedOptionIndex: selectedIndex,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100 * 10) / 10 : 0;
    const isPassed = scorePercentage >= assessment.passingScore;

    // Save Attempt
    await prisma.assessmentAttempt.create({
      data: {
        userId: session.id,
        assessmentId: assessment.id,
        score: scorePercentage,
        isPassed,
        answersJson: JSON.stringify(answers),
        timeSpentSeconds: Number(timeSpentSeconds) || 0,
      },
    });

    let badgeEarned: string | null = null;

    // If passed, upgrade StudentSkill record and award badge
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.id },
    });

    if (studentProfile && isPassed) {
      badgeEarned = assessment.badgeReward;

      await prisma.studentSkill.upsert({
        where: {
          studentProfileId_skillId: {
            studentProfileId: studentProfile.id,
            skillId: assessment.skillId,
          },
        },
        update: {
          verifiedScore: scorePercentage,
          verificationStatus: "ASSESSMENT_VERIFIED",
          badgeEarned,
          verifiedAt: new Date(),
        },
        create: {
          studentProfileId: studentProfile.id,
          skillId: assessment.skillId,
          selfScore: Math.max(scorePercentage, 70),
          verifiedScore: scorePercentage,
          verificationStatus: "ASSESSMENT_VERIFIED",
          badgeEarned,
          verifiedAt: new Date(),
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: isPassed
        ? `Congratulations! You passed with ${scorePercentage}% and earned the ${assessment.badgeReward} badge!`
        : `Assessment completed. You scored ${scorePercentage}%. Minimum required to pass is ${assessment.passingScore}%.`,
      data: {
        isPassed,
        score: scorePercentage,
        passingScore: assessment.passingScore,
        totalQuestions,
        correctCount,
        badgeEarned: isPassed ? badgeEarned : null,
        timeSpentSeconds,
        review,
      },
    });
  } catch (error: any) {
    console.error("Assessment submission evaluation error:", error);
    return res.status(500).json({ success: false, message: "Internal server error grading assessment" });
  }
}
