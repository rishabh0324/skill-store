/**
 * test_real_onboarding_audit.js
 * End-to-End Real Registration & Role-Specific Onboarding Test Suite
 * SIH 2026 Problem Statement 44 - bridgeNext ai / Skill Store
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

async function runRealOnboardingAudit() {
  console.log("================================================================================");
  console.log("🚀 BRIDGENEXT AI — REAL REGISTRATION & MULTI-ROLE ONBOARDING AUDIT");
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

  const timestamp = Date.now();

  try {
    // -------------------------------------------------------------------------
    // TEST 1: REAL STUDENT REGISTRATION & MULTI-STEP ONBOARDING
    // -------------------------------------------------------------------------
    console.log("\n[1/6] 🎓 TEST 1: NEW STUDENT REGISTRATION & ONBOARDING...");
    const studentEmail = `student_${timestamp}@nit.ac.in`;

    // 1.1 Register New Student Account
    const regStudent = await makeRequest({
      path: "/api/v1/auth/register",
      method: "POST",
      body: {
        name: "Devika Raman",
        email: studentEmail,
        phone: "+91 98765 11223",
        password: "Password@123",
        confirmPassword: "Password@123",
        role: "STUDENT",
      },
    });
    assert(
      regStudent.statusCode === 201 &&
        regStudent.json.data.user.role === "STUDENT" &&
        regStudent.json.data.user.isOnboarded === false &&
        regStudent.cookie &&
        regStudent.cookie.includes("sih_token="),
      "1.1 New Student Real Account Creation (isOnboarded: false)"
    );
    const studentCookie = regStudent.cookie;
    const studentAuth = { Cookie: studentCookie, Authorization: `Bearer ${regStudent.json.data.token}` };

    // 1.2 Submit Multi-Step Onboarding Data
    const onboardStudent = await makeRequest({
      path: "/api/v1/auth/onboarding",
      method: "POST",
      headers: studentAuth,
      body: {
        collegeName: "NIT Tiruchirappalli",
        university: "National Technical University",
        degree: "B.Tech",
        department: "AI & Data Science",
        currentYear: 3,
        currentSemester: 6,
        graduationYear: 2026,
        cgpa: 9.15,
        rollNo: "2022-AIDS-019",
        bio: "Specializing in vector search engines, distributed ML systems and full-stack web applications.",
        skills: [
          { name: "Python", category: "Languages", selfScore: 90 },
          { name: "TypeScript", category: "Languages", selfScore: 85 },
          { name: "React.js", category: "Frameworks", selfScore: 88 },
          { name: "PostgreSQL", category: "Databases", selfScore: 80 },
        ],
        softSkills: "Technical Leadership, Public Speaking, Agile Scrum",
        targetJobRole: "Full-Stack AI Solutions Architect",
        preferredLocation: "Bengaluru / Hyderabad / Remote",
        preferredIndustry: "Enterprise AI & Cloud Infrastructure",
      },
    });
    assert(
      onboardStudent.statusCode === 200 &&
        onboardStudent.json.data.user.isOnboarded === true &&
        onboardStudent.json.data.user.studentProfile.department === "AI & Data Science" &&
        onboardStudent.json.data.user.studentProfile.cgpa === 9.15,
      "1.2 Student Multi-Step Onboarding Saved (isOnboarded: true, Real DB Persistence)"
    );

    // 1.3 Verify Session Refresh & Profile Persistence
    const studentSession = await makeRequest({
      path: "/api/v1/auth/me",
      method: "GET",
      headers: { Cookie: onboardStudent.cookie || studentCookie },
    });
    assert(
      studentSession.statusCode === 200 &&
        studentSession.json.data.user.isOnboarded === true &&
        studentSession.json.data.user.studentProfile.collegeName === "NIT Tiruchirappalli" &&
        studentSession.json.data.user.studentProfile.skills.length >= 4,
      "1.3 Student Session Rehydration with Real Skills & Academic Telemetry"
    );

    // -------------------------------------------------------------------------
    // TEST 2: REAL INDUSTRY RECRUITER REGISTRATION & ONBOARDING
    // -------------------------------------------------------------------------
    console.log("\n[2/6] 💼 TEST 2: NEW INDUSTRY RECRUITER REGISTRATION & ONBOARDING...");
    const industryEmail = `recruiter_${timestamp}@innovate-ai.com`;

    // 2.1 Register New Recruiter
    const regIndustry = await makeRequest({
      path: "/api/v1/auth/register",
      method: "POST",
      body: {
        name: "Vikram Malhotra",
        email: industryEmail,
        phone: "+91 99887 76655",
        password: "Password@123",
        confirmPassword: "Password@123",
        role: "INDUSTRY",
      },
    });
    assert(
      regIndustry.statusCode === 201 &&
        regIndustry.json.data.user.role === "INDUSTRY" &&
        regIndustry.json.data.user.isOnboarded === false,
      "2.1 New Industry Recruiter Account Creation"
    );
    const industryAuth = { Cookie: regIndustry.cookie, Authorization: `Bearer ${regIndustry.json.data.token}` };

    // 2.2 Submit Recruiter & Company Onboarding
    const onboardIndustry = await makeRequest({
      path: "/api/v1/auth/onboarding",
      method: "POST",
      headers: industryAuth,
      body: {
        designation: "Principal Technical Recruiter",
        companyName: "Innovate AI Global",
        companyWebsite: "https://innovate-ai.com",
        domain: "Generative AI & Distributed Infrastructure",
        companyDescription: "Leading enterprise AI acceleration and scalable inference engines.",
        companySize: "1000+ employees",
        location: "Bengaluru / Silicon Valley",
        hiringAreas: "Vector Systems, Full-Stack AI, Cloud DevOps",
        skillsRequired: "Python, PyTorch, React, PostgreSQL, Kubernetes",
      },
    });
    assert(
      onboardIndustry.statusCode === 200 &&
        onboardIndustry.json.data.user.isOnboarded === true &&
        onboardIndustry.json.data.user.industryProfile.companyName === "Innovate AI Global" &&
        onboardIndustry.json.data.user.industryProfile.designation === "Principal Technical Recruiter",
      "2.2 Recruiter & Corporate Profile Onboarding Persisted to Database"
    );

    // -------------------------------------------------------------------------
    // TEST 3: REAL FACULTY MENTOR REGISTRATION & ONBOARDING
    // -------------------------------------------------------------------------
    console.log("\n[3/6] 🏅 TEST 3: NEW FACULTY MENTOR REGISTRATION & ONBOARDING...");
    const facultyEmail = `faculty_${timestamp}@nit.ac.in`;

    // 3.1 Register New Faculty
    const regFaculty = await makeRequest({
      path: "/api/v1/auth/register",
      method: "POST",
      body: {
        name: "Dr. Ananya Sen",
        email: facultyEmail,
        phone: "+91 91234 56789",
        password: "Password@123",
        confirmPassword: "Password@123",
        role: "FACULTY",
      },
    });
    assert(
      regFaculty.statusCode === 201 && regFaculty.json.data.user.role === "FACULTY",
      "3.1 New Faculty Mentor Account Creation"
    );
    const facultyAuth = { Cookie: regFaculty.cookie, Authorization: `Bearer ${regFaculty.json.data.token}` };

    // 3.2 Submit Faculty Onboarding
    const onboardFaculty = await makeRequest({
      path: "/api/v1/auth/onboarding",
      method: "POST",
      headers: facultyAuth,
      body: {
        institutionName: "NIT Tiruchirappalli",
        department: "Computer Science & Engineering",
        designation: "Professor & Dean of R&D",
        qualifications: "Ph.D. in High-Performance Distributed Systems",
        specialization: "Distributed Consensus & Vector Indexing",
        researchInterests: "Cloud Microservices, NEP 2020 OBE Rubrics",
        mentorshipAreas: "Capstone Architectures, Research Publication",
      },
    });
    assert(
      onboardFaculty.statusCode === 200 &&
        onboardFaculty.json.data.user.isOnboarded === true &&
        onboardFaculty.json.data.user.facultyProfile.department === "Computer Science & Engineering",
      "3.2 Faculty Academic Credentials & Mentorship Scope Saved"
    );

    // -------------------------------------------------------------------------
    // TEST 4: REAL INSTITUTION / TPO REGISTRATION & ONBOARDING
    // -------------------------------------------------------------------------
    console.log("\n[4/6] 🏛️ TEST 4: NEW INSTITUTION / TPO REGISTRATION & ONBOARDING...");
    const instEmail = `tpo_${timestamp}@iiit.ac.in`;

    // 4.1 Register New Institution User
    const regInst = await makeRequest({
      path: "/api/v1/auth/register",
      method: "POST",
      body: {
        name: "Prof. K. Rajagopal",
        email: instEmail,
        phone: "+91 98450 12345",
        password: "Password@123",
        confirmPassword: "Password@123",
        role: "INSTITUTION",
      },
    });
    assert(
      regInst.statusCode === 201 && regInst.json.data.user.role === "INSTITUTION",
      "4.1 New Institution TPO Admin Account Creation"
    );
    const instAuth = { Cookie: regInst.cookie, Authorization: `Bearer ${regInst.json.data.token}` };

    // 4.2 Submit Institution Onboarding
    const onboardInst = await makeRequest({
      path: "/api/v1/auth/onboarding",
      method: "POST",
      headers: instAuth,
      body: {
        tpoName: "Prof. K. Rajagopal",
        tpoDesignation: "Director of Training, Placements & Corporate Relations",
        institutionName: "IIIT Bangalore",
        institutionType: "Tier-1 Autonomous Institute of National Importance",
        universityAffiliation: "Central Board of Higher Technical Education",
        officialEmail: instEmail,
        website: "https://iiitb.ac.in",
        city: "Bengaluru",
        state: "Karnataka",
        address: "26/C, Electronic City Phase 1, Hosur Road",
        departmentsList: "CSE, ECE, Data Science, AI & ML",
        studentPopulation: 3200,
        code: "IIITB-01",
        nirfRank: 12,
      },
    });
    assert(
      onboardInst.statusCode === 200 &&
        onboardInst.json.data.user.isOnboarded === true &&
        onboardInst.json.data.user.institutionProfile.institutionName === "IIIT Bangalore" &&
        onboardInst.json.data.user.institutionProfile.nirfRank === 12,
      "4.2 Institution & TPO Placement Center Profile Configured"
    );

    // -------------------------------------------------------------------------
    // TEST 5: ADMIN SECURITY VERIFICATION (NO PUBLIC REGISTRATION)
    // -------------------------------------------------------------------------
    console.log("\n[5/6] 🛡️ TEST 5: ADMIN SECURITY & PUBLIC REGISTRATION REJECTION...");
    const fakeAdminReg = await makeRequest({
      path: "/api/v1/auth/register",
      method: "POST",
      body: {
        name: "Fake Hacker Admin",
        email: `hacker_${timestamp}@evil.com`,
        password: "Password@123",
        role: "ADMIN",
      },
    });
    assert(
      fakeAdminReg.statusCode === 403 && fakeAdminReg.json.success === false,
      "5.1 Public Registration Attempt for ADMIN Role Blocked (403 Forbidden)"
    );

    // -------------------------------------------------------------------------
    // TEST 6: GUEST / PUBLIC PORTFOLIO VERIFICATION
    // -------------------------------------------------------------------------
    console.log("\n[6/6] 🌐 TEST 6: GUEST VIEWING PUBLIC PORTFOLIO FOR NEW STUDENT...");
    const publicPortfolioRes = await makeRequest({
      path: `/api/v1/portfolio/devika-raman`,
      method: "GET",
    });
    assert(
      publicPortfolioRes.statusCode === 200 &&
        publicPortfolioRes.json.data.user.name === "Devika Raman" &&
        publicPortfolioRes.json.data.profile.department === "AI & Data Science" &&
        publicPortfolioRes.json.data.user.passwordHash === undefined,
      "6.1 Guest Access to Real Newly Onboarded Student Portfolio (Password Hashes Stripped)"
    );

    // 6.2 Guest Blocked from Protected Admin API
    const guestAdminBlock = await makeRequest({
      path: "/api/v1/admin/stats",
      method: "GET",
    });
    assert(
      guestAdminBlock.statusCode === 401,
      "6.2 Unauthenticated Guest Blocked from Admin Telemetry (401 Unauthorized)"
    );

  } catch (err) {
    console.error("Critical error during real onboarding audit:", err);
    failed++;
  }

  console.log("\n================================================================================");
  console.log(`📊 REAL ONBOARDING AUDIT RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("================================================================================");

  if (failed > 0) process.exit(1);
}

runRealOnboardingAudit();
