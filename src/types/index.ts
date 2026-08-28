export type UserRole = "STUDENT" | "RECRUITER" | "FACULTY" | "TPO_ADMIN" | "ADMIN";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  profileId?: string;
  department?: string;
  institutionName?: string;
  companyName?: string;
}

export type VerificationStatus = "SELF_REPORTED" | "ASSESSMENT_VERIFIED" | "FACULTY_ENDORSED";

export interface SkillItem {
  id: string;
  name: string;
  category: "Technical" | "Soft" | "Domain" | "Tool";
  description?: string;
  proficiencyLevel: number; // 1 to 5
  verificationStatus: VerificationStatus;
  score?: number;
  lastAssessedAt?: string;
}

export interface AssessmentItem {
  id: string;
  skillName: string;
  title: string;
  durationMins: number;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
  passingScore: number;
  totalQuestions: number;
  isCompleted?: boolean;
  score?: number;
}

export interface RoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  resourceType: "VIDEO" | "ARTICLE" | "PROJECT" | "QUIZ" | "CERT";
  resourceUrl?: string;
  isCompleted: boolean;
}

export interface LearningRoadmapData {
  id: string;
  targetRole: string;
  gapSummary: string;
  estimatedHours: number;
  progressPercent: number;
  steps: RoadmapStep[];
}

export interface JobPostingItem {
  id: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  type: "INTERNSHIP" | "FULL_TIME" | "APPRENTICESHIP";
  location: string;
  stipendSalary: string;
  deadline: string;
  status: "OPEN" | "CLOSED";
  minCgpa: number;
  matchScore: number;
  description: string;
  requiredSkills: { name: string; weight: number; isMandatory: boolean }[];
  applicationStatus?: "APPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "OFFERED" | "REJECTED";
}

export interface CandidateItem {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  cgpa: number;
  readinessScore: number;
  matchScore: number;
  avatarUrl?: string;
  skills: { name: string; level: number; verified: boolean }[];
  status: "APPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "OFFERED" | "REJECTED";
  appliedAt: string;
}

export interface MentorshipSessionItem {
  id: string;
  facultyName: string;
  studentName: string;
  topic: string;
  scheduledAt: string;
  meetingLink?: string;
  status: "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string;
}

export interface InstitutionAnalytics {
  totalStudents: number;
  placementReadyPercentage: number;
  averageSkillScore: number;
  activeRecruiters: number;
  totalOffers: number;
  departmentReadiness: {
    department: string;
    total: number;
    ready: number;
    avgScore: number;
  }[];
  skillDemandVsSupply: {
    skill: string;
    industryDemand: number;
    studentSupply: number;
  }[];
  placementFunnel: {
    stage: string;
    count: number;
  }[];
}
