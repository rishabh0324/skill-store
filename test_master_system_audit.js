/**
 * test_master_system_audit.js
 * Comprehensive Master System Audit & Complete End-to-End Integration Suite
 * Smart India Hackathon 2026 - Problem Statement 44: bridgeNext ai
 */

const http = require("http");

const BASE_URL = "http://localhost:3000";

function makeRequest({ path, method = "GET", headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = { ...headers };
    let requestBody = null;

    if (body) {
      requestBody = typeof body === "string" ? body : JSON.stringify(body);
      reqHeaders["Content-Type"] = "application/json";
      reqHeaders["Content-Length"] = Buffer.byteLength(requestBody);
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: reqHeaders,
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }

        const setCookie = res.headers["set-cookie"];
        let cookie = null;
        if (setCookie) {
          cookie = setCookie.map((c) => c.split(";")[0]).join("; ");
        }

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          cookie,
          json,
        });
      });
    });

    req.on("error", reject);
    if (requestBody) req.write(requestBody);
    req.end();
  });
}

async function runMasterAudit() {
  console.log("================================================================================");
  console.log("🔍 bridgeNext ai — MASTER SYSTEM INTEGRATION & QUALITY AUDIT (SIH 2026 PS-44)");
  console.log("================================================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = "") {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details ? `(${details})` : ""}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // SECTION 1: AUTHENTICATION & SECURITY AUDIT
    // -------------------------------------------------------------------------
    console.log("\n[1/6] 🔐 AUDITING AUTHENTICATION, RBAC & SESSION SECURITY...");

    // 1.1 Student Login
    const studentLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "student@sih.edu", password: "Password@123" },
    });
    assert(
      studentLogin.statusCode === 200 && studentLogin.json.data.token,
      "Student Credential Authentication & JWT Issuance"
    );
    const studentToken = studentLogin.json.data.token;
    const studentAuth = { Authorization: `Bearer ${studentToken}` };

    // 1.2 Invalid Password Rejection
    const badLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "student@sih.edu", password: "WrongPassword" },
    });
    assert(badLogin.statusCode === 401, "Invalid Password Rejection (401 Unauthorized)");

    // 1.3 Recruiter Login
    const recruiterLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "recruiter@techcorp.com", password: "Password@123" },
    });
    assert(
      recruiterLogin.statusCode === 200 && recruiterLogin.json.data.user.role === "INDUSTRY",
      "Industry Recruiter Authentication & Profile Resolution"
    );
    const recruiterToken = recruiterLogin.json.data.token;
    const recruiterAuth = { Authorization: `Bearer ${recruiterToken}` };

    // 1.4 Faculty Login
    const facultyLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "faculty@university.edu", password: "Password@123" },
    });
    assert(
      facultyLogin.statusCode === 200 && facultyLogin.json.data.user.role === "FACULTY",
      "Faculty Mentor Authentication & Department Resolution"
    );
    const facultyToken = facultyLogin.json.data.token;
    const facultyAuth = { Authorization: `Bearer ${facultyToken}` };

    // 1.5 Institution Login
    const instLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "admin@nit-campus.edu", password: "Password@123" },
    });
    assert(
      instLogin.statusCode === 200 && instLogin.json.data.user.role === "INSTITUTION",
      "Institution TPO Admin Authentication"
    );
    const instToken = instLogin.json.data.token;
    const instAuth = { Authorization: `Bearer ${instToken}` };

    // 1.6 System Admin Login
    const adminLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "admin@sih-platform.gov.in", password: "Password@123" },
    });
    assert(
      adminLogin.statusCode === 200 && adminLogin.json.data.user.role === "ADMIN",
      "Platform Root System Admin Authentication"
    );
    const adminToken = adminLogin.json.data.token;
    const adminAuth = { Authorization: `Bearer ${adminToken}` };

    // 1.7 RBAC Security Guard: Student Blocked from Admin Telemetry
    const unauthAdminCheck = await makeRequest({
      path: "/api/v1/admin/stats",
      method: "GET",
      headers: studentAuth,
    });
    assert(
      unauthAdminCheck.statusCode === 401,
      "RBAC Authorization Shield: Student Forbidden from Admin APIs"
    );

    // -------------------------------------------------------------------------
    // SECTION 2: STUDENT COMPETENCY, PROCTORED ASSESSMENTS & OBE
    // -------------------------------------------------------------------------
    console.log("\n[2/6] 📊 AUDITING STUDENT SKILL MATRIX & PROCTORED TEST ENGINE...");

    // 2.1 Fetch Master Skills Directory
    const skillsRes = await makeRequest({
      path: "/api/v1/skills",
      method: "GET",
      headers: studentAuth,
    });
    assert(
      skillsRes.statusCode === 200 && Array.isArray(skillsRes.json.data) && skillsRes.json.data.length >= 6,
      "Master Competency Directory Query"
    );

    // 2.2 Self-Report a Skill
    const addSkillRes = await makeRequest({
      path: "/api/v1/skills",
      method: "POST",
      headers: studentAuth,
      body: {
        name: "GraphQL & Schema Stitching",
        category: "Frameworks",
        selfScore: 80,
      },
    });
    assert(
      addSkillRes.statusCode === 201 && addSkillRes.json.data.name.includes("GraphQL"),
      "Self-Report New Technical Competency"
    );

    // 2.3 Fetch Available Assessments
    const testsRes = await makeRequest({
      path: "/api/v1/assessments",
      method: "GET",
      headers: studentAuth,
    });
    assert(
      testsRes.statusCode === 200 && Array.isArray(testsRes.json.data) && testsRes.json.data.length >= 3,
      "Available Proctored Test Catalog"
    );

    // 2.4 Fetch Sanitized Question Bank
    const targetTest = testsRes.json.data[0];
    const testQuestionsRes = await makeRequest({
      path: `/api/v1/assessments/${targetTest.id}`,
      method: "GET",
      headers: studentAuth,
    });
    assert(
      testQuestionsRes.statusCode === 200 &&
        Array.isArray(testQuestionsRes.json.data.questions) &&
        testQuestionsRes.json.data.questions.length > 0 &&
        !testQuestionsRes.json.data.questions[0].correctOptionIndex,
      "Sanitized Question Bank Delivery (Zero Answer Leakage)"
    );

    // -------------------------------------------------------------------------
    // SECTION 3: AI SKILL-GAP ENGINE & 4-WEEK ROADMAPS
    // -------------------------------------------------------------------------
    console.log("\n[3/6] 🧠 AUDITING AI SKILL-GAP & LEARNING ROADMAP ENGINE...");

    // 3.1 Fetch Master Target Career Roles
    const targetsRes = await makeRequest({
      path: "/api/v1/roadmaps/targets",
      method: "GET",
      headers: studentAuth,
    });
    assert(
      targetsRes.statusCode === 200 && Array.isArray(targetsRes.json.data) && targetsRes.json.data.length >= 4,
      "Master Target Roles Directory"
    );

    const firstRole = targetsRes.json.data[0];

    // 3.2 Generate / Compute Gap Analysis & Roadmap
    const genRoadmapRes = await makeRequest({
      path: "/api/v1/roadmaps",
      method: "POST",
      headers: studentAuth,
      body: { targetRoleId: firstRole.id },
    });
    assert(
      genRoadmapRes.statusCode === 200 &&
        genRoadmapRes.json.data.roadmap &&
        genRoadmapRes.json.data.roadmap.overallFitScore >= 50 &&
        genRoadmapRes.json.data.roadmap.cosineSimilarity > 0,
      "Cosine Similarity Gap Calculation & Roadmap Synthesis"
    );

    const activeRoadmap = genRoadmapRes.json.data.roadmap;

    // 3.3 Toggle Milestone Step Completion
    if (activeRoadmap.steps && activeRoadmap.steps.length > 0) {
      const stepToToggle = activeRoadmap.steps[0];
      const toggleRes = await makeRequest({
        path: `/api/v1/roadmaps/steps/${stepToToggle.id}`,
        method: "PATCH",
        headers: studentAuth,
        body: { isCompleted: true },
      });
      assert(
        toggleRes.statusCode === 200 && toggleRes.json.data.milestone.isCompleted === true,
        "Dynamic Roadmap Milestone Step Progression"
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 4: RECRUITER JOB DRIVES, VECTOR ATS & CANDIDATE MATCHING
    // -------------------------------------------------------------------------
    console.log("\n[4/6] 💼 AUDITING RECRUITER ATS & VECTOR CANDIDATE MATCHER...");

    // 4.1 Post a New Corporate Job Drive
    const newJobRes = await makeRequest({
      path: "/api/v1/jobs",
      method: "POST",
      headers: recruiterAuth,
      body: {
        title: "Senior AI Platform & Distributed Systems Engineer",
        description: "Develop enterprise-scale generative AI pipelines and vector indexing clusters.",
        jobType: "FULL_TIME",
        location: "Bengaluru / Remote",
        stipendSalary: "₹28,00,000/yr",
        minCgpa: 8.0,
        requiredSkills: [
          { name: "React.js & Next.js", weight: 5, minBenchmark: 85, isMandatory: true },
          { name: "Python & Fast-API", weight: 5, minBenchmark: 85, isMandatory: true },
          { name: "PostgreSQL & Prisma ORM", weight: 4, minBenchmark: 80, isMandatory: true },
        ],
      },
    });
    assert(
      newJobRes.statusCode === 201 && newJobRes.json.data.job.title.includes("Senior AI Platform"),
      "Skill-Weighted Corporate Job Drive Creation"
    );
    const createdJobId = newJobRes.json.data.job.id;

    // 4.2 Student Views Matched Jobs with Vector Score
    const studentJobsRes = await makeRequest({
      path: "/api/v1/jobs",
      method: "GET",
      headers: studentAuth,
    });
    assert(
      studentJobsRes.statusCode === 200 &&
        Array.isArray(studentJobsRes.json.data.jobs) &&
        studentJobsRes.json.data.jobs[0].vectorMatchScore !== undefined,
      "Explainable Vector Match Score Computation for Student"
    );

    // 4.3 Student Applies to Corporate Opening
    const applyRes = await makeRequest({
      path: "/api/v1/applications",
      method: "POST",
      headers: studentAuth,
      body: { jobId: createdJobId },
    });
    assert(
      applyRes.statusCode === 201 && applyRes.json.data.application.status === "APPLIED",
      "Student Job Application Submission & ATS Registration"
    );
    const applicationId = applyRes.json.data.application.id;

    // 4.4 Recruiter Views Applicant Pipeline
    const applicantsRes = await makeRequest({
      path: `/api/v1/applications?jobId=${createdJobId}`,
      method: "GET",
      headers: recruiterAuth,
    });
    assert(
      applicantsRes.statusCode === 200 &&
        Array.isArray(applicantsRes.json.data.candidates) &&
        applicantsRes.json.data.candidates.length > 0,
      "Recruiter ATS Pipeline Candidate Retrieval"
    );

    // 4.5 Recruiter Advances Candidate Status (Shortlist)
    const advanceRes = await makeRequest({
      path: "/api/v1/applications",
      method: "PATCH",
      headers: recruiterAuth,
      body: {
        applicationId,
        candidateId: applicationId,
        status: "SHORTLISTED",
      },
    });
    assert(
      advanceRes.statusCode === 200 && advanceRes.json.data.application.status === "SHORTLISTED",
      "Recruiter ATS Status Advancement (APPLIED -> SHORTLISTED)"
    );

    // -------------------------------------------------------------------------
    // SECTION 5: FACULTY MENTORSHIP & INSTITUTIONAL ANALYTICS
    // -------------------------------------------------------------------------
    console.log("\n[5/6] 🏛️ AUDITING FACULTY MENTORSHIP & TPO ACCREDITATION...");

    // 5.1 Faculty Creates Guidance Slot
    const createSlotRes = await makeRequest({
      path: "/api/v1/mentorship",
      method: "POST",
      headers: facultyAuth,
      body: {
        title: "1:1 AI Capstone & Vector Search Guidance",
        topic: "Distributed Systems Architecture",
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: 30,
        meetingUrl: "https://meet.google.com/bridgenext-test-guidance",
      },
    });
    assert(
      createSlotRes.statusCode === 201 && createSlotRes.json.data.slot.id,
      "Faculty Guidance Slot Generation"
    );
    const slotId = createSlotRes.json.data.slot.id;

    // 5.2 Student Books Guidance Slot
    const bookSlotRes = await makeRequest({
      path: "/api/v1/mentorship",
      method: "POST",
      headers: studentAuth,
      body: {
        slotId,
        notes: "Requesting review of my Full-Stack AI solutions portfolio.",
      },
    });
    assert(
      bookSlotRes.statusCode === 200 && bookSlotRes.json.data.booking.status === "CONFIRMED",
      "Student 1:1 Mentorship Session Booking"
    );

    // 5.3 Faculty Endorses Student Skill
    const endorsementRes = await makeRequest({
      path: "/api/v1/endorsements",
      method: "POST",
      headers: facultyAuth,
      body: {
        studentSkillId: skillsRes.json.data[0].id,
        endorsedScore: 95.0,
        feedback: "Exceptional mastery in full-stack architecture demonstrated during lab review.",
      },
    });
    assert(
      endorsementRes.statusCode === 200 && endorsementRes.json.data.endorsement,
      "Faculty Competency Endorsement & Feedback Logging"
    );

    // 5.4 Institution Fetches TPO Analytics & Placement Telemetry
    const analyticsRes = await makeRequest({
      path: "/api/v1/analytics",
      method: "GET",
      headers: instAuth,
    });
    assert(
      analyticsRes.statusCode === 200 &&
        analyticsRes.json.data.analytics.departmentReadiness.length > 0 &&
        analyticsRes.json.data.analytics.demandVsSupply.length > 0,
      "Institution TPO Real-Time Placement Analytics & Demand/Supply"
    );

    // 5.5 Institution Exports NAAC / NIRF Accreditation Data
    const accredRes = await makeRequest({
      path: "/api/v1/analytics/accreditation",
      method: "GET",
      headers: instAuth,
    });
    assert(
      accredRes.statusCode === 200 &&
        accredRes.json.data.accreditation.criteriaMetrics.length > 0,
      "NAAC Criterion 5 & NIRF Placement Compliance Export Telemetry"
    );

    // -------------------------------------------------------------------------
    // SECTION 6: SYSTEM ADMIN TELEMETRY & PUBLIC PORTFOLIO
    // -------------------------------------------------------------------------
    console.log("\n[6/6] 🌐 AUDITING SYSTEM ADMIN TELEMETRY & PUBLIC OBE PORTFOLIO...");

    // 6.1 Admin Live Telemetry
    const adminStatsRes = await makeRequest({
      path: "/api/v1/admin/stats",
      method: "GET",
      headers: adminAuth,
    });
    assert(
      adminStatsRes.statusCode === 200 &&
        adminStatsRes.json.data.metrics.totalUsers > 0 &&
        adminStatsRes.json.data.metrics.databaseEngine.includes("SQLite"),
      "System Admin Master Audit Telemetry & Live Stakeholder Stats"
    );

    // 6.2 Public Verified Portfolio Resolution (/api/v1/portfolio/aarav-sharma)
    const portfolioRes = await makeRequest({
      path: "/api/v1/portfolio/aarav-sharma",
      method: "GET",
    });
    assert(
      portfolioRes.statusCode === 200 &&
        portfolioRes.json.data.user.name === "Aarav Sharma" &&
        portfolioRes.json.data.verifiedBadges.length > 0 &&
        portfolioRes.json.data.accreditationProof.nep2020Compliant === true,
      "Public Verified OBE Portfolio Verification (/api/v1/portfolio/aarav-sharma)"
    );

  } catch (err) {
    console.error("Critical error during master system audit:", err);
    failed++;
  }

  console.log("\n================================================================================");
  console.log(`📊 MASTER SYSTEM AUDIT COMPLETE: ${passed} Passed, ${failed} Failed`);
  console.log("================================================================================");

  if (failed > 0) process.exit(1);
}

runMasterAudit();
