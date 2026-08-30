import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        industryProfile: {
          include: { user: true },
        },
        applications: {
          include: {
            studentProfile: {
              include: {
                user: true,
                skills: { include: { skill: true } },
              },
            },
          },
          orderBy: { vectorMatchScore: "desc" },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job posting not found" });
    }

    let requiredSkills = [];
    try {
      requiredSkills = JSON.parse(job.requiredSkillsJson);
    } catch (e) {
      requiredSkills = [];
    }

    return res.status(200).json({
      success: true,
      message: "Job details retrieved successfully",
      data: {
        job: {
          id: job.id,
          title: job.title,
          companyName: job.industryProfile.companyName,
          description: job.description,
          type: job.jobType,
          location: job.location,
          stipendSalary: job.stipendSalary,
          minCgpa: job.minCgpa,
          status: job.status,
          deadline: job.deadline,
          requiredSkills,
          applicantsCount: job.applications.length,
          applicants: job.applications.map((app) => ({
            id: app.id,
            candidateId: app.studentProfileId,
            name: app.studentProfile.user.name,
            email: app.studentProfile.user.email,
            department: app.studentProfile.department,
            degree: app.studentProfile.degree,
            collegeName: app.studentProfile.collegeName,
            cgpa: app.studentProfile.cgpa,
            avatarUrl: app.studentProfile.user.avatarUrl,
            status: app.status,
            matchScore: app.matchScore,
            vectorMatchScore: app.vectorMatchScore,
            appliedAt: app.appliedAt,
            verifiedSkills: app.studentProfile.skills
              .filter((s) => s.verificationStatus === "ASSESSMENT_VERIFIED")
              .map((s) => ({ name: s.skill.name, score: s.verifiedScore })),
          })),
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching job details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching job details",
    });
  }
}
