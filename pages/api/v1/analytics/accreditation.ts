import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const accreditationData = {
      institutionName: "National Institute of Technology",
      institutionCode: "NIT-01",
      academicYear: "2025-2026",
      nirfMetrics: {
        rankingTier: "Top 10 Tier-1 Institute",
        nirfRank: 9,
        medianSalaryGraduating: "₹16,50,000",
        graduatingCohortSize: 540,
        placedOnCampus: 475,
        higherStudiesProgression: 45,
        entrepreneurshipFounders: 12,
        placementPercentage: 88.0,
      },
      naacMetrics: {
        criterion2_6: {
          title: "Student Performance and Learning Outcomes (OBE)",
          poAttainmentScore: 3.82, // Out of 4.0
          coAttainmentScore: 3.75, // Out of 4.0
          status: "EXCEEDS_BENCHMARK",
          verifiedBadgesAwarded: 1240,
          facultyEndorsementsRecorded: 410,
        },
        criterion5_2: {
          title: "Student Progression and Career Placements",
          qualifyingRate: 94.2,
          corporatePartnerCount: 48,
          averageAnnualCTC: "₹18,40,000",
          topRecruiters: ["Microsoft", "Google", "Razorpay", "Tata Elxsi", "Amazon"],
        },
      },
      nbaProgramOutcomes: [
        { po: "PO1: Engineering Knowledge", attainment: 92.4, target: 85.0, status: "ATTAINED" },
        { po: "PO2: Problem Analysis", attainment: 89.8, target: 80.0, status: "ATTAINED" },
        { po: "PO3: Design/Development of Solutions", attainment: 91.2, target: 80.0, status: "ATTAINED" },
        { po: "PO4: Conduct Investigations of Complex Problems", attainment: 86.5, target: 75.0, status: "ATTAINED" },
        { po: "PO5: Modern Tool Usage (Next.js, PyTorch, Docker)", attainment: 94.0, target: 85.0, status: "ATTAINED" },
        { po: "PO8: Ethics & Professionalism", attainment: 96.0, target: 90.0, status: "ATTAINED" },
        { po: "PO12: Life-long Learning & Adaptive Upskilling", attainment: 93.5, target: 80.0, status: "ATTAINED" },
      ],
      generatedAt: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      message: "NAAC/NIRF accreditation compliance telemetry generated successfully",
      data: {
        accreditation: accreditationData,
      },
    });
  } catch (error: any) {
    console.error("Error generating accreditation telemetry:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error generating accreditation data",
    });
  }
}
