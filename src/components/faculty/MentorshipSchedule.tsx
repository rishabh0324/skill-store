"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MentorshipSessionItem } from "@/types";
import { Calendar, Video, CheckCircle2, Clock, MessageSquare, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface MentorshipScheduleProps {
  sessions: MentorshipSessionItem[];
}

export const MentorshipSchedule: React.FC<MentorshipScheduleProps> = ({ sessions }) => {
  const [sessionList, setSessionList] = useState(sessions);

  const handleConfirm = (id: string) => {
    setSessionList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "CONFIRMED" } : s))
    );
  };

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Mentorship & Project Guidance Sessions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            1-on-1 industry alignment meetings and capstone project rubric reviews.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sessionList.map((session) => (
          <div
            key={session.id}
            className="p-4 rounded-xl glass-card border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors">
                  {session.topic}
                </h4>
                <Badge
                  variant={
                    session.status === "CONFIRMED"
                      ? "success"
                      : session.status === "COMPLETED"
                      ? "neutral"
                      : "warning"
                  }
                  size="sm"
                >
                  {session.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="text-slate-300 font-medium">Student: {session.studentName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="text-slate-500" />
                  {formatDate(session.scheduledAt)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-slate-500" />
                  2:30 PM IST
                </span>
              </div>

              {session.notes && (
                <p className="text-xs text-slate-400 italic pt-1 border-t border-white/5 mt-2">
                  Notes: "{session.notes}"
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
                  onClick={() => handleConfirm(session.id)}
                  icon={<CheckCircle2 size={13} />}
                >
                  Accept Slot
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
