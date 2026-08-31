import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Layers,
  Mail,
  Lock,
  User,
  Building,
  GraduationCap,
  Briefcase,
  Award,
  Building2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { register, getDashboardRouteForRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>("STUDENT");

  // Common Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Student Fields
  const [collegeName, setCollegeName] = useState("National Institute of Technology (NIT)");
  const [degree, setDegree] = useState("B.Tech");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [graduationYear, setGraduationYear] = useState<number>(2026);

  // Industry Fields
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("https://");

  // Faculty Fields
  const [facultyInstitution, setFacultyInstitution] = useState("National Institute of Technology (NIT)");
  const [facultyDepartment, setFacultyDepartment] = useState("Computer Science & Engineering");
  const [designation, setDesignation] = useState("Assistant Professor");

  // Institution Fields
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("Tier-1 Institute (IIT/NIT/IIIT)");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic validation
    if (!name.trim()) {
      setErrorMessage("Please enter your full name / contact name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    const payload = {
      name: selectedRole === "INSTITUTION" ? institutionName : name,
      email,
      password,
      role: selectedRole,
      // Student
      collegeName: selectedRole === "STUDENT" ? collegeName : undefined,
      degree: selectedRole === "STUDENT" ? degree : undefined,
      department:
        selectedRole === "STUDENT"
          ? department
          : selectedRole === "FACULTY"
          ? facultyDepartment
          : undefined,
      graduationYear: selectedRole === "STUDENT" ? Number(graduationYear) : undefined,
      // Industry
      companyName: selectedRole === "INDUSTRY" ? companyName : undefined,
      companyWebsite: selectedRole === "INDUSTRY" ? companyWebsite : undefined,
      // Faculty
      institutionName:
        selectedRole === "FACULTY"
          ? facultyInstitution
          : selectedRole === "INSTITUTION"
          ? institutionName
          : undefined,
      designation: selectedRole === "FACULTY" ? designation : undefined,
      // Institution
      institutionType: selectedRole === "INSTITUTION" ? institutionType : undefined,
    };

    const result = await register(payload as any);

    if (result.success && result.role) {
      setSuccessMessage("Account created successfully! Redirecting to your dashboard...");
      setTimeout(() => {
        router.push(getDashboardRouteForRole(result.role!));
      }, 600);
    } else {
      setErrorMessage(result.message);
      setIsLoading(false);
    }
  };

  const rolesList: { role: UserRole; label: string; icon: any; desc: string }[] = [
    { role: "STUDENT", label: "Student", icon: GraduationCap, desc: "Map skills, take tests & get hired" },
    { role: "INDUSTRY", label: "Industry", icon: Briefcase, desc: "Post drives & find verified talent" },
    { role: "FACULTY", label: "Faculty", icon: Award, desc: "Mentor students & advise curriculum" },
    { role: "INSTITUTION", label: "Institution", icon: Building2, desc: "Institutional analytics & TPO" },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan p-0.5 mx-auto shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Layers className="text-accent-cyan w-6 h-6" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Create bridgeNext ai Account</h2>
          <p className="text-xs text-slate-400">Join the SIH 2026 Academia–Industry Collaboration Ecosystem</p>
        </div>

        {/* Role Selection Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Select Your Primary Role:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {rolesList.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleRoleChange(r.role)}
                  className={cn(
                    "p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 group",
                    isSelected
                      ? "bg-primary-500/15 border-primary-500/50 shadow-glow text-white"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={cn(
                        "p-1.5 rounded-lg border",
                        isSelected
                          ? "bg-primary-500 text-white border-primary-400"
                          : "bg-white/5 border-white/10 text-slate-400"
                      )}
                    >
                      <Icon size={16} />
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{r.label}</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Dynamic Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4 pt-1">
          {/* Common Account Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {selectedRole === "INSTITUTION" ? "Head / Administrator Name" : "Full Name"}
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Create Password (min 8 characters)</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Role-Specific Fields */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3.5">
            <h4 className="text-xs font-bold text-primary-300 uppercase tracking-wider">
              {selectedRole} Profile Details
            </h4>

            {selectedRole === "STUDENT" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">College / Institution</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Institute of Technology"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Degree / Program</label>
                    <select
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                    >
                      <option value="B.Tech" className="bg-slate-900">B.Tech / B.E.</option>
                      <option value="M.Tech" className="bg-slate-900">M.Tech / M.E.</option>
                      <option value="B.Sc / BCA" className="bg-slate-900">B.Sc / BCA</option>
                      <option value="MCA / M.Sc" className="bg-slate-900">MCA / M.Sc</option>
                      <option value="Diploma" className="bg-slate-900">Polytechnic Diploma</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Branch / Department</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science & Engineering"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Graduation Year</label>
                    <select
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(Number(e.target.value))}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                    >
                      <option value={2025} className="bg-slate-900">2025</option>
                      <option value={2026} className="bg-slate-900">2026</option>
                      <option value={2027} className="bg-slate-900">2027</option>
                      <option value={2028} className="bg-slate-900">2028</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {selectedRole === "INDUSTRY" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Microsoft India"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Company Official Website</label>
                  <input
                    type="url"
                    required
                    placeholder="https://microsoft.com"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            {selectedRole === "FACULTY" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Institution / University</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Institute of Technology"
                      value={facultyInstitution}
                      onChange={(e) => setFacultyInstitution(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science & Engineering"
                      value={facultyDepartment}
                      onChange={(e) => setFacultyDepartment(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Designation</label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  >
                    <option value="Professor & Head" className="bg-slate-900">Professor & Head (HOD)</option>
                    <option value="Associate Professor" className="bg-slate-900">Associate Professor</option>
                    <option value="Assistant Professor" className="bg-slate-900">Assistant Professor</option>
                    <option value="Industry Adjunct Faculty" className="bg-slate-900">Industry Adjunct Faculty</option>
                  </select>
                </div>
              </>
            )}

            {selectedRole === "INSTITUTION" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Institution / College Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Institute of Technology"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Institution Category</label>
                  <select
                    value={institutionType}
                    onChange={(e) => setInstitutionType(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  >
                    <option value="Tier-1 Institute (IIT/NIT/IIIT)" className="bg-slate-900">Tier-1 Institute (IIT/NIT/IIIT)</option>
                    <option value="University" className="bg-slate-900">Central / State University</option>
                    <option value="Autonomous College" className="bg-slate-900">Autonomous Engineering College</option>
                    <option value="Affiliated Engineering College" className="bg-slate-900">Affiliated Engineering College</option>
                    <option value="Polytechnic / Diploma" className="bg-slate-900">Polytechnic / Diploma</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-3"
            icon={<ArrowRight size={16} />}
          >
            Create {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()} Account
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400 border-t border-white/5">
          <span>Already have an account? </span>
          <Link href="/login" className="text-primary-400 font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </Card>
    </div>
  );
}
