"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { JobPostingItem } from "@/types";
import { Briefcase, Users, Eye, MoreVertical } from "lucide-react";

interface JobListingTableProps {
  jobs: JobPostingItem[];
}

export const JobListingTable: React.FC<JobListingTableProps> = ({ jobs }) => {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Active Industry Drives</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your open internship and full-time hiring pipelines.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3">Role & Title</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Compensation</th>
              <th className="pb-3">Applicants</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="py-3 font-semibold text-white group-hover:text-primary-300">
                  {j.title}
                </td>
                <td className="py-3">
                  <Badge variant="cyan" size="sm">
                    {j.type}
                  </Badge>
                </td>
                <td className="py-3 text-emerald-400 font-medium">{j.stipendSalary}</td>
                <td className="py-3 text-slate-300">
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-slate-500" />
                    28 Applied
                  </span>
                </td>
                <td className="py-3">
                  <Badge variant="success" size="sm">
                    {j.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
