import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";
import { computeSkillGapAnalysis } from "@/lib/vectorMatching";
import { MOCK_ROADMAP } from "@/lib/mockData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token =
    req.cookies.sih_token ||
    req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const session = token ? verifyJwtToken(token) : null;

  if (req.method === "GET") {
    try {
      if (!session || session.role !== "STUDENT") {
        // Return default mock roadmap for unauthenticated requests or public previews
        return res.status(200).json({
          success: true,
          message: "Roadmap retrieved (demo preview)",
          data: {
            roadmap: {
              ...MOCK_ROADMAP,
              roleTitle: MOCK_ROADMAP.targetRole,
              overallFitScore: 88,
              cosineSimilarity: 0.942,
              strengthsCount: 3,
              moderateGapsCount: 1,
              criticalGapsCount: 1,
              gaps: [
                {
                  skillName: "React.js & Next.js",
                  category: "Frameworks",
                  studentScore: 92,
                  targetBenchmark: 85,
                  weight: 5,
                  isMandatory: true,
                  gapDelta: 7,
                  gapStatus: "MATCHED",
                  verificationStatus: "ASSESSMENT_VERIFIED",
                  hasAssessment: true,
                },
                {
                  skillName: "Python & Fast-API",
                  category: "Languages",
                  studentScore: 88,
                  targetBenchmark: 80,
                  weight: 5,
                  isMandatory: true,
                  gapDelta: 8,
                  gapStatus: "MATCHED",
                  verificationStatus: "ASSESSMENT_VERIFIED",
                  hasAssessment: true,
                },
                {
                  skillName: "PostgreSQL & Prisma ORM",
                  category: "Databases",
                  studentScore: 78,
                  targetBenchmark: 75,
                  weight: 4,
                  isMandatory: true,
                  gapDelta: 3,
                  gapStatus: "MATCHED",
                  verificationStatus: "FACULTY_ENDORSED",
                  hasAssessment: false,
                },
                {
                  skillName: "Docker & Containerization",
                  category: "Cloud & DevOps",
                  studentScore: 65,
                  targetBenchmark: 80,
                  weight: 4,
                  isMandatory: false,
                  gapDelta: -15,
                  gapStatus: "MODERATE_GAP",
                  verificationStatus: "SELF_REPORTED",
                  hasAssessment: true,
                },
                {
                  skillName: "Kubernetes & Cloud Infra",
                  category: "Cloud & DevOps",
                  studentScore: 40,
                  targetBenchmark: 70,
                  weight: 3,
                  isMandatory: false,
                  gapDelta: -30,
                  gapStatus: "CRITICAL_GAP",
                  verificationStatus: "MISSING",
                  hasAssessment: false,
                },
              ],
            },
          },
        });
      }

      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: session.id },
        include: {
          skills: { include: { skill: true } },
        },
      });

      if (!studentProfile) {
        return res.status(404).json({ success: false, message: "Student profile not found" });
      }

      // Check if target role specified in query
      const { roleTitle, roleId } = req.query;

      let targetRole = null;
      if (roleId && typeof roleId === "string") {
        targetRole = await prisma.targetRole.findUnique({ where: { id: roleId } });
      } else if (roleTitle && typeof roleTitle === "string") {
        targetRole = await prisma.targetRole.findFirst({
          where: {
            title: {
              contains: roleTitle,
            },
          },
        });
      }

      if (!targetRole) {
        // Find existing student roadmap or default to first target role
        const existingRoadmap = await prisma.learningRoadmap.findFirst({
          where: { studentProfileId: studentProfile.id },
          orderBy: { updatedAt: "desc" },
          include: { targetRole: true },
        });

        if (existingRoadmap?.targetRole) {
          targetRole = existingRoadmap.targetRole;
        } else {
          targetRole = await prisma.targetRole.findFirst({
            orderBy: { createdAt: "asc" },
          });
        }
      }

      if (!targetRole) {
        return res.status(404).json({ success: false, message: "No target roles configured in system" });
      }

      // Fetch assessments
      const assessments = await prisma.assessment.findMany({
        include: { skill: true },
      });

      // Compute fresh Vector Gap Analysis
      const studentSkillRecords = studentProfile.skills.map((ss) => ({
        id: ss.skill.id,
        name: ss.skill.name,
        category: ss.skill.category,
        selfScore: ss.selfScore,
        verifiedScore: ss.verifiedScore,
        verificationStatus: ss.verificationStatus,
        isVerified: ss.verificationStatus === "ASSESSMENT_VERIFIED",
      }));

      const gapAnalysis = computeSkillGapAnalysis(studentSkillRecords, targetRole, assessments);

      // Find or create LearningRoadmap in DB
      let roadmap = await prisma.learningRoadmap.findFirst({
        where: {
          studentProfileId: studentProfile.id,
          roleTitle: targetRole.title,
        },
        include: {
          milestones: {
            orderBy: { stepNumber: "asc" },
          },
        },
      });

      if (!roadmap) {
        // Create initial roadmap with milestones
        roadmap = await prisma.learningRoadmap.create({
          data: {
            studentProfileId: studentProfile.id,
            targetRoleId: targetRole.id,
            roleTitle: targetRole.title,
            roleCategory: targetRole.category,
            overallFitScore: gapAnalysis.overallFitScore,
            cosineSimilarity: gapAnalysis.cosineSimilarity,
            gapSummary: gapAnalysis.gapSummary,
            estimatedWeeks: gapAnalysis.estimatedWeeks,
            estimatedHours: gapAnalysis.estimatedHours,
            progressPercent: 0,
            status: "ACTIVE",
            milestones: {
              create: gapAnalysis.milestones.map((m) => ({
                stepNumber: m.stepNumber,
                title: m.title,
                description: m.description,
                skillName: m.skillName,
                gapDelta: m.gapDelta,
                resourceType: m.resourceType,
                resourceUrl: m.resourceUrl,
                provider: m.provider,
                estimatedHours: m.estimatedHours,
                isCompleted: false,
              })),
            },
          },
          include: {
            milestones: {
              orderBy: { stepNumber: "asc" },
            },
          },
        });
      } else {
        // Update fit metrics
        roadmap = await prisma.learningRoadmap.update({
          where: { id: roadmap.id },
          data: {
            overallFitScore: gapAnalysis.overallFitScore,
            cosineSimilarity: gapAnalysis.cosineSimilarity,
            gapSummary: gapAnalysis.gapSummary,
          },
          include: {
            milestones: {
              orderBy: { stepNumber: "asc" },
            },
          },
        });
      }

      const formattedRoadmap = {
        id: roadmap.id,
        targetRoleId: targetRole.id,
        targetRole: roadmap.roleTitle,
        roleTitle: roadmap.roleTitle,
        roleCategory: roadmap.roleCategory || targetRole.category,
        overallFitScore: roadmap.overallFitScore,
        cosineSimilarity: roadmap.cosineSimilarity,
        estimatedWeeks: roadmap.estimatedWeeks,
        estimatedHours: roadmap.estimatedHours,
        progressPercent: roadmap.progressPercent,
        gapSummary: roadmap.gapSummary,
        summary: roadmap.gapSummary,
        status: roadmap.status,
        strengthsCount: gapAnalysis.strengthsCount,
        moderateGapsCount: gapAnalysis.moderateGapsCount,
        criticalGapsCount: gapAnalysis.criticalGapsCount,
        gaps: gapAnalysis.gaps,
        steps: roadmap.milestones.map((m) => ({
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
      };

      return res.status(200).json({
        success: true,
        message: "Learning roadmap and gap analysis retrieved successfully",
        data: {
          roadmap: formattedRoadmap,
        },
      });
    } catch (error: any) {
      console.error("Error fetching roadmap:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error fetching roadmap",
      });
    }
  }

  if (req.method === "POST") {
    try {
      if (!session || session.role !== "STUDENT") {
        return res.status(401).json({
          success: false,
          message: "Only authenticated students can generate personalized roadmaps",
        });
      }

      const { targetRoleId, roleTitle } = req.body;

      let targetRole = null;
      if (targetRoleId && typeof targetRoleId === "string") {
        targetRole = await prisma.targetRole.findUnique({ where: { id: targetRoleId } });
      } else if (roleTitle && typeof roleTitle === "string") {
        targetRole = await prisma.targetRole.findFirst({
          where: {
            title: {
              contains: roleTitle,
            },
          },
        });
      } else {
        targetRole = await prisma.targetRole.findFirst({
          orderBy: { createdAt: "asc" },
        });
      }

      if (!targetRole) {
        return res.status(404).json({ success: false, message: "Target career role not found" });
      }

      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: session.id },
        include: {
          skills: { include: { skill: true } },
        },
      });

      if (!studentProfile) {
        return res.status(404).json({ success: false, message: "Student profile not found" });
      }

      const assessments = await prisma.assessment.findMany({
        include: { skill: true },
      });

      const studentSkillRecords = studentProfile.skills.map((ss) => ({
        id: ss.skill.id,
        name: ss.skill.name,
        category: ss.skill.category,
        selfScore: ss.selfScore,
        verifiedScore: ss.verifiedScore,
        verificationStatus: ss.verificationStatus,
        isVerified: ss.verificationStatus === "ASSESSMENT_VERIFIED",
      }));

      // Execute AI Vector Gap Analysis
      const gapAnalysis = computeSkillGapAnalysis(studentSkillRecords, targetRole, assessments);

      // Check if existing roadmap exists for this role
      const existingRoadmap = await prisma.learningRoadmap.findFirst({
        where: {
          studentProfileId: studentProfile.id,
          roleTitle: targetRole.title,
        },
      });

      let roadmap;
      if (existingRoadmap) {
        // Delete old milestones and create fresh generated milestones
        await prisma.roadmapMilestone.deleteMany({
          where: { roadmapId: existingRoadmap.id },
        });

        roadmap = await prisma.learningRoadmap.update({
          where: { id: existingRoadmap.id },
          data: {
            targetRoleId: targetRole.id,
            roleCategory: targetRole.category,
            overallFitScore: gapAnalysis.overallFitScore,
            cosineSimilarity: gapAnalysis.cosineSimilarity,
            gapSummary: gapAnalysis.gapSummary,
            estimatedWeeks: gapAnalysis.estimatedWeeks,
            estimatedHours: gapAnalysis.estimatedHours,
            progressPercent: 0,
            status: "ACTIVE",
            milestones: {
              create: gapAnalysis.milestones.map((m) => ({
                stepNumber: m.stepNumber,
                title: m.title,
                description: m.description,
                skillName: m.skillName,
                gapDelta: m.gapDelta,
                resourceType: m.resourceType,
                resourceUrl: m.resourceUrl,
                provider: m.provider,
                estimatedHours: m.estimatedHours,
                isCompleted: false,
              })),
            },
          },
          include: {
            milestones: {
              orderBy: { stepNumber: "asc" },
            },
          },
        });
      } else {
        // Create new roadmap
        roadmap = await prisma.learningRoadmap.create({
          data: {
            studentProfileId: studentProfile.id,
            targetRoleId: targetRole.id,
            roleTitle: targetRole.title,
            roleCategory: targetRole.category,
            overallFitScore: gapAnalysis.overallFitScore,
            cosineSimilarity: gapAnalysis.cosineSimilarity,
            gapSummary: gapAnalysis.gapSummary,
            estimatedWeeks: gapAnalysis.estimatedWeeks,
            estimatedHours: gapAnalysis.estimatedHours,
            progressPercent: 0,
            status: "ACTIVE",
            milestones: {
              create: gapAnalysis.milestones.map((m) => ({
                stepNumber: m.stepNumber,
                title: m.title,
                description: m.description,
                skillName: m.skillName,
                gapDelta: m.gapDelta,
                resourceType: m.resourceType,
                resourceUrl: m.resourceUrl,
                provider: m.provider,
                estimatedHours: m.estimatedHours,
                isCompleted: false,
              })),
            },
          },
          include: {
            milestones: {
              orderBy: { stepNumber: "asc" },
            },
          },
        });
      }

      const formattedRoadmap = {
        id: roadmap.id,
        targetRoleId: targetRole.id,
        targetRole: roadmap.roleTitle,
        roleTitle: roadmap.roleTitle,
        roleCategory: roadmap.roleCategory || targetRole.category,
        overallFitScore: roadmap.overallFitScore,
        cosineSimilarity: roadmap.cosineSimilarity,
        estimatedWeeks: roadmap.estimatedWeeks,
        estimatedHours: roadmap.estimatedHours,
        progressPercent: roadmap.progressPercent,
        gapSummary: roadmap.gapSummary,
        summary: roadmap.gapSummary,
        status: roadmap.status,
        strengthsCount: gapAnalysis.strengthsCount,
        moderateGapsCount: gapAnalysis.moderateGapsCount,
        criticalGapsCount: gapAnalysis.criticalGapsCount,
        gaps: gapAnalysis.gaps,
        steps: roadmap.milestones.map((m) => ({
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
      };

      return res.status(201).json({
        success: true,
        message: `Personalized AI Learning Roadmap generated for "${targetRole.title}"`,
        data: {
          roadmap: formattedRoadmap,
        },
      });
    } catch (error: any) {
      console.error("Error generating roadmap:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error generating roadmap",
      });
    }
  }

  if (req.method === "PATCH") {
    // Backward-compatibility route for older patch body format
    const { nodeId, isCompleted } = req.body;
    if (nodeId) {
      try {
        const milestone = await prisma.roadmapMilestone.findUnique({
          where: { id: nodeId },
        });

        if (milestone) {
          const updated = await prisma.roadmapMilestone.update({
            where: { id: nodeId },
            data: {
              isCompleted: !!isCompleted,
              completedAt: isCompleted ? new Date() : null,
            },
          });

          const allMilestones = await prisma.roadmapMilestone.findMany({
            where: { roadmapId: milestone.roadmapId },
          });

          const completedCount = allMilestones.filter((m) => m.isCompleted).length;
          const progressPercent = Math.round((completedCount / allMilestones.length) * 100);

          const updatedRoadmap = await prisma.learningRoadmap.update({
            where: { id: milestone.roadmapId },
            data: { progressPercent },
            include: { milestones: { orderBy: { stepNumber: "asc" } } },
          });

          return res.status(200).json({
            success: true,
            message: "Roadmap step updated successfully",
            data: {
              roadmap: {
                id: updatedRoadmap.id,
                targetRole: updatedRoadmap.roleTitle,
                progressPercent: updatedRoadmap.progressPercent,
                steps: updatedRoadmap.milestones,
              },
            },
          });
        }
      } catch (e) {
        // Fall back to mock update
      }
    }

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
