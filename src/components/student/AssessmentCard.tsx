"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AssessmentItem } from "@/types";
import { Timer, HelpCircle, CheckCircle, Award, Play } from "lucide-react";

interface AssessmentCardProps {
  assessment: AssessmentItem;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreResult, setScoreResult] = useState<number | null>(assessment.score || null);

  const handleStartTest = () => {
    setIsOpen(true);
  };

  const handleFinishTest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setScoreResult(88);
    }, 1200);
  };

  return (
    <>
      <Card hoverEffect className="flex flex-col justify-between h-full group">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-primary-400 uppercase tracking-wider">
              {assessment.skillName}
            </span>
            <Badge
              variant={
                assessment.difficultyLevel === "Advanced"
                  ? "purple"
                  : assessment.difficultyLevel === "Intermediate"
                  ? "cyan"
                  : "success"
              }
              size="sm"
            >
              {assessment.difficultyLevel}
            </Badge>
          </div>

          <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors leading-snug">
            {assessment.title}
          </h4>

          <div className="flex items-center gap-4 text-xs text-slate-400 mt-3.5">
            <span className="flex items-center gap-1">
              <Timer size={13} className="text-slate-500" />
              {assessment.durationMins} Mins
            </span>
            <span className="flex items-center gap-1">
              <HelpCircle size={13} className="text-slate-500" />
              {assessment.totalQuestions} Questions
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          {scoreResult ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                <CheckCircle size={14} /> Passed ({scoreResult}%)
              </span>
              <Badge variant="success" size="sm">
                Verified
              </Badge>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Pass criterion: {assessment.passingScore}%</span>
          )}

          <Button
            variant={scoreResult ? "outline" : "primary"}
            size="sm"
            onClick={handleStartTest}
            icon={scoreResult ? <Award size={13} /> : <Play size={13} />}
          >
            {scoreResult ? "Retake" : "Take Assessment"}
          </Button>
        </div>
      </Card>

      {/* Interactive Live Assessment Modal Simulator */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={assessment.title}
        description={`Standard Proctored Evaluation • ${assessment.durationMins} mins • ${assessment.totalQuestions} questions`}
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
            <strong>Outcome-Based Evaluation Rule:</strong> Scoring $\ge 70\%$ automatically unlocks an
            official credential badge and broadcasts your verified profile to top recruiters.
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-300">
              Sample Question 1: How does Next.js 14 App Router optimize Server Components data fetching?
            </p>
            <div className="space-y-2 text-xs">
              {[
                "By executing async fetch directly on the server without sending fetch logic to the browser bundle",
                "By using client-side Redux store caching exclusively",
                "By executing queries on Web Workers in the browser",
                "By relying on legacy getServerSideProps wrappers",
              ].map((opt, i) => (
                <label
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl border border-white/10 hover:border-primary-400/50 bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-all"
                >
                  <input type="radio" name="sample_q" defaultChecked={i === 0} className="mt-0.5" />
                  <span className="text-slate-300">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400">Anti-cheat Proctored Environment Active</span>
            <Button
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              onClick={handleFinishTest}
            >
              Submit & Verify Skill
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
