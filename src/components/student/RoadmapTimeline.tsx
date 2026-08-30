import React, { useState } from "react";
import { LearningRoadmapData, RoadmapStep } from "@/types";
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
  Layers,
  Clock,
  Filter,
  CheckCheck,
  TrendingUp,
} from "lucide-react";

interface RoadmapTimelineProps {
  roadmap: LearningRoadmapData;
  onStepToggle?: (stepId: string, isCompleted: boolean) => Promise<void> | void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  roadmap,
  onStepToggle,
}) => {
  const steps: RoadmapStep[] = roadmap.steps || roadmap.milestones || [];
  const [filter, setFilter] = useState<"ALL" | "REMAINING" | "COMPLETED">("ALL");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const totalCount = steps.length;
  const progressPercent =
    totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : roadmap.progressPercent || 0;

  const handleToggle = async (stepId: string, currentStatus: boolean) => {
    try {
      setTogglingId(stepId);
      if (onStepToggle) {
        await onStepToggle(stepId, !currentStatus);
      }
    } catch (e) {
      console.error("Error toggling roadmap milestone:", e);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredSteps = steps.filter((step) => {
    if (filter === "COMPLETED") return step.isCompleted;
    if (filter === "REMAINING") return !step.isCompleted;
    return true;
  });

  const getResourceIcon = (type: string) => {
    switch ((type || "").toUpperCase()) {
      case "VIDEO":
        return <Video size={13} className="text-cyan-400" />;
      case "PROJECT":
        return <Code size={13} className="text-emerald-400" />;
      case "DOCUMENTATION":
      case "DOCS":
      case "ARTICLE":
        return <BookOpen size={13} className="text-indigo-400" />;
      case "CERTIFICATION":
      case "CERT":
        return <Award size={13} className="text-amber-400" />;
      case "LAB":
      case "COURSE":
        return <Layers size={13} className="text-purple-400" />;
      default:
        return <BookOpen size={13} className="text-indigo-400" />;
    }
  };

  return (
    <Card className="p-6 space-y-6" id="learning-roadmap">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="text-accent-cyan" size={20} />
              AI-Curated Learning Roadmap
            </h3>
            <Badge variant="primary" size="sm">
              Target: {roadmap.targetRole || roadmap.roleTitle || "Full-Stack AI Solutions Architect"}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {roadmap.gapSummary || roadmap.summary || "Personalized gap recovery milestones."}
          </p>
        </div>

        <div className="text-right sm:min-w-[160px] space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Milestones Completed</span>
            <span className="text-primary-400 font-bold">
              {completedCount}/{totalCount} ({progressPercent}%)
            </span>
          </div>
          <Progress value={progressPercent} variant="gradient" />
          <p className="text-[10px] text-slate-400 text-left sm:text-right">
            ~{roadmap.estimatedHours || 36} hrs total • ~{roadmap.estimatedWeeks || 4} weeks
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filter === "ALL"
                ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Milestones ({totalCount})
          </button>
          <button
            onClick={() => setFilter("REMAINING")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filter === "REMAINING"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            In Progress ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setFilter("COMPLETED")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filter === "COMPLETED"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {progressPercent === 100 && (
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <CheckCheck size={14} /> 100% Roadmap Completed! Ready for Tier-1 Drives
          </span>
        )}
      </div>

      {/* Steps Timeline */}
      <div className="relative pl-6 border-l-2 border-primary-500/20 space-y-5">
        {filteredSteps.map((step, idx) => {
          const isDone = !!step.isCompleted;
          const isToggling = togglingId === step.id;
          const stepNum = step.stepNumber || idx + 1;

          return (
            <div key={step.id || idx} className="relative group">
              {/* Step Node Dot */}
              <button
                onClick={() => handleToggle(step.id, isDone)}
                disabled={isToggling}
                className={`absolute -left-[35px] top-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? "bg-emerald-500 text-white shadow-glow"
                    : "bg-slate-900 border border-slate-700 text-slate-500 group-hover:border-primary-400"
                }`}
                title={isDone ? "Mark as in progress" : "Mark as completed"}
              >
                {isDone ? <CheckCircle2 size={14} /> : <Circle size={12} />}
              </button>

              <div
                className={`p-4 rounded-2xl glass-card border transition-all ${
                  isDone
                    ? "border-emerald-500/20 bg-emerald-950/10"
                    : "border-white/5 hover:border-primary-500/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">Step {stepNum}</span>
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-300 font-medium">
                      {getResourceIcon(step.resourceType)}
                      <span className="capitalize">{step.resourceType.toLowerCase()}</span>
                    </span>
                    {step.provider && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-white/5 font-mono">
                        {step.provider}
                      </span>
                    )}
                    {step.skillName && (
                      <Badge variant="cyan" size="sm">
                        {step.skillName}
                      </Badge>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock size={12} /> ~{step.estimatedHours || 6} hrs
                  </span>
                </div>

                <h4
                  className={`text-sm font-bold mt-2 ${
                    isDone ? "line-through text-slate-400" : "text-white"
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.description}</p>

                <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/5">
                  <a
                    href={step.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-accent-cyan hover:underline flex items-center gap-1"
                  >
                    Open Curated Learning Resource <ExternalLink size={12} />
                  </a>

                  <Button
                    variant={isDone ? "ghost" : "outline"}
                    size="sm"
                    disabled={isToggling}
                    onClick={() => handleToggle(step.id, isDone)}
                    icon={isDone ? <CheckCircle2 size={13} className="text-emerald-400" /> : undefined}
                  >
                    {isDone ? "Completed" : "Mark Complete"}
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
