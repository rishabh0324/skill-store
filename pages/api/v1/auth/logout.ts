import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Clear HTTP-only session cookie
  res.setHeader(
    "Set-Cookie",
    "sih_token=; Path=/; HttpOnly; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
  );

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}
