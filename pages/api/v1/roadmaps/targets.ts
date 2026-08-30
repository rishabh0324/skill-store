import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const roles = await prisma.targetRole.findMany({
      orderBy: { createdAt: "asc" },
    });

    const formatted = roles.map((r) => {
      let requiredSkills = [];
      try {
        requiredSkills = JSON.parse(r.requiredSkillsJson);
      } catch (e) {
        requiredSkills = [];
      }

      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        category: r.category,
        description: r.description,
        avgSalaryRange: r.avgSalaryRange,
        industryDemandLevel: r.industryDemandLevel,
        icon: r.icon,
        requiredSkills,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Target career roles retrieved successfully",
      data: formatted,
    });
  } catch (error: any) {
    console.error("Error fetching target roles:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching target roles",
    });
  }
}
