"use client";

import React, { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Briefcase, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Application Shortlisted",
    message: "Microsoft India shortlisted your profile for Cloud & AI Intern!",
    time: "10 mins ago",
    type: "SUCCESS",
  },
  {
    id: "n2",
    title: "Skill Verification Ready",
    message: "Your score in Advanced Next.js unlocked the Gold Verification Badge.",
    time: "2 hours ago",
    type: "INFO",
  },
  {
    id: "n3",
    title: "Mentorship Confirmed",
    message: "Dr. Ramesh Verma accepted your session request for tomorrow 2:30 PM.",
    time: "1 day ago",
    type: "ALERT",
  },
];

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      case "ALERT":
        return <AlertTriangle size={16} className="text-amber-400" />;
      case "RECRUITMENT":
        return <Briefcase size={16} className="text-cyan-400" />;
      default:
        return <Info size={16} className="text-indigo-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasUnread(false);
        }}
        className="relative p-2 rounded-xl glass-card border border-white/10 text-slate-300 hover:text-white transition-colors"
      >
        <Bell size={18} />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-cyan rounded-full animate-pulse shadow-glow-cyan" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-3 shadow-2xl z-50 border border-white/15 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 px-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Notifications</h4>
              <span className="text-[10px] text-primary-400 font-medium cursor-pointer hover:underline">
                Mark all read
              </span>
            </div>

            <div className="space-y-2">
              {SAMPLE_NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-colors flex gap-3"
                >
                  <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-white">{n.title}</p>
                    <p className="text-[11px] text-slate-400 leading-snug">{n.message}</p>
                    <span className="text-[10px] text-slate-500 block pt-1">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
