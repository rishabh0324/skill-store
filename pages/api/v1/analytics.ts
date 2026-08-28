import type { NextApiRequest, NextApiResponse } from "next";
import { MOCK_ANALYTICS } from "@/lib/mockData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "Success",
      data: { analytics: MOCK_ANALYTICS },
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
