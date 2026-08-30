"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Award, CheckCircle2, ShieldCheck, Star, UserCheck, MessageSquare } from "lucide-react";

interface EndorsementItem {
  id: string;
  studentSkillId: string;
  studentName: string;
  department?: string;
  skillName: string;
  category: string;
  selfScore: number;
  verifiedScore?: number | null;
  verificationStatus: string;
  isEndorsed: boolean;
  lastEndorsement?: {
    facultyName: string;
    score: number;
    feedback: string;
    date: string;
  } | null;
}

interface EndorsementDeskProps {
  endorsements: EndorsementItem[];
  onEndorseSuccess?: () => void;
}

export const EndorsementDesk: React.FC<EndorsementDeskProps> = ({
  endorsements,
  onEndorseSuccess,
}) => {
  const [selectedItem, setSelectedItem] = useState<EndorsementItem | null>(null);
  const [score, setScore] = useState("90");
  const [feedback, setFeedback] = useState("Demonstrated high proficiency in lab evaluations and design reviews.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (item: EndorsementItem) => {
    setSelectedItem(item);
    setScore(String(Math.max(item.selfScore || 85, 85)));
  };

  const handleSubmitEndorsement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/v1/endorsements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentSkillId: selectedItem.studentSkillId || selectedItem.id,
          endorsedScore: Number(score),
          feedback,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSelectedItem(null);
        if (onEndorseSuccess) {
          onEndorseSuccess();
        }
      }
    } catch (err) {
      console.error("Error endorsing student skill:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Student Competency Endorsement Desk</h3>
            <Badge variant="purple" size="sm">
              <ShieldCheck size={11} /> 0.95x OBE Credit Tier
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Validate candidate skills to upgrade them from Self-Reported to Faculty-Endorsed credentials.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {endorsements.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No pending student competencies awaiting faculty endorsement.
          </div>
        ) : (
          endorsements.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl glass-card border border-white/5 hover:border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{item.skillName}</h4>
                  <Badge
                    variant={item.isEndorsed ? "warning" : "neutral"}
                    size="sm"
                  >
                    {item.isEndorsed ? (
                      <span className="flex items-center gap-1">
                        <Award size={10} /> Faculty Endorsed ({item.verifiedScore}%)
                      </span>
                    ) : (
                      "Self-Reported"
                    )}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
                  <span className="text-slate-200 font-semibold">{item.studentName}</span>
                  <span>•</span>
                  <span>{item.department || "Computer Science"}</span>
                  <span>•</span>
                  <span>Self Score: <strong className="text-indigo-300">{item.selfScore}%</strong></span>
                </div>

                {item.lastEndorsement && (
                  <p className="text-[11px] text-amber-300/80 italic mt-1 flex items-center gap-1">
                    <MessageSquare size={11} /> "{item.lastEndorsement.feedback}"
                  </p>
                )}
              </div>

              <div className="self-end sm:self-center shrink-0">
                <Button
                  variant={item.isEndorsed ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => handleOpenModal(item)}
                  icon={<Award size={13} />}
                >
                  {item.isEndorsed ? "Re-Evaluate" : "Endorse Skill"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Endorsement Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Endorse ${selectedItem.studentName}'s Competency`}
          description={`Grant official academic OBE endorsement for "${selectedItem.skillName}".`}
          maxWidth="md"
        >
          <form onSubmit={handleSubmitEndorsement} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Endorsed Proficiency Score (0 - 100%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                required
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Faculty Evaluation Notes & Feedback
              </label>
              <textarea
                rows={3}
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs resize-none"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} icon={<CheckCircle2 size={13} />}>
                Submit Endorsement
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Card>
  );
};
