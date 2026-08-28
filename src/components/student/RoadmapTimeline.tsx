"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { LearningRoadmapData, RoadmapStep } from "@/types";
import {
  Compass,
  CheckCircle2,
  Circle,
  Video,
  FileText,
  Code2,
  Award,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapTimelineProps {
  initialRoadmap: LearningRoadmapData;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ initialRoadmap }) => {
  const [roadmap, setRoadmap] = useState<LearningRoadmapData>(initialRoadmap);

  const toggleNode = (nodeId: string) => {
    const updatedSteps = roadmap.steps.map((s) =>
      s.id === nodeId ? { ...s, isCompleted: !s.isCompleted } : s
    );
    const completedCount = updatedSteps.filter((s) => s.isCompleted).length;
    const progressPercent = Math.round((completedCount / updatedSteps.length) * 100);

    setRoadmap({
      ...roadmap,
      steps: updatedSteps,
      progressPercent,
    });
  };

  const getResourceIcon = (type: RoadmapStep["resourceType"]) => {
    switch (type) {
      case "VIDEO":
        return <Video size={14} className="text-rose-400" />;
      case "ARTICLE":
        return <FileText size={14} className="text-cyan-400" />;
      case "PROJECT":
        return <Code2 size={14} className="text-amber-400" />;
      case "CERT":
        return <Award size={14} className="text-purple-400" />;
      default:
        return <Sparkles size={14} className="text-indigo-400" />;
    }
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Compass size={16} />
              </span>
              <h3 className="text-base font-bold text-white">AI-Curated Learning Roadmap</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">{roadmap.gapSummary}</p>
          </div>
          <Badge variant="cyan" size="md">
            Target: {roadmap.targetRole}
          </Badge>
        </div>

        {/* Progress bar header */}
        <div className="glass-card p-3 rounded-xl mb-4 border border-white/5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Target Competency Progress</span>
            <span className="font-bold text-accent-cyan">{roadmap.progressPercent}% Completed</span>
          </div>
          <Progress value={roadmap.progressPercent} variant="cyan" />
        </div>

        {/* Timeline steps */}
        <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
          {roadmap.steps.map((step) => (
            <div
              key={step.id}
              onClick={() => toggleNode(step.id)}
              className={cn(
                "relative pl-8 p-3 rounded-xl transition-all cursor-pointer border group",
                step.isCompleted
                  ? "bg-emerald-500/[0.04] border-emerald-500/20 hover:border-emerald-500/40"
                  : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              {/* Step indicator circle */}
              <div
                className={cn(
                  "absolute left-2 top-3.5 w-3.5 h-3.5 rounded-full flex items-center justify-center -translate-x-1/2 transition-colors",
                  step.isCompleted
                    ? "text-emerald-400 bg-slate-950"
                    : "text-slate-500 bg-slate-950 group-hover:text-slate-300"
                )}
              >
                {step.isCompleted ? <CheckCircle2 size={15} /> : <Circle size={14} />}
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                    Step {step.stepNumber}: {step.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="p-1 rounded bg-white/5">{getResourceIcon(step.resourceType)}</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    {step.resourceType}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <span className="text-slate-400">Est. completion time: {roadmap.estimatedHours} hours</span>
        <Button variant="outline" size="sm" icon={<Sparkles size={13} />}>
          Recalculate Gaps
        </Button>
      </div>
    </Card>
  );
};
