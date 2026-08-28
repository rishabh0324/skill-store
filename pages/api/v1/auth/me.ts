import type { NextApiRequest, NextApiResponse } from "next";
import { verifyJwtToken, DEMO_USERS } from "@/lib/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const token = req.cookies.sih_token || req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const decoded = verifyJwtToken(token);
      if (decoded) {
        return res.status(200).json({
          success: true,
          message: "Authenticated session",
          data: { user: decoded },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Default demo session",
      data: { user: DEMO_USERS.STUDENT, isDemo: true },
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
