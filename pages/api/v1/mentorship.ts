import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";
import { MOCK_MENTORSHIPS } from "@/lib/mockData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token =
    req.cookies.sih_token ||
    req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const session = token ? verifyJwtToken(token) : null;

  if (req.method === "GET") {
    try {
      // Query database mentorship slots & bookings
      const slots = await prisma.mentorshipSlot.findMany({
        include: {
          facultyProfile: {
            include: { user: true },
          },
          bookings: {
            include: {
              studentProfile: {
                include: { user: true },
              },
            },
          },
        },
        orderBy: { scheduledAt: "asc" },
      });

      if (slots.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Mentorship sessions retrieved (mock fallback)",
          data: {
            sessions: MOCK_MENTORSHIPS,
            totalCount: MOCK_MENTORSHIPS.length,
          },
        });
      }

      const formattedSessions = slots.map((slot) => {
        const activeBooking = slot.bookings[0] || null;

        return {
          id: slot.id,
          slotId: slot.id,
          bookingId: activeBooking?.id || null,
          facultyName: slot.facultyProfile.user.name,
          facultyEmail: slot.facultyProfile.user.email,
          facultyDesignation: slot.facultyProfile.designation,
          facultyDepartment: slot.facultyProfile.department,
          studentName: activeBooking?.studentProfile?.user?.name || "Open Slot",
          studentEmail: activeBooking?.studentProfile?.user?.email || null,
          studentId: activeBooking?.studentProfileId || null,
          title: slot.title,
          topic: slot.topic,
          scheduledAt: slot.scheduledAt.toISOString(),
          durationMinutes: slot.durationMinutes,
          meetingLink: slot.meetingUrl,
          meetingUrl: slot.meetingUrl,
          status: activeBooking ? activeBooking.status : slot.status,
          slotStatus: slot.status,
          notes: activeBooking?.notes || "",
        };
      });

      return res.status(200).json({
        success: true,
        message: "Mentorship schedule retrieved successfully",
        data: {
          sessions: formattedSessions,
          slots: formattedSessions,
          totalCount: formattedSessions.length,
        },
      });
    } catch (error: any) {
      console.error("Error fetching mentorship slots:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error fetching mentorship sessions",
      });
    }
  }

  if (req.method === "POST") {
    try {
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Authentication required to manage mentorship sessions",
        });
      }

      const body = req.body;

      // CASE A: Student Booking an existing slot
      if (session.role === "STUDENT" || body.action === "BOOK" || body.slotId) {
        const { slotId, notes } = body;
        if (!slotId) {
          return res.status(400).json({ success: false, message: "Slot ID is required to book a session" });
        }

        const studentProfile = await prisma.studentProfile.findUnique({
          where: { userId: session.id },
        });

        if (!studentProfile) {
          return res.status(404).json({ success: false, message: "Student profile not found" });
        }

        const slot = await prisma.mentorshipSlot.findUnique({
          where: { id: slotId },
        });

        if (!slot) {
          return res.status(404).json({ success: false, message: "Mentorship slot not found" });
        }

        // Create booking and update slot status
        const booking = await prisma.mentorshipBooking.create({
          data: {
            slotId: slot.id,
            studentProfileId: studentProfile.id,
            notes: notes || "1:1 AI Skill Gap and Learning Roadmap consultation.",
            status: "CONFIRMED",
          },
          include: {
            slot: {
              include: { facultyProfile: { include: { user: true } } },
            },
          },
        });

        await prisma.mentorshipSlot.update({
          where: { id: slot.id },
          data: { status: "BOOKED" },
        });

        return res.status(201).json({
          success: true,
          message: "Mentorship guidance slot booked successfully",
          data: {
            bookingId: booking.id,
            slotId: booking.slotId,
            topic: booking.slot.topic,
            facultyName: booking.slot.facultyProfile.user.name,
            scheduledAt: booking.slot.scheduledAt,
            meetingUrl: booking.slot.meetingUrl,
            status: booking.status,
          },
        });
      }

      // CASE B: Faculty Creating a new mentorship availability slot
      if (session.role === "FACULTY" || session.role === "ADMIN") {
        const { title, topic, scheduledAt, durationMinutes, meetingUrl } = body;

        let facultyProfile = await prisma.facultyProfile.findUnique({
          where: { userId: session.id },
        });

        if (!facultyProfile) {
          facultyProfile = await prisma.facultyProfile.create({
            data: {
              userId: session.id,
              institutionName: "National Institute of Technology",
              department: "Computer Science & Engineering",
              designation: "Associate Professor & Mentor",
              specialization: "Distributed Systems & AI Architectures",
            },
          });
        }

        const newSlot = await prisma.mentorshipSlot.create({
          data: {
            facultyProfileId: facultyProfile.id,
            title: title || "1:1 Industry Alignment Guidance",
            topic: topic || "AI Systems Architecture & Skill Gap Review",
            scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(Date.now() + 48 * 60 * 60 * 1000),
            durationMinutes: Number(durationMinutes) || 30,
            meetingUrl: meetingUrl || `https://meet.google.com/nexus-${Math.random().toString(36).substring(7)}`,
            status: "AVAILABLE",
          },
          include: {
            facultyProfile: { include: { user: true } },
          },
        });

        return res.status(201).json({
          success: true,
          message: "New mentorship advisory slot created successfully",
          data: {
            slot: {
              id: newSlot.id,
              title: newSlot.title,
              topic: newSlot.topic,
              facultyName: newSlot.facultyProfile.user.name,
              scheduledAt: newSlot.scheduledAt,
              durationMinutes: newSlot.durationMinutes,
              meetingUrl: newSlot.meetingUrl,
              status: newSlot.status,
            },
          },
        });
      }

      return res.status(403).json({ success: false, message: "Unauthorized persona for slot creation" });
    } catch (error: any) {
      console.error("Error creating/booking mentorship session:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error processing mentorship request",
      });
    }
  }

  if (req.method === "PATCH") {
    try {
      if (!session || (session.role !== "FACULTY" && session.role !== "ADMIN")) {
        return res.status(401).json({
          success: false,
          message: "Only faculty mentors or admins can update session status",
        });
      }

      const { slotId, bookingId, status } = req.body;
      const targetStatus = (status || "CONFIRMED").toUpperCase();

      if (bookingId) {
        const updatedBooking = await prisma.mentorshipBooking.update({
          where: { id: bookingId },
          data: { status: targetStatus },
        });

        return res.status(200).json({
          success: true,
          message: `Booking status updated to ${targetStatus}`,
          data: { booking: updatedBooking },
        });
      }

      if (slotId) {
        const updatedSlot = await prisma.mentorshipSlot.update({
          where: { id: slotId },
          data: { status: targetStatus },
        });

        return res.status(200).json({
          success: true,
          message: `Mentorship slot status updated to ${targetStatus}`,
          data: { slot: updatedSlot },
        });
      }

      return res.status(400).json({ success: false, message: "slotId or bookingId is required" });
    } catch (error: any) {
      console.error("Error updating mentorship status:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error updating mentorship status",
      });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
