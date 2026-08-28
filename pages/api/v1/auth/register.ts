import type { NextApiRequest, NextApiResponse } from "next";
import { signJwtToken } from "@/lib/auth";
import { UserRole, UserSession } from "@/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, role, department, institutionName, companyName } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const newUser: UserSession = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: (role?.toUpperCase() || "STUDENT") as UserRole,
      department: department || "Computer Science",
      institutionName: institutionName || "National Institute of Technology",
      companyName: companyName || "",
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    };

    const token = signJwtToken(newUser);

    res.setHeader(
      "Set-Cookie",
      `sih_token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    );

    return res.status(201).json({
      success: true,
      message: "Account registered successfully",
      data: {
        user: newUser,
        token,
      },
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
