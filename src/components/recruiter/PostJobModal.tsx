"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Sparkles, Plus, Trash2 } from "lucide-react";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: (job: any) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onJobCreated,
}) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("INTERNSHIP");
  const [location, setLocation] = useState("Bengaluru / Hybrid");
  const [stipendSalary, setStipendSalary] = useState("₹60,000/mo");
  const [minCgpa, setMinCgpa] = useState("7.5");
  const [skills, setSkills] = useState<{ name: string; weight: number }[]>([
    { name: "React.js", weight: 5 },
    { name: "Node.js", weight: 4 },
  ]);
  const [newSkillName, setNewSkillName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([...skills, { name: newSkillName.trim(), weight: 4 }]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      if (onJobCreated) {
        onJobCreated({
          id: `job-${Date.now()}`,
          title,
          type,
          location,
          stipendSalary,
          minCgpa: Number(minCgpa),
          skills,
        });
      }
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Industry Opening"
      description="Define competency weights to automatically rank applicants using AI vector matching."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Job / Internship Role Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Graduate Software Engineer - Cloud Systems"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full glass-input px-3 py-2 rounded-xl text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Opportunity Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs"
            >
              <option value="INTERNSHIP" className="bg-slate-900">Internship</option>
              <option value="FULL_TIME" className="bg-slate-900">Full-Time Placement</option>
              <option value="APPRENTICESHIP" className="bg-slate-900">Apprenticeship</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Compensation / Stipend</label>
            <input
              type="text"
              value={stipendSalary}
              onChange={(e) => setStipendSalary(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Minimum CGPA</label>
            <input
              type="number"
              step="0.1"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Skill Weighting Section */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Required Competencies & ATS Weight (1-5)
          </label>
          <div className="space-y-2 mb-2">
            {skills.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/5 border border-white/5 text-xs">
                <span className="font-semibold text-white">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">Weight: {s.weight}/5</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add skill requirement (e.g. Docker, PyTorch)..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="flex-1 glass-input px-3 py-1.5 rounded-xl text-xs"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddSkill} icon={<Plus size={13} />}>
              Add
            </Button>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} icon={<Sparkles size={13} />}>
            Publish Opening
          </Button>
        </div>
      </form>
    </Modal>
  );
};
