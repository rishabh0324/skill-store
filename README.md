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

### 1. User Roles & Workflows

1. **Student (`/student`)**:
   - **Competency Radar**: Live visualization of verified vs. self-reported skills.
   - **Adaptive Assessments**: Proctored testing cards that award verifiable Outcome-Based Education credentials.
   - **AI Skill-Gap Roadmaps**: Automatically computes gaps against target corporate roles and generates step-by-step recovery milestones.
   - **1-Click Matched Applications**: Multi-factor match ranking with 1-click job apply.
   - **Public Verified Portfolio (`/p/[username]`)**: Shareable showcase with verifiable badges and project repositories.

2. **Industry Partner / Recruiter (`/industry`)**:
   - **Skill-Weighted Job Creator**: Define job openings with custom mathematical skill weights (1–5).
   - **AI-Ranked ATS Pipeline**: Real-time candidate ranking based on skill overlap, test percentiles, and academic criteria.
   - **Candidate Advancement**: 1-click status transitions (*Applied $\rightarrow$ Review $\rightarrow$ Shortlisted $\rightarrow$ Interview $\rightarrow$ Offered*).

3. **Faculty / Mentor (`/faculty`)**:
   - **Mentorship Scheduling**: 1-on-1 student career guidance and Google Meet session integration.
   - **Curriculum Gap Advisory**: Aggregated recruiter search trends notifying departments of emerging industry tech requirements.

4. **Institution Admin / TPO (`/institution`)**:
   - **Placement Readiness Heatmap**: Batch and department-level readiness breakdowns.
   - **Market Demand vs Campus Supply**: Real-time bottleneck identification.
   - **Accreditation Export**: NAAC Criterion 5 and NIRF compliance audit readiness.

5. **System Administrator (`/admin`)**:
   - **Master Governance**: Platform security protocols, database status, and user directory oversight.

---

## 🔐 Phase 2: Authentication & Role-Based Access Control (RBAC)

Phase 2 establishes an enterprise-grade authentication and user management foundation:

- **Password Hashing**: 10-round salted bcrypt hashing (`bcryptjs`).
- **Session Management**: Cryptographically signed JSON Web Tokens (JWT) stored in HTTP-Only, SameSite cookies (`sih_token`).
- **Dynamic Registration**: Role-specific telemetry forms tailored for Students, Industry Recruiters, Faculty, and Institutions.
- **Route Protection (`AuthGuard`)**: Automatic route interceptors that prevent cross-role unauthorized access and redirect users to their designated desks.
- **Password Recovery**: Secure token-based forgot-password and reset-password workflows.
- **State Management**: Global React `AuthContext` with instant 1-click persona switching for hackathon evaluation.

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
│   ├── student.tsx             # Student Dashboard (Protected: STUDENT)
│   ├── industry.tsx            # Industry Dashboard (Protected: INDUSTRY)
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
│       ├── skills.ts           # Competency querying & self-reporting
│       ├── assessments.ts      # Test fetching & submission grading
│       ├── roadmaps.ts         # Gap recovery milestone tracking
│       ├── jobs.ts             # Job listings & recruiter openings
│       ├── applications.ts     # ATS candidate status advancement
│       ├── mentorship.ts       # Guidance slot booking & confirmation
│       └── analytics.ts        # Institutional KPI aggregation
├── prisma/
│   ├── schema.prisma           # Prisma Relational Schema (User, Profiles, ResetTokens)
│   ├── seed.js                 # Database Seeder with 5 demo accounts
│   └── dev.db                  # Local SQLite database
├── src/
│   ├── components/
│   │   ├── shared/             # Navbar, RoleSwitcher, AuthGuard, MetricCard
│   │   ├── student/            # SkillRadarChart, RoadmapTimeline, AssessmentCard, JobMatchesList
│   │   ├── recruiter/          # CandidatesPipeline, PostJobModal, JobListingTable
│   │   ├── faculty/            # MentorshipSchedule, CurriculumAdvisory
│   │   ├── tpo/                # PlacementTrendsChart, DepartmentBreakdown
│   │   └── ui/                 # Button, Card, Badge, Progress, Modal
│   ├── context/
│   │   └── AuthContext.tsx     # Global React AuthContext & session hook
│   ├── lib/
│   │   ├── auth.ts             # Auth utilities (bcrypt, JWT, session retrieval)
│   │   ├── prisma.ts           # Prisma Client singleton
│   │   ├── mockData.ts         # Platform fixtures & domain datasets
│   │   ├── apiResponse.ts      # Standardized JSON response envelope
│   │   └── utils.ts            # Styling & class merger
│   └── types/
│       └── index.ts            # TypeScript interfaces & domain models
├── test_phase2_auth.js         # Automated 13-step Auth & RBAC test suite
├── .env.example                # Environment variables template
├── .env                        # Local configuration
├── .gitignore                  # Git ignore rules (DB & env safely excluded)
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

### Step 2: Initialize Database & Seed Demo Accounts
```bash
# Push schema to local SQLite database
npx prisma db push

# Seed 5 user personas with hashed credentials
node prisma/seed.js
```

### Step 3: Run Automated Verification Tests
```bash
node test_phase2_auth.js
```

### Step 4: Launch Development Server
```bash
# In Windows PowerShell:
npm.cmd run dev

# In Standard Terminal:
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** (or `http://localhost:3001`) in your browser.

---

## 🧪 Demo Persona Credentials

Use the **"Demo Persona" dropdown** in the top navigation bar, or sign in manually at [`/login`](http://localhost:3000/login):

| Persona | Role | Email | Password | Default Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `STUDENT` | `student@sih.edu` | `Password@123` | [`/student`](http://localhost:3000/student) |
| **Industry Recruiter** | `INDUSTRY` | `recruiter@techcorp.com` | `Password@123` | [`/industry`](http://localhost:3000/industry) |
| **Faculty / Mentor** | `FACULTY` | `faculty@university.edu` | `Password@123` | [`/faculty`](http://localhost:3000/faculty) |
| **Institution Admin** | `INSTITUTION` | `admin@nit-campus.edu` | `Password@123` | [`/institution`](http://localhost:3000/institution) |
| **System Admin** | `ADMIN` | `admin@sih-platform.gov.in` | `Password@123` | [`/admin`](http://localhost:3000/admin) |
| **Public Portfolio** | *Guest* | *(No login required)* | — | [`/p/aarav-sharma`](http://localhost:3000/p/aarav-sharma) |

---

## 📡 REST API Catalog (`/api/v1`)

| Endpoint | Method | Role Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/register` | `POST` | Public | Register new user + role-specific profile |
| `/api/v1/auth/login` | `POST` | Public | Authenticate user & set JWT session cookie |
| `/api/v1/auth/logout` | `POST` | Authenticated | Clear session cookie |
| `/api/v1/auth/me` | `GET` | Authenticated | Retrieve active authenticated session |
| `/api/v1/auth/forgot-password` | `POST` | Public | Generate 1-hour password reset token |
| `/api/v1/auth/reset-password` | `POST` | Public | Reset password with token confirmation |
| `/api/v1/skills` | `GET`, `POST` | Student | Get competency radar / self-report skill |
| `/api/v1/assessments` | `GET`, `POST` | Student | List available tests / submit test attempt |
| `/api/v1/roadmaps` | `GET`, `PATCH` | Student | Get learning roadmap / toggle milestone |
| `/api/v1/jobs` | `GET`, `POST` | Industry/Student | List AI-ranked jobs / post recruiter opening |
| `/api/v1/applications` | `GET`, `POST`, `PATCH` | Industry/Student | ATS pipeline candidates & status advancement |
| `/api/v1/mentorship` | `GET`, `POST` | Faculty/Student | Mentorship sessions & meeting links |
| `/api/v1/analytics` | `GET` | Institution/Admin | Institutional KPIs & department breakdown |

---

## 📊 Verification Test Results

```
==================================================
🧪 RUNNING PHASE 2 AUTH & RBAC VERIFICATION SUITE
==================================================
✅ PASS: Student Login (student@sih.edu)
✅ PASS: Industry Login (recruiter@techcorp.com)
✅ PASS: Faculty Login (faculty@university.edu)
✅ PASS: Institution Login (admin@nit-campus.edu)
✅ PASS: Admin Login (admin@sih-platform.gov.in)
✅ PASS: Invalid Password Rejection (401 Unauthorized)
✅ PASS: Session Verification via /api/v1/auth/me
✅ PASS: New Industry Registration & Profile Creation
✅ PASS: Duplicate Account Prevention (409 Conflict)
✅ PASS: Forgot Password Token Generation
✅ PASS: Password Reset with Token Confirmation
✅ PASS: Login with Reset Password
✅ PASS: Logout and Cookie Clearance
==================================================
📊 TEST RESULTS: 13 Passed, 0 Failed
==================================================
```
