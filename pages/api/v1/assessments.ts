import type { NextApiRequest, NextApiResponse } from "next";
import { MOCK_ASSESSMENTS } from "@/lib/mockData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "Success",
      data: {
        assessments: MOCK_ASSESSMENTS,
        totalAvailable: MOCK_ASSESSMENTS.length,
        completed: MOCK_ASSESSMENTS.filter((a) => a.isCompleted).length,
      },
    });
  }

  if (req.method === "POST") {
    const { assessmentId } = req.body;
    const score = Math.floor(Math.random() * 25) + 75;
    const passed = score >= 70;

    return res.status(200).json({
      success: true,
      message: "Assessment submitted and graded",
      data: {
        attempt: {
          assessmentId,
          score,
          passed,
          badgeUnlocked: passed ? "ASSESSMENT_VERIFIED" : null,
          feedback: passed
            ? "Outstanding performance! Your verified skill profile has been updated."
            : "Keep practicing! Check your recommended learning roadmap.",
        },
      },
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
