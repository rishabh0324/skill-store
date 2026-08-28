import type { NextApiRequest, NextApiResponse } from "next";
import { MOCK_JOBS } from "@/lib/mockData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { type } = req.query;
    let jobs = [...MOCK_JOBS];

    if (type && typeof type === "string") {
      jobs = jobs.filter((j) => j.type.toLowerCase() === type.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      message: "Success",
      data: {
        jobs,
        totalCount: jobs.length,
      },
    });
  }

  if (req.method === "POST") {
    const body = req.body;
    const newJob = {
      id: `job-${Date.now()}`,
      companyName: body.companyName || "Recruiter Organization",
      companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80",
      title: body.title,
      type: body.type || "INTERNSHIP",
      location: body.location || "Bengaluru / Hybrid",
      stipendSalary: body.stipendSalary || "₹40,000/mo",
      deadline: body.deadline || "2026-11-30",
      status: "OPEN",
      minCgpa: Number(body.minCgpa) || 7.0,
      matchScore: 85,
      description: body.description || "",
      requiredSkills: body.requiredSkills || [
        { name: "React.js", weight: 5, isMandatory: true },
        { name: "Node.js", weight: 4, isMandatory: true },
      ],
    };

    return res.status(201).json({
      success: true,
      message: "Job opening posted successfully",
      data: { job: newJob },
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
