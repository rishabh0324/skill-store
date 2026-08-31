import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token =
    req.cookies.sih_token ||
    req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const session = token ? verifyJwtToken(token) : null;

  if (!session || session.role !== "ADMIN") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Admin security clearance required",
    });
  }

  if (req.method === "GET") {
    try {
      const [
        totalUsers,
        studentsCount,
        recruitersCount,
        facultyCount,
        institutionsCount,
        jobsCount,
        applicationsCount,
        assessmentsCount,
        attemptsCount,
        skillsCount,
        recentUsers,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.user.count({ where: { role: "INDUSTRY" } }),
        prisma.user.count({ where: { role: "FACULTY" } }),
        prisma.user.count({ where: { role: "INSTITUTION" } }),
        prisma.jobPosting.count(),
        prisma.jobApplication.count(),
        prisma.assessment.count(),
        prisma.assessmentAttempt.count(),
        prisma.skill.count(),
        prisma.user.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        }),
      ]);

      return res.status(200).json({
        success: true,
        message: "System administration telemetry retrieved",
        data: {
          metrics: {
            totalUsers,
            studentsCount,
            recruitersCount,
            facultyCount,
            institutionsCount,
            jobsCount,
            applicationsCount,
            assessmentsCount,
            attemptsCount,
            skillsCount,
            databaseEngine: "SQLite 3 (dev.db) / PostgreSQL Ready",
            authStatus: "JWT + Bcrypt (Salt: 10) Active",
            systemUptime: "100%",
          },
          recentUsers,
        },
      });
    } catch (error: any) {
      console.error("Admin stats error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error fetching admin telemetry",
      });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
