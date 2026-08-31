const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Phase 3 Master Skills, Assessments, and OBE Credentials...");

  const passwordHash = await bcrypt.hash("Password@123", 10);

  // 1. Master Skills Catalog
  const skillsData = [
    {
      name: "React.js & Next.js",
      category: "Frameworks",
      description: "Modern component architecture, Server Components (RSC), SSR, and App Router.",
      industryBenchmark: 85.0,
      icon: "Code2",
    },
    {
      name: "Python & Fast-API",
      category: "Languages",
      description: "Async web services, scientific computing, data transformation, and REST contracts.",
      industryBenchmark: 80.0,
      icon: "Terminal",
    },
    {
      name: "PostgreSQL & Prisma ORM",
      category: "Databases",
      description: "Relational data modeling, indexing strategies, ACID compliance, and query tuning.",
      industryBenchmark: 75.0,
      icon: "Database",
    },
    {
      name: "Docker & Containerization",
      category: "Cloud & DevOps",
      description: "Container builds, multi-stage Alpine images, networking, and docker-compose.",
      industryBenchmark: 80.0,
      icon: "Layers",
    },
    {
      name: "Data Structures & Algorithms",
      category: "Core Engineering",
      description: "Asymptotic complexity, graph algorithms, dynamic programming, and memory layouts.",
      industryBenchmark: 90.0,
      icon: "Cpu",
    },
    {
      name: "Machine Learning & PyTorch",
      category: "AI / ML",
      description: "Supervised/unsupervised models, tensor operations, evaluation metrics, and embeddings.",
      industryBenchmark: 70.0,
      icon: "Sparkles",
    },
    {
      name: "TypeScript",
      category: "Languages",
      description: "Strict static typing, generics, conditional types, and build-time safety.",
      industryBenchmark: 80.0,
      icon: "FileCode",
    },
    {
      name: "Kubernetes & Cloud Infra",
      category: "Cloud & DevOps",
      description: "Pod orchestration, service meshes, Helm charts, and cloud IAM policies.",
      industryBenchmark: 65.0,
      icon: "Cloud",
    },
    {
      name: "Redis & Distributed Caching",
      category: "Databases",
      description: "In-memory caching, pub/sub channels, rate limiting, and session stores.",
      industryBenchmark: 70.0,
      icon: "HardDrive",
    },
  ];

  const createdSkills = {};
  for (const s of skillsData) {
    const record = await prisma.skill.upsert({
      where: { name: s.name },
      update: {
        category: s.category,
        description: s.description,
        industryBenchmark: s.industryBenchmark,
        icon: s.icon,
      },
      create: s,
    });
    createdSkills[s.name] = record;
  }

  // 2. Student User & Profile
  const studentUser = await prisma.user.upsert({
    where: { email: "student@sih.edu" },
    update: {},
    create: {
      email: "student@sih.edu",
      passwordHash,
      name: "Aarav Sharma",
      role: "STUDENT",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const studentProfile = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      collegeName: "National Institute of Technology (NIT)",
      degree: "B.Tech",
      department: "Computer Science & Engineering",
      graduationYear: 2026,
      cgpa: 8.85,
      rollNo: "CS22B044",
      bio: "Aspiring Cloud AI Architect. Passionate about Distributed Systems, Vector Databases, and NEP 2020 OBE accredited engineering.",
    },
  });

  // 3. Seed Student Skills (Verified & Self-Reported)
  const studentSkillsData = [
    {
      skillId: createdSkills["React.js & Next.js"].id,
      selfScore: 95.0,
      verifiedScore: 92.0,
      verificationStatus: "ASSESSMENT_VERIFIED",
      badgeEarned: "React Certified Developer (OBE-Level 4)",
      verifiedAt: new Date(),
    },
    {
      skillId: createdSkills["Python & Fast-API"].id,
      selfScore: 90.0,
      verifiedScore: 88.0,
      verificationStatus: "ASSESSMENT_VERIFIED",
      badgeEarned: "Python Microservices Specialist",
      verifiedAt: new Date(),
    },
    {
      skillId: createdSkills["PostgreSQL & Prisma ORM"].id,
      selfScore: 80.0,
      verifiedScore: 78.0,
      verificationStatus: "FACULTY_ENDORSED",
      badgeEarned: "Relational Database Architect",
      verifiedAt: new Date(),
    },
    {
      skillId: createdSkills["Data Structures & Algorithms"].id,
      selfScore: 85.0,
      verifiedScore: 82.0,
      verificationStatus: "ASSESSMENT_VERIFIED",
      badgeEarned: "Algorithmic Problem Solver (Tier-1)",
      verifiedAt: new Date(),
    },
    {
      skillId: createdSkills["Docker & Containerization"].id,
      selfScore: 65.0,
      verifiedScore: null,
      verificationStatus: "SELF_REPORTED",
      badgeEarned: null,
      verifiedAt: null,
    },
    {
      skillId: createdSkills["Machine Learning & PyTorch"].id,
      selfScore: 60.0,
      verifiedScore: null,
      verificationStatus: "SELF_REPORTED",
      badgeEarned: null,
      verifiedAt: null,
    },
  ];

  for (const ss of studentSkillsData) {
    await prisma.studentSkill.upsert({
      where: {
        studentProfileId_skillId: {
          studentProfileId: studentProfile.id,
          skillId: ss.skillId,
        },
      },
      update: ss,
      create: {
        studentProfileId: studentProfile.id,
        ...ss,
      },
    });
  }

  // 4. Seed Student Portfolio Projects
  const projectsData = [
    {
      title: "Distributed Microservices Vector Search Engine",
      description: "Built high-throughput cosine similarity indexing for 1M+ embeddings using Python, Fast-API, Redis, and Docker.",
      techStack: "Python, Fast-API, Redis, Vector Embeddings, Docker",
      repoUrl: "https://github.com/aarav-sharma/vector-search-engine",
      liveUrl: "https://vector-engine.demo.io",
      isVerified: true,
    },
    {
      title: "Real-Time Collaborative Code Editor",
      description: "Interactive browser IDE with WebSockets, Operational Transformation (OT), and execution sandbox.",
      techStack: "Next.js, TypeScript, WebSockets, Tailwind CSS",
      repoUrl: "https://github.com/aarav-sharma/collab-code-ide",
      liveUrl: "https://collab-code.demo.io",
      isVerified: true,
    },
    {
      title: "Automated NAAC / NIRF Institutional Analytics Hub",
      description: "Outcome-Based Education data pipeline mapping student course outcomes (COs) to program outcomes (POs).",
      techStack: "PostgreSQL, Prisma, Recharts, React 18",
      repoUrl: "https://github.com/aarav-sharma/obe-accreditation-hub",
      liveUrl: "https://obe-hub.demo.io",
      isVerified: true,
    },
  ];

  for (const p of projectsData) {
    await prisma.portfolioProject.create({
      data: {
        studentProfileId: studentProfile.id,
        ...p,
      },
    });
  }

  // 5. Seed Assessments with Anti-Cheat Question Banks
  // Assessment A: React.js & Next.js
  const reactAssessment = await prisma.assessment.create({
    data: {
      skillId: createdSkills["React.js & Next.js"].id,
      title: "Advanced Next.js App Router & Performance Mastery",
      description: "Evaluate your proficiency in React Server Components, Suspense boundaries, streaming SSR, and Webpack optimizations.",
      difficulty: "Advanced",
      durationMinutes: 15,
      totalQuestions: 5,
      passingScore: 70.0,
      badgeReward: "React Certified Developer (OBE-Level 4)",
      questions: {
        create: [
          {
            questionText: "What is the primary benefit of React Server Components (RSC) in Next.js App Router?",
            optionsJson: JSON.stringify([
              "They completely eliminate the need for client-side JavaScript bundles for server-rendered parts.",
              "They run on the client device using WebAssembly for faster execution.",
              "They replace standard CSS modules with server-computed inline styles.",
              "They convert all API routes into GraphQL queries automatically."
            ]),
            correctOptionIndex: 0,
            explanation: "RSCs execute solely on the server and their dependencies are never downloaded to the client bundle, drastically reducing JS payloads."
          },
          {
            questionText: "Which hook should be used to memoize expensive computations between re-renders in React?",
            optionsJson: JSON.stringify([
              "useEffect",
              "useMemo",
              "useCallback",
              "useRef"
            ]),
            correctOptionIndex: 1,
            explanation: "useMemo caches the calculated value of an expensive function until one of its declared dependencies changes."
          },
          {
            questionText: "When should you use the 'use client' directive at the top of a file in Next.js App Router?",
            optionsJson: JSON.stringify([
              "When you need to access Node.js native filesystem modules like 'fs'.",
              "When you want to define a Prisma database query.",
              "When the component uses interactive hooks like useState, useEffect, or browser DOM events.",
              "On every single file in the app directory."
            ]),
            correctOptionIndex: 2,
            explanation: "'use client' defines the boundary where components transition from Server Components to interactive Client Components."
          },
          {
            questionText: "How does React Suspense handle asynchronous data fetching components?",
            optionsJson: JSON.stringify([
              "It halts the entire server thread until the data is resolved.",
              "It displays a defined fallback UI while the promise resolves without blocking the rest of the page.",
              "It catches uncaught runtime JavaScript exceptions like an ErrorBoundary.",
              "It converts the request into a synchronous blocking AJAX request."
            ]),
            correctOptionIndex: 1,
            explanation: "Suspense allows React to coordinate rendering fallbacks while async operations or child components load in the background."
          },
          {
            questionText: "Which Next.js configuration option enables automatic package transpilation for ESM libraries?",
            optionsJson: JSON.stringify([
              "transpilePackages",
              "experimental.esmOnly",
              "webpack.optimizeBundles",
              "babel.includeNodeModules"
            ]),
            correctOptionIndex: 0,
            explanation: "transpilePackages instructs Next.js to transpile specific npm packages via its bundler pipeline."
          }
        ]
      }
    }
  });

  // Assessment B: Docker & Containerization
  await prisma.assessment.create({
    data: {
      skillId: createdSkills["Docker & Containerization"].id,
      title: "Docker Fundamentals & Production Containerization",
      description: "Test your skills in container isolation, multi-stage builds, layer caching, and networking.",
      difficulty: "Intermediate",
      durationMinutes: 12,
      totalQuestions: 5,
      passingScore: 70.0,
      badgeReward: "Docker Certified Container Architect",
      questions: {
        create: [
          {
            questionText: "What is the key advantage of using Multi-Stage Builds in a Dockerfile?",
            optionsJson: JSON.stringify([
              "It allows running multiple containers simultaneously inside a single image.",
              "It keeps build dependencies out of the final production image, resulting in lightweight, secure containers.",
              "It automatically pushes image layers to Docker Hub on every build.",
              "It bypasses Linux kernel cgroups for faster execution."
            ]),
            correctOptionIndex: 1,
            explanation: "Multi-stage builds allow copying only the compiled artifacts into a minimal base image (like Alpine), reducing image size from 1GB to <100MB."
          },
          {
            questionText: "Which Docker command removes all stopped containers, unused networks, and dangling images at once?",
            optionsJson: JSON.stringify([
              "docker kill --all",
              "docker system prune",
              "docker rm -rf /",
              "docker clean cache"
            ]),
            correctOptionIndex: 1,
            explanation: "'docker system prune' cleans up dangling resources and unused build caches safely."
          },
          {
            questionText: "What is the purpose of the `.dockerignore` file?",
            optionsJson: JSON.stringify([
              "To prevent specified files (like node_modules, .env, .git) from being copied into the build context.",
              "To block specific IP addresses from accessing the container.",
              "To tell Docker engine to ignore container crashes.",
              "To disable Docker daemon logging."
            ]),
            correctOptionIndex: 0,
            explanation: "A .dockerignore file prevents unnecessary local files from bloating the build context sent to the Docker daemon."
          },
          {
            questionText: "In Docker networking, which network driver is the default for standalone containers?",
            optionsJson: JSON.stringify([
              "host",
              "bridge",
              "overlay",
              "macvlan"
            ]),
            correctOptionIndex: 1,
            explanation: "The default 'bridge' network allows containers on the same bridge to communicate while isolating them from outside hosts."
          },
          {
            questionText: "How do you securely pass sensitive runtime secrets to a Docker container in production?",
            optionsJson: JSON.stringify([
              "Hardcode them into the Dockerfile ENV commands.",
              "Commit an unencrypted .env file into the image.",
              "Inject them via environment variables at runtime or use Docker Secrets / Vault integration.",
              "Print them in the entrypoint bash script."
            ]),
            correctOptionIndex: 2,
            explanation: "Runtime environment variables or dedicated secret management tools keep sensitive secrets out of immutable container images."
          }
        ]
      }
    }
  });

  // Assessment C: Python & Fast-API
  await prisma.assessment.create({
    data: {
      skillId: createdSkills["Python & Fast-API"].id,
      title: "Python Microservices & Asynchronous Architecture",
      description: "Assess async/await concurrency, Pydantic type models, dependency injection, and REST API performance.",
      difficulty: "Advanced",
      durationMinutes: 15,
      totalQuestions: 5,
      passingScore: 70.0,
      badgeReward: "Python Microservices Specialist (Tier-1)",
      questions: {
        create: [
          {
            questionText: "Why is FastAPI significantly faster than traditional frameworks like Flask?",
            optionsJson: JSON.stringify([
              "FastAPI compiles Python directly into C++ binary code.",
              "It is built on top of Starlette and Pydantic utilizing Python's native async/await (ASGI) event loop.",
              "FastAPI disables all data validation to maximize throughput.",
              "It only runs on GPU compute instances."
            ]),
            correctOptionIndex: 1,
            explanation: "FastAPI uses Starlette for high-performance ASGI async handling and Pydantic for fast data validation."
          },
          {
            questionText: "In FastAPI, how do you declare a request body schema with automatic validation?",
            optionsJson: JSON.stringify([
              "Using standard Python dictionaries.",
              "By inheriting from pydantic.BaseModel.",
              "Using JSON schema strings in docstrings.",
              "By manually parsing req.body with json.loads()."
            ]),
            correctOptionIndex: 1,
            explanation: "Pydantic BaseModel classes define typed request and response schemas with automatic validation and OpenAPI docs generation."
          },
          {
            questionText: "What does the `Depends()` utility in FastAPI achieve?",
            optionsJson: JSON.stringify([
              "It installs external pip dependencies at runtime.",
              "It implements Dependency Injection for database sessions, auth checks, and shared logic.",
              "It creates a circular dependency detector.",
              "It compiles Python modules into shared objects."
            ]),
            correctOptionIndex: 1,
            explanation: "FastAPI's Depends() provides a powerful Dependency Injection system for database connections and security authorization."
          },
          {
            questionText: "What is the purpose of Python's Global Interpreter Lock (GIL)?",
            optionsJson: JSON.stringify([
              "It ensures only one native Python thread executes bytecode at once to protect memory management.",
              "It encrypts Python source files on disk.",
              "It limits CPU memory usage to 4GB.",
              "It prevents network sockets from closing unexpectedly."
            ]),
            correctOptionIndex: 0,
            explanation: "The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously."
          },
          {
            questionText: "Which library is the industry standard for asynchronous HTTP requests in Python?",
            optionsJson: JSON.stringify([
              "requests",
              "httpx / aiohttp",
              "urllib.request",
              "socket"
            ]),
            correctOptionIndex: 1,
            explanation: "httpx and aiohttp support async/await concurrency for non-blocking external API calls."
          }
        ]
      }
    }
  });

  // 6. Other Personas (Recruiter, Faculty, Institution, Admin)
  await prisma.user.upsert({
    where: { email: "recruiter@techcorp.com" },
    update: {},
    create: {
      email: "recruiter@techcorp.com",
      passwordHash,
      name: "Priya Nair",
      role: "INDUSTRY",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      industryProfile: {
        create: {
          companyName: "Microsoft India / TechCorp",
          companyWebsite: "https://techcorp.example.com",
          designation: "Principal Campus Recruiter",
          domain: "Cloud & Enterprise Software",
          isVerified: true,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "faculty@university.edu" },
    update: {},
    create: {
      email: "faculty@university.edu",
      passwordHash,
      name: "Dr. Ramesh Verma",
      role: "FACULTY",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      facultyProfile: {
        create: {
          institutionName: "National Institute of Technology (NIT)",
          department: "Computer Science & Engineering",
          designation: "Associate Professor & Industry Liaison",
          specialization: "Distributed Systems, Cloud & AI",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@nit-campus.edu" },
    update: {},
    create: {
      email: "admin@nit-campus.edu",
      passwordHash,
      name: "Prof. S. Meenakshi",
      role: "INSTITUTION",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      institutionProfile: {
        create: {
          institutionName: "National Institute of Technology (NIT)",
          institutionType: "Tier-1 Institute (IIT/NIT/IIIT)",
          officialEmail: "admin@nit-campus.edu",
          website: "https://nit.ac.in",
          city: "Tiruchirappalli",
          state: "Tamil Nadu",
          code: "NIT-01",
          nirfRank: 9,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@sih-platform.gov.in" },
    update: {},
    create: {
      email: "admin@sih-platform.gov.in",
      passwordHash,
      name: "National Platform Admin",
      role: "ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    },
  });

  // 7. Phase 4 Target Career Roles
  console.log("🎯 Seeding Phase 4 Master Target Roles & Industry Competency Vectors...");

  const targetRolesData = [
    {
      title: "Full-Stack AI Solutions Architect",
      slug: "fullstack-ai-architect",
      category: "Software & AI",
      description: "Architect end-to-end intelligent systems integrating modern React/Next.js client portals, async Python microservices, vector search engines, and resilient relational datastores.",
      avgSalaryRange: "₹24 - ₹38 LPA",
      industryDemandLevel: "CRITICAL",
      icon: "Sparkles",
      requiredSkills: [
        { name: "React.js & Next.js", minBenchmark: 85, weight: 5, isMandatory: true, category: "Frameworks" },
        { name: "Python & Fast-API", minBenchmark: 80, weight: 5, isMandatory: true, category: "Languages" },
        { name: "PostgreSQL & Prisma ORM", minBenchmark: 75, weight: 4, isMandatory: true, category: "Databases" },
        { name: "Docker & Containerization", minBenchmark: 80, weight: 4, isMandatory: false, category: "Cloud & DevOps" },
        { name: "Machine Learning & PyTorch", minBenchmark: 75, weight: 3, isMandatory: false, category: "AI / ML" },
        { name: "Redis & Distributed Caching", minBenchmark: 70, weight: 3, isMandatory: false, category: "Databases" },
        { name: "Data Structures & Algorithms", minBenchmark: 85, weight: 4, isMandatory: true, category: "Core Engineering" },
      ],
    },
    {
      title: "Cloud DevOps & Platform Engineer",
      slug: "cloud-devops-engineer",
      category: "Cloud & DevOps",
      description: "Build robust CI/CD deployment pipelines, container orchestration meshes, multi-region Kubernetes clusters, and automated infrastructure as code (IaC).",
      avgSalaryRange: "₹20 - ₹34 LPA",
      industryDemandLevel: "VERY HIGH",
      icon: "Cloud",
      requiredSkills: [
        { name: "Docker & Containerization", minBenchmark: 85, weight: 5, isMandatory: true, category: "Cloud & DevOps" },
        { name: "Kubernetes & Cloud Infra", minBenchmark: 80, weight: 5, isMandatory: true, category: "Cloud & DevOps" },
        { name: "Python & Fast-API", minBenchmark: 75, weight: 4, isMandatory: false, category: "Languages" },
        { name: "PostgreSQL & Prisma ORM", minBenchmark: 70, weight: 3, isMandatory: false, category: "Databases" },
        { name: "Redis & Distributed Caching", minBenchmark: 75, weight: 3, isMandatory: false, category: "Databases" },
        { name: "Data Structures & Algorithms", minBenchmark: 75, weight: 3, isMandatory: false, category: "Core Engineering" },
      ],
    },
    {
      title: "Data Scientist & ML Specialist",
      slug: "data-scientist-ml-specialist",
      category: "Data & ML",
      description: "Train and evaluate deep learning representations, implement vector retrieval pipelines, fine-tune transformer models, and optimize high-throughput inferencing.",
      avgSalaryRange: "₹22 - ₹36 LPA",
      industryDemandLevel: "VERY HIGH",
      icon: "Brain",
      requiredSkills: [
        { name: "Machine Learning & PyTorch", minBenchmark: 85, weight: 5, isMandatory: true, category: "AI / ML" },
        { name: "Python & Fast-API", minBenchmark: 85, weight: 5, isMandatory: true, category: "Languages" },
        { name: "PostgreSQL & Prisma ORM", minBenchmark: 75, weight: 3, isMandatory: false, category: "Databases" },
        { name: "Data Structures & Algorithms", minBenchmark: 80, weight: 4, isMandatory: true, category: "Core Engineering" },
        { name: "Docker & Containerization", minBenchmark: 70, weight: 3, isMandatory: false, category: "Cloud & DevOps" },
      ],
    },
    {
      title: "Distributed Backend Systems Engineer",
      slug: "distributed-backend-engineer",
      category: "Systems & Security",
      description: "Design fault-tolerant distributed services, high-concurrency event streams, transaction isolation levels, and ultra-low latency caching layers.",
      avgSalaryRange: "₹22 - ₹40 LPA",
      industryDemandLevel: "CRITICAL",
      icon: "Cpu",
      requiredSkills: [
        { name: "Python & Fast-API", minBenchmark: 85, weight: 5, isMandatory: true, category: "Languages" },
        { name: "PostgreSQL & Prisma ORM", minBenchmark: 85, weight: 5, isMandatory: true, category: "Databases" },
        { name: "Redis & Distributed Caching", minBenchmark: 80, weight: 4, isMandatory: true, category: "Databases" },
        { name: "Data Structures & Algorithms", minBenchmark: 90, weight: 5, isMandatory: true, category: "Core Engineering" },
        { name: "Docker & Containerization", minBenchmark: 80, weight: 4, isMandatory: false, category: "Cloud & DevOps" },
        { name: "Kubernetes & Cloud Infra", minBenchmark: 70, weight: 3, isMandatory: false, category: "Cloud & DevOps" },
      ],
    },
  ];

  const seededRoles = {};
  for (const tr of targetRolesData) {
    const record = await prisma.targetRole.upsert({
      where: { title: tr.title },
      update: {
        slug: tr.slug,
        category: tr.category,
        description: tr.description,
        avgSalaryRange: tr.avgSalaryRange,
        industryDemandLevel: tr.industryDemandLevel,
        icon: tr.icon,
        requiredSkillsJson: JSON.stringify(tr.requiredSkills),
      },
      create: {
        title: tr.title,
        slug: tr.slug,
        category: tr.category,
        description: tr.description,
        avgSalaryRange: tr.avgSalaryRange,
        industryDemandLevel: tr.industryDemandLevel,
        icon: tr.icon,
        requiredSkillsJson: JSON.stringify(tr.requiredSkills),
      },
    });
    seededRoles[tr.title] = record;
  }

  // 8. Seed Default Active Learning Roadmap for Student Aarav Sharma
  const defaultRole = seededRoles["Full-Stack AI Solutions Architect"];
  
  const studentRoadmap = await prisma.learningRoadmap.upsert({
    where: {
      studentProfileId_roleTitle: {
        studentProfileId: studentProfile.id,
        roleTitle: defaultRole.title,
      },
    },
    update: {
      targetRoleId: defaultRole.id,
      roleCategory: defaultRole.category,
      overallFitScore: 89.0,
      cosineSimilarity: 0.948,
      gapSummary: "Vector Cosine Match: 94.8% (89% Overall Target Fit). Strong foundations demonstrated in React.js & Next.js, Python & Fast-API, Data Structures & Algorithms. Priority attention required in Docker & Containerization and Machine Learning & PyTorch to reach Tier-1 recruiter shortlisting thresholds.",
      estimatedWeeks: 4,
      estimatedHours: 36,
      progressPercent: 50.0,
      status: "ACTIVE",
    },
    create: {
      studentProfileId: studentProfile.id,
      targetRoleId: defaultRole.id,
      roleTitle: defaultRole.title,
      roleCategory: defaultRole.category,
      overallFitScore: 89.0,
      cosineSimilarity: 0.948,
      gapSummary: "Vector Cosine Match: 94.8% (89% Overall Target Fit). Strong foundations demonstrated in React.js & Next.js, Python & Fast-API, Data Structures & Algorithms. Priority attention required in Docker & Containerization and Machine Learning & PyTorch to reach Tier-1 recruiter shortlisting thresholds.",
      estimatedWeeks: 4,
      estimatedHours: 36,
      progressPercent: 50.0,
      status: "ACTIVE",
    },
  });

  // Clear existing milestones and insert curated milestones
  await prisma.roadmapMilestone.deleteMany({
    where: { roadmapId: studentRoadmap.id },
  });

  const milestonesToSeed = [
    {
      stepNumber: 1,
      title: "Master Multi-Stage Docker Builds & Microservices Containerization",
      description: "Learn how to optimize production container images under 100MB with Alpine Linux, layer caching, and multi-stage pipelines.",
      skillName: "Docker & Containerization",
      gapDelta: -15.0,
      resourceType: "VIDEO",
      resourceUrl: "https://www.youtube.com/watch?v=gAkwW2tuIqE",
      provider: "freeCodeCamp / Docker Docs",
      estimatedHours: 8,
      isCompleted: true,
      completedAt: new Date(),
    },
    {
      stepNumber: 2,
      title: "Hands-on Project: Multi-Container Microservice Stack with Docker Compose",
      description: "Containerize a Next.js frontend, Python FastAPI backend, Redis cache, and PostgreSQL database with health checks and volume persistence.",
      skillName: "Docker & Containerization",
      gapDelta: -15.0,
      resourceType: "PROJECT",
      resourceUrl: "https://github.com/docker/awesome-compose",
      provider: "GitHub Labs",
      estimatedHours: 12,
      isCompleted: true,
      completedAt: new Date(),
    },
    {
      stepNumber: 3,
      title: "PyTorch Deep Learning & Tensor Operations Mastery",
      description: "Implement custom neural network architectures, backpropagation, and loss optimizers from scratch.",
      skillName: "Machine Learning & PyTorch",
      gapDelta: -15.0,
      resourceType: "COURSE",
      resourceUrl: "https://pytorch.org/tutorials/beginner/basics/intro.html",
      provider: "PyTorch Official",
      estimatedHours: 10,
      isCompleted: false,
    },
    {
      stepNumber: 4,
      title: "Capstone Milestone: Production-Grade Full-Stack AI Solutions Architect Showcase Project",
      description: "Integrate all verified competencies into a deployed, high-availability architecture with comprehensive CI/CD, documentation, and performance benchmarks.",
      skillName: "System Design & Architecture",
      gapDelta: 0,
      resourceType: "CERTIFICATION",
      resourceUrl: "https://github.com/trending",
      provider: "NEP 2020 OBE Capstone Evaluation",
      estimatedHours: 12,
      isCompleted: false,
    },
  ];

  for (const m of milestonesToSeed) {
    await prisma.roadmapMilestone.create({
      data: {
        roadmapId: studentRoadmap.id,
        ...m,
      },
    });
  }

  // 9. Phase 5 Corporate Job Drives & Vector ATS Pipelines
  console.log("💼 Seeding Phase 5 Corporate Job Drives & ATS Applications...");

  // Find recruiter industry profile
  const recruiterUser = await prisma.user.findUnique({
    where: { email: "recruiter@techcorp.com" },
    include: { industryProfile: true },
  });

  const industryProfileId = recruiterUser.industryProfile.id;

  const jobPostingsData = [
    {
      industryProfileId,
      title: "Graduate Software Engineer - Cloud & Distributed AI",
      description: "Join the Azure Cloud platform team building next-generation AI infrastructure, distributed microservices, and high-throughput vector search APIs.",
      jobType: "INTERNSHIP",
      location: "Bengaluru / Hybrid",
      stipendSalary: "₹1,25,000/mo",
      minCgpa: 8.0,
      deadline: new Date("2026-10-30"),
      status: "OPEN",
      requiredSkills: [
        { name: "React.js & Next.js", weight: 5, minBenchmark: 85, isMandatory: true },
        { name: "Python & Fast-API", weight: 5, minBenchmark: 80, isMandatory: true },
        { name: "PostgreSQL & Prisma ORM", weight: 4, minBenchmark: 75, isMandatory: true },
        { name: "Docker & Containerization", weight: 4, minBenchmark: 75, isMandatory: false },
        { name: "Data Structures & Algorithms", weight: 4, minBenchmark: 80, isMandatory: true },
      ],
    },
    {
      industryProfileId,
      title: "Full-Stack Payment Systems Engineer",
      description: "Work on mission-critical payment gateway systems handling millions of daily transactions with ultra-low latency and strict ACID consistency.",
      jobType: "FULL_TIME",
      location: "Bengaluru / Remote",
      stipendSalary: "₹24,00,000/yr",
      minCgpa: 7.5,
      deadline: new Date("2026-11-15"),
      status: "OPEN",
      requiredSkills: [
        { name: "React.js & Next.js", weight: 5, minBenchmark: 80, isMandatory: true },
        { name: "TypeScript", weight: 4, minBenchmark: 75, isMandatory: true },
        { name: "PostgreSQL & Prisma ORM", weight: 5, minBenchmark: 80, isMandatory: true },
        { name: "Redis & Distributed Caching", weight: 4, minBenchmark: 75, isMandatory: false },
        { name: "Data Structures & Algorithms", weight: 4, minBenchmark: 80, isMandatory: true },
      ],
    },
    {
      industryProfileId,
      title: "AI/ML Systems & Computer Vision Intern",
      description: "Design edge AI models and tensor acceleration pipelines for automotive and smart industrial telemetry diagnostics.",
      jobType: "INTERNSHIP",
      location: "Pune / On-Site",
      stipendSalary: "₹45,000/mo",
      minCgpa: 7.0,
      deadline: new Date("2026-10-15"),
      status: "OPEN",
      requiredSkills: [
        { name: "Python & Fast-API", weight: 5, minBenchmark: 80, isMandatory: true },
        { name: "Machine Learning & PyTorch", weight: 5, minBenchmark: 80, isMandatory: true },
        { name: "Docker & Containerization", weight: 3, minBenchmark: 70, isMandatory: false },
      ],
    },
  ];

  const seededJobs = [];
  for (const jd of jobPostingsData) {
    const existingJob = await prisma.jobPosting.findFirst({
      where: {
        industryProfileId: jd.industryProfileId,
        title: jd.title,
      },
    });

    let jobRecord;
    if (existingJob) {
      jobRecord = await prisma.jobPosting.update({
        where: { id: existingJob.id },
        data: {
          description: jd.description,
          jobType: jd.jobType,
          location: jd.location,
          stipendSalary: jd.stipendSalary,
          minCgpa: jd.minCgpa,
          deadline: jd.deadline,
          status: jd.status,
          requiredSkillsJson: JSON.stringify(jd.requiredSkills),
        },
      });
    } else {
      jobRecord = await prisma.jobPosting.create({
        data: {
          industryProfileId: jd.industryProfileId,
          title: jd.title,
          description: jd.description,
          jobType: jd.jobType,
          location: jd.location,
          stipendSalary: jd.stipendSalary,
          minCgpa: jd.minCgpa,
          deadline: jd.deadline,
          status: jd.status,
          requiredSkillsJson: JSON.stringify(jd.requiredSkills),
        },
      });
    }
    seededJobs.push(jobRecord);
  }

  // Seed demo candidate application for student Aarav Sharma
  const firstJob = seededJobs[0];
  await prisma.jobApplication.upsert({
    where: {
      jobPostingId_studentProfileId: {
        jobPostingId: firstJob.id,
        studentProfileId: studentProfile.id,
      },
    },
    update: {
      status: "SHORTLISTED",
      vectorMatchScore: 94.0,
      matchScore: 94.0,
    },
    create: {
      jobPostingId: firstJob.id,
      studentProfileId: studentProfile.id,
      status: "SHORTLISTED",
      vectorMatchScore: 94.0,
      matchScore: 94.0,
    },
  });

  // 10. Phase 6 Faculty Mentorship Slots & Endorsements
  console.log("🏅 Seeding Phase 6 Faculty Mentorship Slots & Endorsements...");

  const facultyUser = await prisma.user.findUnique({
    where: { email: "faculty@university.edu" },
    include: { facultyProfile: true },
  });

  const facultyProfileId = facultyUser.facultyProfile.id;

  // Clear existing slots & bookings for clean seed
  await prisma.mentorshipBooking.deleteMany({});
  await prisma.mentorshipSlot.deleteMany({});
  await prisma.facultyEndorsement.deleteMany({});

  const slot1 = await prisma.mentorshipSlot.create({
    data: {
      facultyProfileId,
      title: "1:1 AI Architecture & Capstone Guidance",
      topic: "Capstone Project Evaluation & Distributed Vector Indexing",
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      durationMinutes: 30,
      meetingUrl: "https://meet.google.com/bridgenext-guidance-01",
      status: "BOOKED",
    },
  });

  const slot2 = await prisma.mentorshipSlot.create({
    data: {
      facultyProfileId,
      title: "Outcome-Based Competency & Career Review",
      topic: "Bridging Cloud DevOps Gap & Interview Readiness",
      scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
      durationMinutes: 45,
      meetingUrl: "https://meet.google.com/bridgenext-guidance-02",
      status: "AVAILABLE",
    },
  });

  const slot3 = await prisma.mentorshipSlot.create({
    data: {
      facultyProfileId,
      title: "Industry Alignment & NEP 2020 OBE Mentorship",
      topic: "Advanced PostgreSQL & Query Optimization Rubrics",
      scheduledAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
      durationMinutes: 30,
      meetingUrl: "https://meet.google.com/bridgenext-guidance-03",
      status: "AVAILABLE",
    },
  });

  // Seed booking for student Aarav Sharma on Slot 1
  await prisma.mentorshipBooking.create({
    data: {
      slotId: slot1.id,
      studentProfileId: studentProfile.id,
      notes: "Seeking faculty guidance on my Full-Stack AI Solutions Capstone and Docker containerization benchmarks.",
      status: "CONFIRMED",
    },
  });

  // Seed Faculty Endorsement on student's Data Structures skill
  const dsaSkill = await prisma.skill.findUnique({
    where: { name: "Data Structures & Algorithms" },
  });

  if (dsaSkill) {
    const studentSkillRecord = await prisma.studentSkill.findUnique({
      where: {
        studentProfileId_skillId: {
          studentProfileId: studentProfile.id,
          skillId: dsaSkill.id,
        },
      },
    });

    if (studentSkillRecord) {
      await prisma.studentSkill.update({
        where: { id: studentSkillRecord.id },
        data: {
          verificationStatus: "FACULTY_ENDORSED",
          verifiedScore: 92.0,
          badgeEarned: "DSA Faculty Endorsed Master",
          verifiedAt: new Date(),
        },
      });

      await prisma.facultyEndorsement.create({
        data: {
          facultyProfileId,
          studentSkillId: studentSkillRecord.id,
          endorsedScore: 92.0,
          feedback: "Demonstrated exceptional problem-solving in advanced graph algorithms and dynamic programming lab tests.",
        },
      });
    }
  }

  console.log("✅ Phase 6 Faculty Mentorship & Endorsements Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



