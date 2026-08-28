import type { NextApiRequest, NextApiResponse } from "next";
import { MOCK_SKILLS } from "@/lib/mockData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { category } = req.query;
    let skills = [...MOCK_SKILLS];

    if (category && typeof category === "string") {
      skills = skills.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      message: "Success",
      data: {
        skills,
        totalCount: skills.length,
        verifiedCount: skills.filter((s) => s.verificationStatus !== "SELF_REPORTED").length,
      },
    });
  }

  if (req.method === "POST") {
    const { name, category, proficiencyLevel, description } = req.body;
    const newSkill = {
      id: `skill-${Date.now()}`,
      name,
      category: category || "Technical",
      proficiencyLevel: Number(proficiencyLevel) || 1,
      verificationStatus: "SELF_REPORTED",
      description: description || "Self-reported skill entry",
    };

    return res.status(201).json({
      success: true,
      message: "Skill self-reported successfully",
      data: { skill: newSkill },
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
