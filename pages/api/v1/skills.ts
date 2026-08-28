import type { NextApiRequest, NextApiResponse } from "next";
import { MOCK_STUDENT_SKILLS } from "@/lib/mockData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { category } = req.query;
    let skills = MOCK_STUDENT_SKILLS;

    if (category && typeof category === "string") {
      skills = skills.filter(
        (s) => (s.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    return res.status(200).json({
      success: true,
      message: "Skills retrieved successfully",
      data: skills,
    });
  }

  if (req.method === "POST") {
    const { name, category, selfScore } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required",
      });
    }

    const newSkill = {
      id: `skill_${Date.now()}`,
      name,
      category: category || "Languages",
      score: selfScore || 70,
      selfScore: selfScore || 70,
      proficiencyLevel: selfScore || 70,
      industryBenchmark: 80,
      isVerified: false,
      verificationStatus: "Self-Reported",
    };

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      data: newSkill,
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
