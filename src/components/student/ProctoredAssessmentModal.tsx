"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  Timer,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  options: string[];
}

interface AssessmentData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  badgeReward: string;
  skillName: string;
  questions: Question[];
}

interface ProctoredAssessmentModalProps {
  assessmentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAssessmentCompleted?: () => void;
}

export const ProctoredAssessmentModal: React.FC<ProctoredAssessmentModalProps> = ({
  assessmentId,
  isOpen,
  onClose,
  onAssessmentCompleted,
}) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [testResult, setTestResult] = useState<any | null>(null);

  // Fetch assessment questions
  useEffect(() => {
    if (isOpen && assessmentId) {
      setLoading(true);
      setTestResult(null);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setTabSwitchWarnings(0);

      fetch(`/api/v1/assessments/${assessmentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setAssessment(data.data);
            setTimeLeftSeconds(data.data.durationMinutes * 60);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, assessmentId]);

  // Anti-Cheat Tab Switch Detection
  useEffect(() => {
    if (!isOpen || testResult || loading) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarnings((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isOpen, testResult, loading]);

  // Countdown Timer
  useEffect(() => {
    if (!isOpen || testResult || loading || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, testResult, loading, timeLeftSeconds]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitTest = async () => {
    if (!assessmentId) return;
    setSubmitting(true);

    try {
      const timeSpent = assessment ? assessment.durationMinutes * 60 - timeLeftSeconds : 60;
      const res = await fetch(`/api/v1/assessments/${assessmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: selectedAnswers,
          timeSpentSeconds: timeSpent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestResult(data.data);
        if (onAssessmentCompleted) onAssessmentCompleted();
      } else {
        alert(data.message || "Failed to grade assessment.");
      }
    } catch (error) {
      console.error("Failed to submit test:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={assessment?.title || "Proctored Skill Assessment"} maxWidth="xl">
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading secure assessment environment...</p>
        </div>
      ) : testResult ? (
        // Results & Review Screen
        <div className="space-y-6 py-2">
          <div
            className={`p-6 rounded-3xl border text-center space-y-3 ${
              testResult.isPassed
                ? "bg-emerald-950/20 border-emerald-500/30"
                : "bg-rose-950/20 border-rose-500/30"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                testResult.isPassed
                  ? "bg-emerald-500/20 text-emerald-400 shadow-glow"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {testResult.isPassed ? <Award size={32} /> : <XCircle size={32} />}
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">
                {testResult.isPassed ? "Assessment Passed!" : "Assessment Incomplete"}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                You scored <strong className="text-white text-sm">{testResult.score}%</strong> (Passing threshold: {testResult.passingScore}%)
              </p>
            </div>

            {testResult.isPassed && testResult.badgeEarned && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/40 inline-flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Sparkles size={16} className="text-accent-cyan animate-pulse" />
                <span>Awarded: {testResult.badgeEarned}</span>
              </div>
            )}
          </div>

          {/* Question Breakdown Review */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Question Evaluation & Explanations ({testResult.correctCount} / {testResult.totalQuestions} Correct)
            </h4>

            {testResult.review?.map((q: any, idx: number) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  q.isCorrect ? "bg-emerald-950/10 border-emerald-500/20" : "bg-rose-950/10 border-rose-500/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-white">
                    {idx + 1}. {q.questionText}
                  </p>
                  {q.isCorrect ? (
                    <span className="shrink-0 text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Correct
                    </span>
                  ) : (
                    <span className="shrink-0 text-rose-400 font-bold flex items-center gap-1">
                      <XCircle size={14} /> Incorrect
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-[11px] text-slate-300 pt-1">
                  <p>
                    <span className="text-slate-400">Your Answer: </span>
                    <span className={q.isCorrect ? "text-emerald-300 font-medium" : "text-rose-300 font-medium"}>
                      {q.selectedOptionIndex >= 0 ? q.options[q.selectedOptionIndex] : "No answer selected"}
                    </span>
                  </p>
                  {!q.isCorrect && (
                    <p>
                      <span className="text-slate-400">Correct Answer: </span>
                      <span className="text-emerald-300 font-medium">{q.options[q.correctOptionIndex]}</span>
                    </p>
                  )}
                  {q.explanation && (
                    <p className="text-slate-400 bg-black/30 p-2 rounded-xl mt-1 text-[10px] leading-relaxed">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
            <Button variant="primary" size="md" onClick={onClose}>
              Done & Return to Hub
            </Button>
          </div>
        </div>
      ) : assessment ? (
        // Active Question Taking Screen
        <div className="space-y-6">
          {/* Proctored Status Header */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-500/[0.07] border border-indigo-500/20 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Timer size={15} className="text-accent-cyan" />
                <span className="font-mono text-sm">{formatTimer(timeLeftSeconds)}</span>
              </span>
              <Badge variant="neutral" size="sm">
                Question {currentQuestionIndex + 1} of {assessment.questions.length}
              </Badge>
            </div>

            {tabSwitchWarnings > 0 && (
              <span className="text-amber-400 font-bold text-[11px] flex items-center gap-1">
                <ShieldAlert size={14} /> {tabSwitchWarnings} Tab Switch Warning{tabSwitchWarnings > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Current Question */}
          {assessment.questions[currentQuestionIndex] && (
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {currentQuestionIndex + 1}. {assessment.questions[currentQuestionIndex].questionText}
              </h3>

              <div className="space-y-2.5">
                {assessment.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const qId = assessment.questions[currentQuestionIndex].id;
                  const isSelected = selectedAnswers[qId] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(qId, optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center gap-3 ${
                        isSelected
                          ? "bg-primary-500/20 border-primary-500 text-white font-medium shadow-glow"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20 text-slate-300"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                          isSelected ? "bg-primary-500 text-white border-primary-400" : "border-slate-600 text-slate-400"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stepper Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              icon={<ArrowLeft size={14} />}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentQuestionIndex < assessment.questions.length - 1 ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  icon={<ArrowRight size={14} />}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  isLoading={submitting}
                  onClick={handleSubmitTest}
                  icon={<CheckCircle2 size={15} />}
                >
                  Submit & Verify Skill
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
