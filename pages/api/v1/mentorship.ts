import type { NextApiRequest, NextApiResponse } from "next";
import { MOCK_MENTORSHIPS } from "@/lib/mockData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "Success",
      data: {
        sessions: MOCK_MENTORSHIPS,
        totalCount: MOCK_MENTORSHIPS.length,
      },
    });
  }

  if (req.method === "POST") {
    const body = req.body;
    const newSession = {
      id: `mentor-${Date.now()}`,
      facultyName: body.facultyName || "Dr. Ramesh Verma",
      studentName: body.studentName || "Aarav Sharma",
      topic: body.topic,
      scheduledAt: body.scheduledAt || new Date().toISOString(),
      meetingLink: "https://meet.google.com/new-session",
      status: "REQUESTED",
      notes: body.notes || "",
    };

    return res.status(201).json({
      success: true,
      message: "Mentorship slot requested successfully",
      data: { session: newSession },
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
