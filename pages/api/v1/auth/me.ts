import type { NextApiRequest, NextApiResponse } from "next";
import { verifyJwtToken, getUserWithProfile } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const token =
      req.cookies.sih_token ||
      req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No active session found. Please log in.",
      });
    }

    const decoded = verifyJwtToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Session expired or invalid. Please log in again.",
      });
    }

    // Retrieve fresh user & profile data from DB
    const freshUser = await getUserWithProfile(decoded.id);
    if (!freshUser) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Session verified.",
      data: {
        user: freshUser,
      },
    });
  } catch (error: any) {
    console.error("Auth session inspection error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error verifying session.",
    });
  }
}
