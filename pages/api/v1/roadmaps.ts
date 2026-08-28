import type { NextApiRequest, NextApiResponse } from "next";
import { MOCK_ROADMAP } from "@/lib/mockData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "Success",
      data: { roadmap: MOCK_ROADMAP },
    });
  }

  if (req.method === "PATCH") {
    const { nodeId, isCompleted } = req.body;
    const updatedSteps = MOCK_ROADMAP.steps.map((s) =>
      s.id === nodeId ? { ...s, isCompleted } : s
    );
    const completedCount = updatedSteps.filter((s) => s.isCompleted).length;
    const progressPercent = Math.round((completedCount / updatedSteps.length) * 100);

    return res.status(200).json({
      success: true,
      message: "Roadmap step updated successfully",
      data: {
        roadmap: {
          ...MOCK_ROADMAP,
          steps: updatedSteps,
          progressPercent,
        },
      },
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
