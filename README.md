# NEXUS EDU — Academia–Industry Collaboration Platform
> **Smart India Hackathon (SIH) 2026 • Problem Statement 44**  
> AI-driven Student Skill Mapping, Adaptive Assessments, Gap Analysis, Recruiter ATS, and Institutional Analytics.

---

## 🌟 Project Overview

**NEXUS EDU** is a modern, high-performance platform designed to bridge the structural disconnect between academic engineering curricula and fast-evolving industry talent demands.

Aligend with **NEP 2020 (National Education Policy)** and **Outcome-Based Education (OBE)**, the system creates a unified digital ecosystem connecting **Students, Industry Recruiters, Faculty Mentors, and Institutional TPO Administrators**.

---

## 🏗️ System Architecture & User Roles

```
                      ┌─────────────────────────────────────────┐
                      │    NEXUS EDU Unified Gateway (Web)      │
                      └────────────────────┬────────────────────┘
                                           │
         ┌──────────────────┬──────────────┴─────┬──────────────────┐
         │                  │                    │                  │
 🎓 Student Hub     💼 Recruiter Desk    🏅 Faculty Hub     🏛️ TPO Center
 • Skill Radar      • Job Weightings     • Mentorship       • Readiness Heatmap
 • Adaptive Tests   • Vector ATS Match   • Capstone Reviews • Demand vs Supply
 • Gap Roadmaps     • Pipeline Tracker   • Syllabus Advisor • NAAC/NIRF Exports
 • Public Profile   • Candidate Search   • OBE Rubrics      • Drive Analytics
```

### 1. User Roles & Workflows

1. **Student (`/student`)**:
   - **Dynamic Competency Radar**: Live visualization of verified vs self-reported skills.
   - **Adaptive Assessments**: Proctored testing engine that awards verifiable skill credentials.
   - **AI Skill-Gap Roadmaps**: Automatically computes gaps against target industry roles and generates step-by-step recovery milestones.
   - **1-Click Matched Applications**: Multi-factor AI score ranking matching jobs and internships.
   - **Public Verified Portfolio (`/p/[username]`)**: Shareable showcase with verifiable badges and project repositories.

2. **Industry Recruiter (`/recruiter`)**:
   - **Skill-Weighted Job Creator**: Define job requirements with custom mathematical weights (1-5).
   - **AI-Ranked ATS Pipeline**: Real-time candidate ranking based on skill overlap, test percentiles, and academic criteria.
   - **Candidate Advancement**: 1-click status transitions (Applied $\rightarrow$ Review $\rightarrow$ Shortlisted $\rightarrow$ Interview $\rightarrow$ Offered).

3. **Faculty / Mentor (`/faculty`)**:
   - **Mentorship Scheduling**: 1-on-1 career guidance and capstone project review tracker.
   - **Curriculum Gap Advisory**: Aggregated recruiter search trends notifying departments of emerging tech requirements (e.g., Docker, Vector DBs, Cloud Architecture).

4. **TPO / Institute Admin (`/tpo`)**:
   - **Placement Readiness Heatmap**: Batch and department-level readiness breakdown.
   - **Market Demand vs Campus Supply**: Real-time bottleneck identification.
   - **Accreditation Export**: NAAC Criterion 5 and NIRF compliance audit readiness.

---

## 🛠️ Technology Stack (Phase 1)

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router) + TypeScript** |
| **Styling & Theme** | **Tailwind CSS + Glassmorphic Design System** |
| **UI Components & Icons** | **Lucide React + Framer Motion + Atomic Design** |
| **Data Visualizations** | **Recharts (Radar, Bar, Line & Funnels)** |
| **Backend & Routing** | **Next.js REST Route Handlers (`/api/v1/...`)** |
| **Database & ORM** | **SQLite (Local Zero-Config) / PostgreSQL + Prisma ORM** |
| **Authentication** | **JWT Session Cookies + Role-Based Access Control (RBAC)** |
| **Interactive Demo** | **Live Persona Switcher Toolbar** |

---

## 📁 Folder Structure

```
d:\sih#44\
├── prisma/
│   ├── schema.prisma           # Complete Entity-Relationship schema
│   ├── seed.js                 # Realistic seed data
│   └── dev.db                  # Local SQLite database
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & Register pages
│   │   ├── (dashboard)/        # Student, Recruiter, Faculty & TPO portals
│   │   ├── p/[username]/       # Public verified portfolio route
│   │   ├── api/v1/             # RESTful API handlers
│   │   ├── layout.tsx          # Root Layout & Navigation
│   │   ├── page.tsx            # High-Impact Hero Landing Page
│   │   └── globals.css         # Glassmorphism tokens & animations
│   ├── components/
│   │   ├── shared/             # Navbar, RoleSwitcher, MetricCard, Notifications
│   │   ├── student/            # Radar Chart, Roadmap Timeline, Test Cards, Jobs
│   │   ├── recruiter/          # ATS Pipeline, Job Modal, Listings
│   │   ├── faculty/            # Mentorship Schedule, Curriculum Advisory
│   │   ├── tpo/                # Placement Trends, Department Breakdown
│   │   └── ui/                 # Button, Card, Badge, Progress, Modal
│   ├── lib/
│   │   ├── prisma.ts           # Prisma singleton
│   │   ├── auth.ts             # Password hashing, JWT signing & demo profiles
│   │   ├── mockData.ts         # Comprehensive data fixtures
│   │   ├── apiResponse.ts      # Standardized JSON response helpers
│   │   └── utils.ts            # Formatting & class merging
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── .env.example                # Environment variables template
├── .env                        # Active local configuration
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x tested)
- **NPM**: v9.0.0 or higher

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize Database & Seed Fixtures
```bash
# Push schema to local database
npx prisma db push

# Populate realistic demo students, recruiters, faculty, skills & jobs
node prisma/seed.js
```

### Step 3: Launch Local Development Server
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Demo Personas (Instant 1-Click Evaluation)

Use the **"Demo Role" dropdown** in the top navigation bar to seamlessly switch between all 4 personas:

1. **Student**: `aarav.sharma@institution.edu.in` (Password: `Password@123`)
2. **Recruiter**: `priya.nair@microsoft.com` (Password: `Password@123`)
3. **Faculty**: `dr.ramesh@institution.edu.in` (Password: `Password@123`)
4. **TPO Admin**: `tpo.head@institution.edu.in` (Password: `Password@123`)

---

## 📡 REST API Structure (`/api/v1`)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Authenticate user & set JWT session cookie |
| `/api/v1/auth/register` | `POST` | Register new student, recruiter, or faculty |
| `/api/v1/auth/me` | `GET` | Retrieve active authenticated session |
| `/api/v1/skills` | `GET`, `POST` | Get student skills radar / self-report skill |
| `/api/v1/assessments` | `GET`, `POST`| List available tests / submit test attempt |
| `/api/v1/roadmaps` | `GET`, `PATCH`| Get learning roadmap / toggle milestone step |
| `/api/v1/jobs` | `GET`, `POST` | List AI-ranked jobs / post recruiter opening |
| `/api/v1/applications` | `GET`, `POST`, `PATCH` | ATS pipeline candidates & status advancement |
| `/api/v1/mentorship` | `GET`, `POST` | Mentorship sessions & meeting links |
| `/api/v1/analytics` | `GET` | TPO institutional KPIs & department breakdown |

---

## 🔜 Next Steps: Phase 2 Roadmap
- Integrating Python FastAPI AI microservice with `Sentence-Transformers` for real-time vector embeddings.
- Full PDF Resume & JD semantic entity extraction parser.
- Interactive code-execution sandbox for online coding assessments.
- WebSocket real-time live interview chat & notifications.
