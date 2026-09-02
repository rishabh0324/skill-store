import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  GraduationCap,
  Briefcase,
  Award,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  Building,
  User,
  Phone,
  BookOpen,
  MapPin,
  Globe,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_POPULAR_SKILLS = [
  { name: "TypeScript", category: "Languages", defaultScore: 75 },
  { name: "Python", category: "Languages", defaultScore: 80 },
  { name: "React.js", category: "Frameworks", defaultScore: 80 },
  { name: "Node.js", category: "Frameworks", defaultScore: 75 },
  { name: "PostgreSQL", category: "Databases", defaultScore: 70 },
  { name: "Docker", category: "Cloud & DevOps", defaultScore: 65 },
  { name: "Machine Learning", category: "AI / ML", defaultScore: 70 },
  { name: "Distributed Systems", category: "Core Engineering", defaultScore: 75 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding, getDashboardRouteForRole } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Student State
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState("");
  const [collegeName, setCollegeName] = useState("National Institute of Technology (NIT)");
  const [university, setUniversity] = useState("Central Technical University");
  const [degree, setDegree] = useState("B.Tech");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [currentYear, setCurrentYear] = useState(3);
  const [currentSemester, setCurrentSemester] = useState(6);
  const [graduationYear, setGraduationYear] = useState(2026);
  const [cgpa, setCgpa] = useState("8.6");
  const [rollNo, setRollNo] = useState("");
  const [skills, setSkills] = useState<{ name: string; category: string; selfScore: number }[]>([
    { name: "Python", category: "Languages", selfScore: 80 },
    { name: "React.js", category: "Frameworks", selfScore: 85 },
    { name: "PostgreSQL", category: "Databases", selfScore: 75 },
  ]);
  const [customSkillName, setCustomSkillName] = useState("");
  const [customSkillCategory, setCustomSkillCategory] = useState("Languages");
  const [customSkillScore, setCustomSkillScore] = useState(75);
  const [softSkills, setSoftSkills] = useState("Problem Solving, Team Collaboration, Adaptability");
  const [certifications, setCertifications] = useState("AWS Certified Cloud Practitioner, Meta Front-End Specialization");
  const [targetJobRole, setTargetJobRole] = useState("Full-Stack AI Solutions Architect");
  const [preferredLocation, setPreferredLocation] = useState("Bengaluru / Hyderabad / Remote");
  const [preferredIndustry, setPreferredIndustry] = useState("Artificial Intelligence & Enterprise Cloud");

  // Industry State
  const [designation, setDesignation] = useState("Senior Talent Acquisition Lead");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("https://");
  const [domain, setDomain] = useState("Cloud Infrastructure & Enterprise AI");
  const [companyDescription, setCompanyDescription] = useState("Building high-throughput cloud architectures and AI solutions.");
  const [companySize, setCompanySize] = useState("500-1000 employees");
  const [location, setLocation] = useState("Bengaluru / Hybrid");
  const [hiringAreas, setHiringAreas] = useState("Full-Stack, Cloud DevOps, AI/ML");
  const [skillsRequired, setSkillsRequired] = useState("React, Python, TypeScript, PostgreSQL, Docker");

  // Faculty State
  const [facultyInstitution, setFacultyInstitution] = useState("National Institute of Technology (NIT)");
  const [facultyDepartment, setFacultyDepartment] = useState("Computer Science & Engineering");
  const [facultyDesignation, setFacultyDesignation] = useState("Associate Professor");
  const [qualifications, setQualifications] = useState("Ph.D. in Computer Science & Distributed Systems");
  const [specialization, setSpecialization] = useState("Distributed Systems, Cloud Computing & AI Architectures");
  const [researchInterests, setResearchInterests] = useState("Vector Databases, Distributed Machine Learning, OBE Analytics");
  const [mentorshipAreas, setMentorshipAreas] = useState("Full-Stack Web, AI Research, Capstone Project Mentorship");

  // Institution State
  const [tpoName, setTpoName] = useState(user?.name || "Dr. S. Meenakshi");
  const [tpoDesignation, setTpoDesignation] = useState("Head of Training & Placement (TPO)");
  const [instName, setInstName] = useState("National Institute of Technology");
  const [instType, setInstType] = useState("Tier-1 Autonomous Institute (IIT/NIT/IIIT)");
  const [universityAffiliation, setUniversityAffiliation] = useState("Central University Board");
  const [officialEmail, setOfficialEmail] = useState(user?.email || "tpo@nit.ac.in");
  const [instWebsite, setInstWebsite] = useState("https://nit.ac.in");
  const [city, setCity] = useState("Tiruchirappalli");
  const [state, setState] = useState("Tamil Nadu");
  const [address, setAddress] = useState("Tanjore Main Road, NH 67");
  const [departmentsList, setDepartmentsList] = useState("Computer Science, Information Tech, AI & Data Science, ECE, EEE");
  const [studentPopulation, setStudentPopulation] = useState(4500);
  const [code, setCode] = useState("NIT-01");
  const [nirfRank, setNirfRank] = useState(9);

  const role = user?.role || "STUDENT";
  const totalSteps = 4;

  const handleAddPresetSkill = (preset: typeof PRESET_POPULAR_SKILLS[0]) => {
    if (!skills.some((s) => s.name.toLowerCase() === preset.name.toLowerCase())) {
      setSkills([...skills, { name: preset.name, category: preset.category, selfScore: preset.defaultScore }]);
    }
  };

  const handleAddCustomSkill = () => {
    if (customSkillName.trim() && !skills.some((s) => s.name.toLowerCase() === customSkillName.trim().toLowerCase())) {
      setSkills([
        ...skills,
        {
          name: customSkillName.trim(),
          category: customSkillCategory,
          selfScore: customSkillScore,
        },
      ]);
      setCustomSkillName("");
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s.name !== skillName));
  };

  const handleUpdateSkillScore = (index: number, newScore: number) => {
    const updated = [...skills];
    updated[index].selfScore = newScore;
    setSkills(updated);
  };

  const handleSubmitOnboarding = async () => {
    setIsLoading(true);
    setErrorMessage("");

    let payload: any = {};

    if (role === "STUDENT") {
      payload = {
        phone,
        bio,
        collegeName,
        university,
        degree,
        department,
        currentYear,
        currentSemester,
        graduationYear,
        cgpa: parseFloat(cgpa) || 8.0,
        rollNo,
        skills,
        softSkills,
        certifications,
        targetJobRole,
        preferredLocation,
        preferredIndustry,
      };
    } else if (role === "INDUSTRY") {
      payload = {
        phone,
        designation,
        companyName: companyName.trim() || "Tech Innovations Corp",
        companyWebsite: companyWebsite.trim(),
        domain,
        companyDescription,
        companySize,
        location,
        hiringAreas,
        skillsRequired,
      };
    } else if (role === "FACULTY") {
      payload = {
        phone,
        institutionName: facultyInstitution,
        department: facultyDepartment,
        designation: facultyDesignation,
        qualifications,
        specialization,
        researchInterests,
        mentorshipAreas,
      };
    } else if (role === "INSTITUTION") {
      payload = {
        phone,
        tpoName,
        tpoDesignation,
        institutionName: instName,
        institutionType: instType,
        universityAffiliation,
        officialEmail,
        website: instWebsite,
        city,
        state,
        address,
        departmentsList,
        studentPopulation: Number(studentPopulation),
        code,
        nirfRank: Number(nirfRank),
      };
    }

    const result = await completeOnboarding(payload);

    if (result.success && result.role) {
      router.push(getDashboardRouteForRole(result.role));
    } else {
      setErrorMessage(result.message);
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard requireOnboarded={false}>
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        {/* Header Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-xs font-semibold text-primary-300">
            <Sparkles size={13} className="text-accent-cyan" />
            <span>Personalized {role} Setup</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Complete Your Profile</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Provide your actual details to generate your tailored AI roadmap, verified assessments, and matching pipeline.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between gap-2 px-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-full h-1.5 rounded-full transition-all duration-300",
                  currentStep >= step ? "bg-gradient-to-r from-primary-500 to-accent-cyan shadow-glow" : "bg-white/10"
                )}
              />
              <span className={cn("text-[10px] font-semibold", currentStep >= step ? "text-primary-300" : "text-slate-500")}>
                Step {step}
              </span>
            </div>
          ))}
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Card className="p-6 sm:p-8 space-y-6">
          {/* ================================================================= */}
          {/* STUDENT ONBOARDING STEPS */}
          {/* ================================================================= */}
          {role === "STUDENT" && (
            <>
              {/* Step 1: Personal & Bio */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Personal Information</h3>
                      <p className="text-xs text-slate-400">Your profile details for recruiter evaluations and portfolios</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">Full Name</label>
                      <input
                        type="text"
                        disabled
                        value={user?.name || ""}
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">College Roll / Student ID</label>
                      <input
                        type="text"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        placeholder="e.g. 2022-CSE-042"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">Professional Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Passionate computer science undergraduate focusing on distributed systems and AI architectures..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Academic Background */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Academic Background</h3>
                      <p className="text-xs text-slate-400">Institutional credentials for OBE competency tracking</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">College / Institution Name</label>
                      <input
                        type="text"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="e.g. National Institute of Technology"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">University / Affiliation</label>
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="e.g. Central Technical University"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">Degree / Program</label>
                      <input
                        type="text"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="e.g. B.Tech / B.E. / M.Tech"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">Department / Branch</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Computer Science & Engineering"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">Current Year</label>
                      <select
                        value={currentYear}
                        onChange={(e) => setCurrentYear(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                      >
                        <option value={1}>1st Year</option>
                        <option value={2}>2nd Year</option>
                        <option value={3}>3rd Year</option>
                        <option value={4}>4th Year</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">Semester</label>
                      <select
                        value={currentSemester}
                        onChange={(e) => setCurrentSemester(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <option key={sem} value={sem}>Sem {sem}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">CGPA / %</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                        placeholder="e.g. 8.5"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Technical Skills & Proficiencies */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Sliders size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Technical & Soft Skills</h3>
                      <p className="text-xs text-slate-400">Add your skills with self-assessed proficiencies</p>
                    </div>
                  </div>

                  {/* 1-Click Popular Preset Skills */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">1-Click Add Core Skills:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_POPULAR_SKILLS.map((preset) => {
                        const isAdded = skills.some((s) => s.name.toLowerCase() === preset.name.toLowerCase());
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleAddPresetSkill(preset)}
                            disabled={isAdded}
                            className={cn(
                              "px-2.5 py-1 rounded-xl text-xs font-medium border transition-all flex items-center gap-1",
                              isAdded
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default"
                                : "bg-white/5 border-white/10 text-slate-300 hover:border-primary-500/50 hover:bg-primary-500/10"
                            )}
                          >
                            {isAdded ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                            <span>{preset.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Skill Input */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-slate-200">Add Custom Skill:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <input
                        type="text"
                        value={customSkillName}
                        onChange={(e) => setCustomSkillName(e.target.value)}
                        placeholder="Skill Name (e.g. Next.js, Redis, PyTorch)"
                        className="sm:col-span-6 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                      />
                      <select
                        value={customSkillCategory}
                        onChange={(e) => setCustomSkillCategory(e.target.value)}
                        className="sm:col-span-4 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                      >
                        <option value="Languages">Languages</option>
                        <option value="Frameworks">Frameworks</option>
                        <option value="Databases">Databases</option>
                        <option value="Cloud & DevOps">Cloud & DevOps</option>
                        <option value="AI / ML">AI / ML</option>
                        <option value="Core Engineering">Core Engineering</option>
                      </select>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleAddCustomSkill}
                        className="sm:col-span-2"
                        icon={<Plus size={13} />}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Added Skills List with Range Sliders */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Your Added Skills ({skills.length}):
                    </label>
                    {skills.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No skills added yet. Click skills above to add.</p>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {skills.map((s, idx) => (
                          <div
                            key={s.name}
                            className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between gap-4"
                          >
                            <div className="w-40 shrink-0">
                              <p className="text-xs font-bold text-white leading-tight">{s.name}</p>
                              <span className="text-[10px] text-slate-400">{s.category}</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3">
                              <input
                                type="range"
                                min="20"
                                max="100"
                                value={s.selfScore}
                                onChange={(e) => handleUpdateSkillScore(idx, Number(e.target.value))}
                                className="w-full accent-indigo-500 cursor-pointer"
                              />
                              <span className="text-xs font-mono font-bold text-indigo-300 w-10 text-right">
                                {s.selfScore}%
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(s.name)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Career Goals & Placements */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Career Goals & Placement Preferences</h3>
                      <p className="text-xs text-slate-400">Drives your AI skill-gap vector matching and roadmap generator</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">Target Career Role</label>
                    <select
                      value={targetJobRole}
                      onChange={(e) => setTargetJobRole(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                    >
                      <option value="Full-Stack AI Solutions Architect">Full-Stack AI Solutions Architect</option>
                      <option value="Cloud DevOps & SRE Engineer">Cloud DevOps & SRE Engineer</option>
                      <option value="Machine Learning Systems Specialist">Machine Learning Systems Specialist</option>
                      <option value="Distributed Backend & Vector DB Engineer">Distributed Backend & Vector DB Engineer</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">Preferred Work Locations</label>
                      <input
                        type="text"
                        value={preferredLocation}
                        onChange={(e) => setPreferredLocation(e.target.value)}
                        placeholder="e.g. Bengaluru / Pune / Remote"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">Preferred Industry Domain</label>
                      <input
                        type="text"
                        value={preferredIndustry}
                        onChange={(e) => setPreferredIndustry(e.target.value)}
                        placeholder="e.g. Enterprise AI, Cloud SaaS, Fintech"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">Soft Skills & Leadership</label>
                    <input
                      type="text"
                      value={softSkills}
                      onChange={(e) => setSoftSkills(e.target.value)}
                      placeholder="e.g. Problem Solving, Team Collaboration, Adaptability"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================================================================= */}
          {/* INDUSTRY RECRUITER ONBOARDING */}
          {/* ================================================================= */}
          {role === "INDUSTRY" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Recruiter & Company Profile</h3>
                  <p className="text-xs text-slate-400">Configure corporate identity for posting jobs and searching verified talent</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. TechCorp Solutions"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Official Website</label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Your Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Talent Acquisition Lead"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Work Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Company Size</label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="1-50 employees">1-50 employees (Early-Stage)</option>
                    <option value="50-200 employees">50-200 employees (Mid-Size)</option>
                    <option value="500-1000 employees">500-1000 employees (Enterprise)</option>
                    <option value="1000+ employees">1000+ employees (Global MNC)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Primary Hiring Focus</label>
                  <input
                    type="text"
                    value={hiringAreas}
                    onChange={(e) => setHiringAreas(e.target.value)}
                    placeholder="e.g. Full-Stack, Cloud DevOps, AI/ML"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Commonly Required Skills (Tech Stack)</label>
                <input
                  type="text"
                  value={skillsRequired}
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  placeholder="e.g. React.js, Python, PostgreSQL, Docker, AWS"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Company Overview</label>
                <textarea
                  rows={3}
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  placeholder="Tell candidates about your engineering culture and vision..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* FACULTY MENTOR ONBOARDING */}
          {/* ================================================================= */}
          {role === "FACULTY" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Faculty Mentor Profile</h3>
                  <p className="text-xs text-slate-400">Configure academic credentials for 1:1 guidance and OBE skill endorsements</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Institution / University</label>
                  <input
                    type="text"
                    value={facultyInstitution}
                    onChange={(e) => setFacultyInstitution(e.target.value)}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Department</label>
                  <input
                    type="text"
                    value={facultyDepartment}
                    onChange={(e) => setFacultyDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Academic Designation</label>
                  <input
                    type="text"
                    value={facultyDesignation}
                    onChange={(e) => setFacultyDesignation(e.target.value)}
                    placeholder="e.g. Associate Professor / Professor"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Qualifications</label>
                  <input
                    type="text"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="e.g. Ph.D. in Computer Science"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Specialization & Research Focus</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Distributed Systems, Vector Databases & Cloud Architectures"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Areas Where You Mentor Students</label>
                <input
                  type="text"
                  value={mentorshipAreas}
                  onChange={(e) => setMentorshipAreas(e.target.value)}
                  placeholder="e.g. Capstone Guidance, Cloud Architecture Reviews, Research Publication"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* INSTITUTION / TPO ONBOARDING */}
          {/* ================================================================= */}
          {role === "INSTITUTION" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Institution & TPO Center Setup</h3>
                  <p className="text-xs text-slate-400">Configure institutional telemetry, student batch tracking, and NAAC compliance</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Institution Name</label>
                  <input
                    type="text"
                    value={instName}
                    onChange={(e) => setInstName(e.target.value)}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Institution Type</label>
                  <select
                    value={instType}
                    onChange={(e) => setInstType(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Tier-1 Institute (IIT/NIT/IIIT)">Tier-1 Institute (IIT/NIT/IIIT)</option>
                    <option value="Tier-2 Autonomous Engineering College">Tier-2 Autonomous Engineering College</option>
                    <option value="State Technical University">State Technical University</option>
                    <option value="Private Deemed University">Private Deemed University</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">TPO In-Charge Name</label>
                  <input
                    type="text"
                    value={tpoName}
                    onChange={(e) => setTpoName(e.target.value)}
                    placeholder="e.g. Prof. S. Meenakshi"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">TPO Designation</label>
                  <input
                    type="text"
                    value={tpoDesignation}
                    onChange={(e) => setTpoDesignation(e.target.value)}
                    placeholder="e.g. Head of Training & Placement"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">NIRF Rank</label>
                  <input
                    type="number"
                    value={nirfRank}
                    onChange={(e) => setNirfRank(Number(e.target.value))}
                    placeholder="e.g. 9"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Tiruchirappalli"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Registered Departments</label>
                <input
                  type="text"
                  value={departmentsList}
                  onChange={(e) => setDepartmentsList(e.target.value)}
                  placeholder="e.g. Computer Science, Information Tech, AI & Data Science, ECE"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            {role === "STUDENT" && currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                icon={<ArrowLeft size={15} />}
              >
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {role === "STUDENT" && currentStep < totalSteps ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, totalSteps))}
                icon={<ArrowRight size={15} />}
              >
                Next: {currentStep === 1 ? "Academics" : currentStep === 2 ? "Skills" : "Career Goals"} →
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                onClick={handleSubmitOnboarding}
                icon={<CheckCircle2 size={16} />}
              >
                Complete Onboarding & Enter Dashboard →
              </Button>
            )}
          </div>
        </Card>
      </div>
    </AuthGuard>
  );
}
