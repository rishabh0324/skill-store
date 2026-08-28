import React, { useState } from "react";
import { LearningRoadmapData } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Video,
  Code,
  Award,
  Sparkles,
} from "lucide-react";

interface RoadmapTimelineProps {
  roadmap: LearningRoadmapData;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ roadmap }) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>(
    roadmap.steps.filter((s) => s.isCompleted).map((s) => s.id)
  );

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalSteps = roadmap.steps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0;

  const getResourceIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "VIDEO":
      case "COURSE":
        return <Video size={14} className="text-cyan-400" />;
      case "PROJECT":
        return <Code size={14} className="text-emerald-400" />;
      case "DOCUMENTATION":
      case "ARTICLE":
        return <BookOpen size={14} className="text-indigo-400" />;
      case "CERTIFICATION":
      case "CERT":
        return <Award size={14} className="text-amber-400" />;
      default:
        return <BookOpen size={14} className="text-indigo-400" />;
    }
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="text-accent-cyan" size={20} />
              AI-Curated Learning Roadmap
            </h3>
            <Badge variant="primary" size="sm">
              Target: {roadmap.targetRole}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {roadmap.summary || roadmap.gapSummary || "Personalized gap recovery milestones."}
          </p>
        </div>

        <div className="text-right sm:min-w-[140px]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>Milestone Progress</span>
            <span className="text-primary-400 font-bold">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} variant="gradient" />
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="relative pl-6 border-l-2 border-primary-500/20 space-y-6">
        {roadmap.steps.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);
          const stepNum = step.stepNumber || step.week || idx + 1;

          return (
            <div key={step.id} className="relative group">
              {/* Step Node Dot */}
              <button
                onClick={() => toggleStep(step.id)}
                className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? "bg-primary-500 text-white shadow-glow"
                    : "bg-slate-900 border border-slate-700 text-slate-500 group-hover:border-primary-400"
                }`}
              >
                {isDone ? <CheckCircle2 size={14} /> : <Circle size={12} />}
              </button>

              <div
                className={`p-4 rounded-2xl glass-card border transition-all ${
                  isDone
                    ? "border-emerald-500/20 bg-emerald-950/5"
                    : "border-white/5 hover:border-primary-500/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">
                      Step {stepNum}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-300 font-medium">
                      {getResourceIcon(step.resourceType)}
                      <span className="capitalize">{step.resourceType.toLowerCase()}</span>
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    ~{step.estimatedHours || 6} hrs required
                  </span>
                </div>

                <h4
                  className={`text-sm font-bold mt-1.5 ${
                    isDone ? "line-through text-slate-400" : "text-white"
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.description}</p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                  <a
                    href={step.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-accent-cyan hover:underline flex items-center gap-1"
                  >
                    Open Resource <ExternalLink size={12} />
                  </a>

                  <Button
                    variant={isDone ? "ghost" : "outline"}
                    size="sm"
                    onClick={() => toggleStep(step.id)}
                  >
                    {isDone ? "Completed" : "Mark as Complete"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
