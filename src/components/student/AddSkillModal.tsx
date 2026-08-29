"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Plus, Sparkles, AlertCircle } from "lucide-react";

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillAdded?: () => void;
}

const PRESET_SUGGESTIONS = [
  "Rust",
  "Kubernetes & Cloud Infra",
  "Redis & Distributed Caching",
  "Machine Learning & PyTorch",
  "GraphQL APIs",
  "Go (Golang)",
  "Cybersecurity & IAM",
];

export const AddSkillModal: React.FC<AddSkillModalProps> = ({
  isOpen,
  onClose,
  onSkillAdded,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frameworks");
  const [selfScore, setSelfScore] = useState<number>(75);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Skill name cannot be empty.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          selfScore,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setName("");
        setSelfScore(75);
        if (onSkillAdded) onSkillAdded();
        onClose();
      } else {
        setErrorMsg(data.message || "Failed to add skill.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error reporting skill.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Self-Report Technical Competency" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Skill or Technology Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Rust, PyTorch, Kubernetes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Quick Suggestions:</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {PRESET_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setName(s)}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary-400/50 text-slate-300 hover:text-white transition-all"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Domain Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs"
            >
              <option value="Languages" className="bg-slate-900">Programming Languages</option>
              <option value="Frameworks" className="bg-slate-900">Frameworks & Web</option>
              <option value="Databases" className="bg-slate-900">Databases & Storage</option>
              <option value="Cloud & DevOps" className="bg-slate-900">Cloud & DevOps</option>
              <option value="AI / ML" className="bg-slate-900">AI / Machine Learning</option>
              <option value="Core Engineering" className="bg-slate-900">Core CS / Algorithms</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Self-Assessed Score</label>
              <span className="text-xs font-bold text-primary-400">{selfScore}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={selfScore}
              onChange={(e) => setSelfScore(Number(e.target.value))}
              className="w-full accent-indigo-500 mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={submitting} icon={<Plus size={14} />}>
            Add to Competency Radar
          </Button>
        </div>
      </form>
    </Modal>
  );
};
