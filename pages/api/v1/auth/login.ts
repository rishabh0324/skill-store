import type { NextApiRequest, NextApiResponse } from "next";
import { DEMO_USERS, signJwtToken } from "@/lib/auth";
import { UserRole } from "@/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, role } = req.body;
    const targetRole = (role?.toUpperCase() || "STUDENT") as UserRole;
    const matchedUser = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === email?.toLowerCase()
    ) || DEMO_USERS[targetRole] || DEMO_USERS.STUDENT;

    const token = signJwtToken(matchedUser);

    res.setHeader(
      "Set-Cookie",
      `sih_token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: matchedUser,
        token,
      },
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
