import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const token =
      req.cookies.sih_token ||
      req.headers.authorization?.replace(/^Bearer\s+/i, "");
    const session = token ? verifyJwtToken(token) : null;

    if (!session || session.role !== "STUDENT") {
      return res.status(401).json({
        success: false,
        message: "Only authenticated students can update roadmap milestones",
      });
    }

    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ success: false, message: "Milestone step ID is required" });
    }

    const { isCompleted } = req.body;
    const completedFlag = typeof isCompleted === "boolean" ? isCompleted : true;

    // Find milestone
    const milestone = await prisma.roadmapMilestone.findUnique({
      where: { id },
      include: {
        roadmap: {
          include: {
            studentProfile: true,
            milestones: true,
          },
        },
      },
    });

    if (!milestone) {
      return res.status(404).json({ success: false, message: "Milestone step not found" });
    }

    // Check ownership
    if (milestone.roadmap.studentProfile.userId !== session.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not own this roadmap milestone",
      });
    }

    // Update milestone
    const updatedMilestone = await prisma.roadmapMilestone.update({
      where: { id },
      data: {
        isCompleted: completedFlag,
        completedAt: completedFlag ? new Date() : null,
      },
    });

    // Recalculate roadmap progress
    const allMilestones = await prisma.roadmapMilestone.findMany({
      where: { roadmapId: milestone.roadmapId },
    });

    const totalCount = allMilestones.length;
    const completedCount = allMilestones.filter((m) => m.isCompleted).length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const updatedRoadmap = await prisma.learningRoadmap.update({
      where: { id: milestone.roadmapId },
      data: {
        progressPercent,
        status: progressPercent === 100 ? "COMPLETED" : "ACTIVE",
      },
      include: {
        milestones: {
          orderBy: { stepNumber: "asc" },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Milestone step "${updatedMilestone.title}" ${completedFlag ? "completed" : "marked in progress"}`,
      data: {
        milestone: updatedMilestone,
        roadmap: {
          id: updatedRoadmap.id,
          targetRole: updatedRoadmap.roleTitle,
          roleTitle: updatedRoadmap.roleTitle,
          progressPercent: updatedRoadmap.progressPercent,
          status: updatedRoadmap.status,
          steps: updatedRoadmap.milestones.map((m) => ({
            id: m.id,
            stepNumber: m.stepNumber,
            title: m.title,
            description: m.description,
            skillName: m.skillName,
            gapDelta: m.gapDelta,
            resourceType: m.resourceType,
            resourceUrl: m.resourceUrl,
            provider: m.provider,
            estimatedHours: m.estimatedHours,
            isCompleted: m.isCompleted,
            completedAt: m.completedAt,
          })),
        },
      },
    });
  } catch (error: any) {
    console.error("Error updating roadmap milestone:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error updating milestone",
    });
  }
}
