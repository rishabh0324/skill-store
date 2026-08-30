export type UserRole = "STUDENT" | "INDUSTRY" | "FACULTY" | "INSTITUTION" | "ADMIN";

export interface StudentProfileData {
  id?: string;
  userId?: string;
  collegeName: string;
  degree: string;
  department: string;
  graduationYear: number;
  cgpa?: number | null;
  rollNo?: string | null;
  bio?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface IndustryProfileData {
  id?: string;
  userId?: string;
  companyName: string;
  companyWebsite: string;
  designation?: string | null;
  domain?: string | null;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface FacultyProfileData {
  id?: string;
  userId?: string;
  institutionName: string;
  department: string;
  designation: string;
  specialization?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface InstitutionProfileData {
  id?: string;
  userId?: string;
  institutionName: string;
  institutionType: string;
  officialEmail?: string | null;
  website?: string | null;
  city?: string | null;
  state?: string | null;
  code?: string | null;
  nirfRank?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  studentProfile?: StudentProfileData | null;
  industryProfile?: IndustryProfileData | null;
  facultyProfile?: FacultyProfileData | null;
  institutionProfile?: InstitutionProfileData | null;
  [key: string]: any;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserSession;
    token?: string;
  };
  errors?: any;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  collegeName?: string;
  degree?: string;
  department?: string;
  graduationYear?: number;
  companyName?: string;
  companyWebsite?: string;
  institutionName?: string;
  designation?: string;
  institutionType?: string;
  [key: string]: any;
}

export interface LoginPayload {
  email: string;
  password: string;
  [key: string]: any;
}

// Domain Model Types for Platform Services
export interface SkillItem {
  id: string;
  name: string;
  category?: string;
  description?: string;
  score?: number;
  proficiencyLevel?: any;
  verificationStatus?: string;
  selfScore?: number;
  verifiedScore?: number;
  industryBenchmark?: number;
  isVerified?: boolean;
  badgeEarned?: string;
  [key: string]: any;
}

export interface AssessmentItem {
  id: string;
  title: string;
  skillName: string;
  category?: string;
  difficulty?: string;
  difficultyLevel?: string;
  durationMinutes?: number;
  durationMins?: number;
  totalQuestions: number;
  passingScore: number;
  badgeReward?: string;
  status?: string;
  score?: number;
  isCompleted?: boolean;
  bestScore?: number;
  questions?: {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
  }[];
  [key: string]: any;
}

export interface TargetRoleData {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  avgSalaryRange: string;
  industryDemandLevel: "HIGH" | "VERY HIGH" | "CRITICAL" | string;
  icon?: string | null;
  requiredSkills: {
    name: string;
    minBenchmark: number;
    weight: number;
    isMandatory: boolean;
    category?: string;
  }[];
}

export interface SkillGapItemData {
  skillName: string;
  category: string;
  studentScore: number;
  targetBenchmark: number;
  weight: number;
  isMandatory: boolean;
  gapDelta: number;
  gapStatus: "MATCHED" | "MODERATE_GAP" | "CRITICAL_GAP";
  verificationStatus: "ASSESSMENT_VERIFIED" | "FACULTY_ENDORSED" | "SELF_REPORTED" | "MISSING";
  hasAssessment: boolean;
  assessmentId?: string;
}

export interface RoadmapStep {
  id: string;
  stepNumber?: number;
  week?: number;
  title: string;
  description: string;
  skillName?: string;
  gapDelta?: number;
  resourceType: string;
  resourceUrl: string;
  provider?: string | null;
  estimatedHours?: number;
  isCompleted: boolean;
  completedAt?: string | null;
  [key: string]: any;
}

export interface LearningRoadmapData {
  id: string;
  targetRoleId?: string | null;
  targetRole?: string;
  roleTitle?: string;
  roleCategory?: string | null;
  overallFitScore?: number;
  cosineSimilarity?: number;
  estimatedWeeks?: number;
  estimatedHours?: number;
  summary?: string;
  gapSummary?: string;
  progressPercent?: number;
  strengthsCount?: number;
  moderateGapsCount?: number;
  criticalGapsCount?: number;
  gaps?: SkillGapItemData[];
  steps: RoadmapStep[];
  milestones?: RoadmapStep[];
  [key: string]: any;
}

export interface JobPostingItem {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  type: string;
  status?: string;
  stipendOrSalary?: string;
  stipendSalary?: string;
  minCgpa: number;
  deadline: string;
  requiredSkills: {
    name?: string;
    skillName?: string;
    weight: number;
    isMandatory?: boolean;
    [key: string]: any;
  }[];
  vectorMatchScore?: number;
  matchScore?: number;
  applicationStatus?: string;
  [key: string]: any;
}

export interface CandidateItem {
  id: string;
  studentId?: string;
  name: string;
  email: string;
  collegeName?: string;
  degree?: string;
  department?: string;
  cgpa: number;
  avatarUrl?: string;
  vectorMatchScore?: number;
  matchScore?: number;
  verifiedSkills?: any[];
  skills?: any[];
  status: string;
  appliedAt: string;
  [key: string]: any;
}

export interface MentorshipSessionItem {
  id: string;
  studentName: string;
  studentEmail?: string;
  studentAvatar?: string;
  facultyName?: string;
  topic: string;
  scheduledAt: string;
  durationMinutes?: number;
  status: string;
  meetingLink?: string;
  notes?: string;
  [key: string]: any;
}

export interface InstitutionAnalytics {
  totalStudents: number;
  verifiedSkillsCount?: number;
  industryPartnersCount?: number;
  averageReadinessScore?: number;
  placementRateProjected?: number;
  placementReadyPercentage?: number;
  activeRecruiters?: number;
  totalOffers?: number;
  skillDemandVsSupply?: any;
  departmentReadiness?: {
    department: string;
    total?: number;
    ready?: number;
    avgScore?: number;
    totalStudents?: number;
    readinessPercentage?: number;
    readinessScore?: number;
    tier1Count?: number;
    [key: string]: any;
  }[];
  skillSupplyVsDemand?: {
    skill: string;
    industryDemand: number;
    studentSupply: number;
    [key: string]: any;
  }[];
  [key: string]: any;
}
