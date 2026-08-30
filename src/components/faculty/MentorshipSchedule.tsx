"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MentorshipSessionItem } from "@/types";
import {
  Calendar,
  Video,
  CheckCircle2,
  Clock,
  MessageSquare,
  ExternalLink,
  Plus,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface MentorshipScheduleProps {
  sessions: any[];
  onRefresh?: () => void;
}

export const MentorshipSchedule: React.FC<MentorshipScheduleProps> = ({
  sessions,
  onRefresh,
}) => {
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [topic, setTopic] = useState("AI Systems Architecture & Skill Gap Review");
  const [scheduledAt, setScheduledAt] = useState("2026-09-05T14:30");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateStatus = async (slotId: string, bookingId: string | null, newStatus: string) => {
    try {
      const res = await fetch("/api/v1/mentorship", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId,
          bookingId,
          status: newStatus,
        }),
      });

      const json = await res.json();
      if (json.success && onRefresh) {
        onRefresh();
      }
    } catch (e) {
      console.error("Error updating mentorship session status:", e);
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/v1/mentorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          scheduledAt,
          durationMinutes: Number(durationMinutes),
          meetingUrl: `https://meet.google.com/nexus-${Math.random().toString(36).substring(7)}`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsSlotModalOpen(false);
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (e) {
      console.error("Error creating mentorship slot:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">Mentorship & Project Guidance Sessions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            1-on-1 industry alignment meetings, capstone rubric evaluations, and recovery reviews.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsSlotModalOpen(true)}
          icon={<Plus size={14} />}
        >
          Create Guidance Slot
        </Button>
      </div>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No mentorship slots scheduled. Click "Create Guidance Slot" to publish your availability.
          </div>
        ) : (
          sessions.map((session) => {
            const isCompleted = session.status === "COMPLETED";
            const isConfirmed = session.status === "CONFIRMED";
            const isAvailable = session.status === "AVAILABLE" || session.slotStatus === "AVAILABLE";

            return (
              <div
                key={session.id || session.slotId}
                className="p-4 rounded-xl glass-card border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors">
                      {session.topic || session.title}
                    </h4>
                    <Badge
                      variant={
                        isConfirmed
                          ? "success"
                          : isCompleted
                          ? "neutral"
                          : isAvailable
                          ? "cyan"
                          : "warning"
                      }
                      size="sm"
                    >
                      {session.status || "AVAILABLE"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="text-slate-200 font-semibold">
                      Student: {session.studentName || "Open for Booking"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-500" />
                      {formatDate(session.scheduledAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-500" />
                      {session.durationMinutes || 30} mins
                    </span>
                  </div>

                  {session.notes && (
                    <p className="text-xs text-slate-300 italic pt-1 mt-1">
                      "{session.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {session.meetingLink && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
                    >
                      <Video size={13} />
                      <span>Join Call</span>
                    </a>
                  )}

                  {session.status === "REQUESTED" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(session.slotId, session.bookingId, "CONFIRMED")}
                      icon={<CheckCircle2 size={13} />}
                    >
                      Accept Slot
                    </Button>
                  )}

                  {isConfirmed && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUpdateStatus(session.slotId, session.bookingId, "COMPLETED")}
                      icon={<CheckCircle2 size={13} />}
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Slot Modal */}
      <Modal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        title="Publish Mentorship Advisory Slot"
        description="Make a 1:1 guidance consultation available for students to book."
        maxWidth="md"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Advisory Topic / Focus</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsSlotModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} icon={<Sparkles size={13} />}>
              Publish Slot
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
