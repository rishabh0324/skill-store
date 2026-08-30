# NEXUS EDU — Academia–Industry Collaboration Platform
> **Smart India Hackathon (SIH) 2026 • Problem Statement 44**  
> AI-driven Student Skill Mapping, Adaptive Assessments, Gap Analysis, Recruiter ATS, and Institutional Analytics.

---

## 🌟 Project Overview

**NEXUS EDU** is a modern, high-performance platform designed to bridge the structural disconnect between academic engineering curricula and fast-evolving corporate hiring demands.

Aligned with **NEP 2020 (National Education Policy)** and **Outcome-Based Education (OBE)**, the platform establishes an authenticated multi-role digital ecosystem connecting **Students, Industry Recruiters, Faculty Mentors, and Institutional TPO Administrators**.

---

## 🏗️ System Architecture & User Roles

```
                      ┌─────────────────────────────────────────┐
                      │    NEXUS EDU Unified Gateway (Web)      │
                      │   [Demo Role Switcher] [Auth State]     │
                      └────────────────────┬────────────────────┘
                                           │
         ┌──────────────────┬──────────────┴─────┬──────────────────┬─────────────────┐
         │                  │                    │                  │                 │
 🎓 Student Desk    💼 Industry Desk     🏅 Faculty Hub     🏛️ Institution     🛡️ System Admin
  (/student)         (/industry)          (/faculty)          (/institution)     (/admin)
  • Skill Radar      • Job Weightings     • Mentorship        • TPO Analytics    • System Security
  • Adaptive Tests   • Vector ATS Match   • Capstone Reviews  • Demand/Supply    • User Directory
  • Gap Roadmaps     • Pipeline Tracker   • Syllabus Advisor  • NAAC/NIRF Export • Audit Logs
  • Public Profile   • Candidate Search   • OBE Rubrics       • Drive Analytics  • Governance
```

---

## 🎯 Implementation Status

| Phase | Description | Key Modules | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Project Architecture & Core Design System | Next.js 14, Tailwind Glassmorphism, Prisma ORM, REST API Envelope | ✅ **Completed** |
| **Phase 2** | Authentication & Role-Based Access Control | 5 Roles, Bcrypt Hashing, JWT Cookies, Dynamic Register, `AuthGuard` | ✅ **Completed** |
| **Phase 3** | Student Skill Mapping & Adaptive Assessments | Master Skill Taxonomy, Anti-Cheat Tests, Automated Grading, OBE Badges, Public Portfolios | ✅ **Completed** |
| **Phase 4** | AI Skill-Gap Analysis & Learning Roadmaps | Vector Distance Engine, Cosine Matching, Curated Milestone Checklists, DB Persistence | ✅ **Completed** |
| **Phase 5** | **Recruiter Job Drives & Vector ATS Matching** | **Skill-Weighted Opening Creator, Sub-50ms Candidate Search, ATS Kanban, 1-Click Apply** | ✅ **Completed** |
| **Phase 6** | Faculty Mentorship & Institutional Analytics | Guidance Scheduler, Curriculum Advisory Telemetry, NAAC/NIRF Exports | ⏳ Upcoming |

---

## 🚀 Phase 5: Recruiter Job Drives & Vector ATS Matching

Phase 5 connects corporate industry talent acquisition leads with student candidates through zero-latency vector ranking and automated ATS workflows:

1. **Skill-Weighted Opening Creator**:
   - Recruiters can publish internship and full-time hiring drives.
   - Dynamic competency weighting matrix: assigns importance weights ($1 - 5$), minimum proficiency thresholds ($0 - 100\%$), and mandatory skill flags.

2. **Sub-50ms Candidate Vector ATS Matcher**:
   - Evaluates applicant verified credentials, faculty endorsements, and self-reported skills against the opening's required vector.
   - Computes multi-factor **Cosine Similarity & Weighted Match Percentage** ($0 - 100\%$) and verifies CGPA eligibility.

3. **Interactive ATS Pipeline Kanban & Candidate Tracker**:
   - 5-stage recruitment funnel: `APPLIED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `TECHNICAL_INTERVIEW` $\rightarrow$ `OFFERED`.
   - Real-time stage advancement, search, match score filtering, and direct links to public verified OBE portfolios (`/p/[username]`).

4. **Student Job Discovery & 1-Click Application Engine**:
   - Students see opportunities ranked by personalized AI match scores.
   - 1-Click application submission with live status tracking.

5. **Prisma Database Schema & REST APIs**:
   - `JobPosting` and `JobApplication` models synchronized to SQLite.
   - REST endpoints: `GET/POST /api/v1/jobs`, `GET /api/v1/jobs/[id]`, and `GET/POST/PATCH /api/v1/applications`.

---

## 🚀 Phase 4: AI Skill-Gap Analysis & Personalized Learning Roadmaps

Phase 4 delivers the AI-powered vector comparison and learning pathway engine:

1. **Multi-Factor Vector Cosine Similarity Engine**:
   - Compares multi-dimensional student competency vectors $\vec{S}$ with industry job benchmark vectors $\vec{T}$:
     $$\text{Cosine Similarity} = \frac{\vec{S} \cdot \vec{T}}{\|\vec{S}\| \|\vec{T}\|}$$
   - Weighted overall role fit score ($0 - 100\%$) applying tiered multipliers: Verified Assessments (1.0x), Faculty Endorsements (0.95x), Self-Reported (0.85x), and Missing (0.0x).
   - Classifies competency status into **Strengths / Benchmarks Met** ($\ge 0$), **Moderate Gaps** ($-1\%$ to $-20\%$), and **Critical Gaps** ($<-20\%$ or mandatory deficit).

2. **Master Target Career Roles Catalog**:
   - Master industry tracks (*Full-Stack AI Solutions Architect*, *Cloud DevOps & Platform Engineer*, *Data Scientist & ML Specialist*, *Distributed Backend Systems Engineer*).
   - Demand level analytics (`CRITICAL`, `VERY HIGH`), average compensation brackets, and vector dimension weights.

3. **Dynamic Database-Backed Milestone Generator**:
   - Automatically synthesizes prioritized recovery milestone checklists targeting candidate-specific deficits.
   - Direct integration with curated high-yield video courses, hands-on GitHub projects, official documentation, interactive labs, and capstone blueprints.
   - Real-time interactive milestone checkbox toggling via `PATCH /api/v1/roadmaps/steps/[id]` with persistent progress percentage updates.

---

## 🚀 Phase 3: Skill Mapping, Adaptive Assessments & OBE Badges

Phase 3 introduces the student competency and evaluation engine:

1. **Master Skill Taxonomy & 3-Tier Verification**:
   - Master skill directory across *Languages, Frameworks, Databases, Cloud & DevOps, AI/ML, and Core Engineering*.
   - 3-Tier verification funnel: `SELF_REPORTED` $\rightarrow$ `ASSESSMENT_VERIFIED` $\rightarrow$ `FACULTY_ENDORSED`.
   - Dynamic polar radar visualization with live Recharts integration.

2. **Adaptive Proctored Test Engine**:
   - Timed countdown tests with anti-cheat browser tab-switch detection.
   - Automated instant evaluation ($\ge 70\%$ passing threshold).
   - Upgrades database skills to `ASSESSMENT_VERIFIED` and awards verified digital badges upon passing.

3. **Public Verified Student Portfolio (`/p/[username]`)**:
   - Publicly accessible profile for recruiters and LinkedIn showcase.
   - Verifiable OBE Badges with cryptographic verification IDs.
   - Print & PDF-ready resume format.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | **Next.js 14 + React 18 + TypeScript** |
| **Styling & Design System** | **Tailwind CSS + Glassmorphism UI Tokens** |
| **UI Components & Icons** | **Lucide React + Atomic Component Architecture** |
| **Data Visualizations** | **Recharts (Polar Radar, Multi-Bar, Trends)** |
| **Backend & Routing** | **Next.js REST API Route Handlers (`/api/v1/...`)** |
| **Database & ORM** | **SQLite (Local Zero-Config) / PostgreSQL + Prisma ORM** |
| **Authentication & Security** | **JWT (HTTP-Only Cookie) + Bcrypt Salt Hashing + RBAC Guard** |
| **Interactive Demo** | **Live Persona Switcher Toolbar** |

---

## 📁 Project Structure

```
d:\sih#44\
├── pages/
│   ├── _app.tsx                # App wrapper with AuthProvider & Glassmorphism styles
│   ├── _document.tsx           # Document head with fonts & design tokens
│   ├── index.tsx               # Landing Hero Page & Role Gateways
│   ├── login.tsx               # Sign In portal with 1-click role demo fills
│   ├── register.tsx            # Dynamic role-based registration form
│   ├── forgot-password.tsx     # Forgot password request page
│   ├── reset-password.tsx      # Reset password form with token verification
│   ├── student.tsx             # Student Dashboard (Live Radar, Skills, Test Center, Roadmaps, Job Matches)
│   ├── industry.tsx            # Industry Recruiter Dashboard (Protected: INDUSTRY, Vector ATS, Drives)
│   ├── recruiter.tsx           # Industry Recruiter Desk alias
│   ├── faculty.tsx             # Faculty Dashboard (Protected: FACULTY)
│   ├── institution.tsx         # Institution Dashboard (Protected: INSTITUTION)
│   ├── admin.tsx               # System Admin Dashboard (Protected: ADMIN)
│   ├── p/[username].tsx        # Public Verified Student Portfolio
│   └── api/v1/                 # RESTful API Endpoints
│       ├── auth/
│       │   ├── login.ts        # Credential verification & JWT cookie issue
│       │   ├── register.ts     # Role-based registration & transaction creation
│       │   ├── logout.ts       # Cookie clearance
│       │   ├── me.ts           # Active session inspection
│       │   ├── forgot-password.ts # Reset token generation
│       │   └── reset-password.ts  # Token verification & password update
│       ├── skills.ts           # Master skills querying & self-reporting
│       ├── assessments/
│       │   ├── index.ts        # Test catalog with attempt statuses
│       │   ├── [id].ts         # Sanitized test question bank delivery
│       │   └── [id]/submit.ts  # Test grading, score calc & badge award
│       ├── portfolio/
│       │   └── [username].ts   # Public verified student portfolio endpoint
│       ├── roadmaps/
│       │   ├── index.ts        # Active roadmap & AI vector gap analysis
│       │   ├── targets.ts      # Target career tracks
│       │   └── steps/[id].ts   # Milestone checkbox toggle & progress recalculation
│       ├── jobs/
│       │   ├── index.ts        # Job listings & skill-weighted opening creator
│       │   └── [id].ts         # Job drive details & applicant pool
│       ├── applications.ts     # ATS candidate status advancement & 1-click apply
│       ├── mentorship.ts       # Guidance slot booking & confirmation
│       └── analytics.ts        # Institutional KPI aggregation
├── prisma/
│   ├── schema.prisma           # Prisma Schema (Users, Skills, Tests, Roadmaps, JobPostings, Applications)
│   ├── seed.js                 # Seeder with 5 roles, skills, tests, roadmaps, job drives
│   └── dev.db                  # Local SQLite database
├── src/
│   ├── components/
│   │   ├── shared/             # Navbar, RoleSwitcher, AuthGuard, MetricCard
│   │   ├── student/            # SkillRadarChart, ProctoredAssessmentModal, SkillGapMatrix, TargetRoleSelector, RoadmapTimeline, JobMatchesList
│   │   ├── recruiter/          # CandidatesPipeline, PostJobModal, JobListingTable
│   │   ├── faculty/            # MentorshipSchedule, CurriculumAdvisory
│   │   ├── tpo/                # PlacementTrendsChart, DepartmentBreakdown
│   │   └── ui/                 # Button, Card, Badge, Progress, Modal
│   ├── context/
│   │   └── AuthContext.tsx     # Global React AuthContext & session hook
│   ├── lib/
│   │   ├── auth.ts             # Auth utilities (bcrypt, JWT, session retrieval)
│   │   ├── prisma.ts           # Prisma Client singleton
│   │   ├── vectorMatching.ts   # Vector cosine similarity, AI gaps & ATS candidate ranking
│   │   ├── mockData.ts         # Platform fixtures & domain datasets
│   │   └── apiResponse.ts      # Standardized JSON response envelope
│   └── types/
│       └── index.ts            # TypeScript interfaces & domain models
├── test_phase2_auth.js         # Automated 13-step Auth & RBAC test suite
├── test_phase3_skills_assessments.js # Automated 11-step Skills & Tests test suite
├── test_phase4_gap_roadmaps.js # Automated 13-step AI Gap & Roadmaps test suite
├── test_phase5_recruiter_ats.js # Automated 14-step Recruiter & Vector ATS test suite
├── package.json
└── tsconfig.json
```

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize Database & Seed Master Data
```bash
# Push schema to local SQLite database
npx prisma db push

# Seed 5 user personas, master skills, tests, roadmaps, and job drives
node prisma/seed.js
```

### Step 3: Run Automated Test Suites
```bash
# Phase 2 Authentication & RBAC Tests
node test_phase2_auth.js

# Phase 3 Skill Mapping & Adaptive Assessments Tests
node test_phase3_skills_assessments.js

# Phase 4 AI Skill-Gap Analysis & Learning Roadmaps Tests
node test_phase4_gap_roadmaps.js

# Phase 5 Recruiter Job Drives & Vector ATS Tests
node test_phase5_recruiter_ats.js
```

### Step 4: Launch Development Server
```bash
# In Windows PowerShell:
npm.cmd run dev

# In Standard Terminal:
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Demo Persona Credentials

| Persona | Role | Email | Password | Default Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `STUDENT` | `student@sih.edu` | `Password@123` | [`/student`](http://localhost:3000/student) |
| **Industry Recruiter** | `INDUSTRY` | `recruiter@techcorp.com` | `Password@123` | [`/industry`](http://localhost:3000/industry) |
| **Faculty / Mentor** | `FACULTY` | `faculty@university.edu` | `Password@123` | [`/faculty`](http://localhost:3000/faculty) |
| **Institution Admin** | `INSTITUTION` | `admin@nit-campus.edu` | `Password@123` | [`/institution`](http://localhost:3000/institution) |
| **System Admin** | `ADMIN` | `admin@sih-platform.gov.in` | `Password@123` | [`/admin`](http://localhost:3000/admin) |
| **Public Portfolio** | *Guest* | *(No login required)* | — | [`/p/aarav-sharma`](http://localhost:3000/p/aarav-sharma) |
