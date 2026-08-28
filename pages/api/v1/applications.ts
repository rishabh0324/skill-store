import type { NextApiRequest, NextApiResponse } from "next";
import { MOCK_CANDIDATES } from "@/lib/mockData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { status } = req.query;
    let candidates = [...MOCK_CANDIDATES];

    if (status && typeof status === "string") {
      candidates = candidates.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      message: "Success",
      data: {
        candidates,
        totalCount: candidates.length,
      },
    });
  }

  if (req.method === "POST") {
    const { jobId } = req.body;
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: {
        applicationId: `app-${Date.now()}`,
        jobId,
        status: "APPLIED",
        appliedAt: new Date().toISOString(),
        matchScore: 92,
      },
    });
  }

  if (req.method === "PATCH") {
    const { candidateId, status } = req.body;
    return res.status(200).json({
      success: true,
      message: `Candidate status advanced to ${status}`,
      data: {
        candidateId,
        updatedStatus: status,
      },
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
