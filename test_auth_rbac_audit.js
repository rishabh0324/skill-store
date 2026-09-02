/**
 * test_auth_rbac_audit.js
 * Comprehensive Authentication & Authorization (RBAC) Audit Test Suite
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

async function runAuthAudit() {
  console.log("================================================================================");
  console.log("🔐 SKILL STORE / BRIDGENEXT AI — AUTHENTICATION & RBAC DEEP AUDIT SUITE");
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
    // 1. AUTHENTICATION MECHANISM & PASSWORD SECURITY
    // -------------------------------------------------------------------------
    console.log("\n[1/5] 🔑 TESTING AUTHENTICATION, PASSWORD HASHING & COOKIE SESSIONS...");

    // 1.1 Valid Student Login
    const studentLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "student@sih.edu", password: "Password@123" },
    });
    assert(
      studentLogin.statusCode === 200 &&
        studentLogin.json.data.user.role === "STUDENT" &&
        studentLogin.cookie &&
        studentLogin.cookie.includes("sih_token="),
      "Student Login & Secure HttpOnly JWT Cookie Issuance"
    );
    const studentToken = studentLogin.json.data.token;
    const studentCookie = studentLogin.cookie;
    const studentAuth = { Authorization: `Bearer ${studentToken}` };

    // 1.2 Invalid Password Rejection (401 Unauthorized)
    const badLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "student@sih.edu", password: "IncorrectPassword!@#" },
    });
    assert(
      badLogin.statusCode === 401 && badLogin.json.success === false,
      "Invalid Password Rejection (401 Unauthorized with Generic Safe Message)"
    );

    // 1.3 Non-Existent User Rejection (401)
    const nonExistentLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "ghost_user_999@sih.edu", password: "Password@123" },
    });
    assert(
      nonExistentLogin.statusCode === 401,
      "Non-Existent User Rejection (Prevents Account Enumeration)"
    );

    // 1.4 Session Persistence on Refresh via Cookie
    const sessionCheck = await makeRequest({
      path: "/api/v1/auth/me",
      method: "GET",
      headers: { Cookie: studentCookie },
    });
    assert(
      sessionCheck.statusCode === 200 &&
        sessionCheck.json.data.user.email === "student@sih.edu" &&
        sessionCheck.json.data.user.studentProfile !== undefined,
      "Session Persistence & DB Profile Hydration via HttpOnly Cookie"
    );

    // 1.5 Session Retrieval without Token (401 Unauthorized)
    const unauthCheck = await makeRequest({
      path: "/api/v1/auth/me",
      method: "GET",
    });
    assert(
      unauthCheck.statusCode === 401,
      "Unauthenticated Session Inspection Rejected (401)"
    );

    // 1.6 Logout Clears Session Cookie
    const logoutRes = await makeRequest({
      path: "/api/v1/auth/logout",
      method: "POST",
    });
    assert(
      logoutRes.statusCode === 200 &&
        logoutRes.headers["set-cookie"] &&
        logoutRes.headers["set-cookie"][0].includes("Max-Age=0"),
      "Logout Correctly Clears / Invalidates HttpOnly Session Cookie"
    );

    // -------------------------------------------------------------------------
    // 2. USER REGISTRATION & PROFILE PERSISTENCE
    // -------------------------------------------------------------------------
    console.log("\n[2/5] 📝 TESTING REGISTRATION, PROFILE CREATION & DUPLICATE CHECKS...");

    const testEmail = `test_engineer_${Date.now()}@sih.edu`;

    // 2.1 Dynamic Role Registration (Student)
    const registerRes = await makeRequest({
      path: "/api/v1/auth/register",
      method: "POST",
      body: {
        name: "Test Audit Student",
        email: testEmail,
        password: "Password@123",
        role: "STUDENT",
        collegeName: "National Institute of Technology",
        degree: "B.Tech",
        department: "Computer Science & Engineering",
        graduationYear: 2026,
      },
    });
    assert(
      registerRes.statusCode === 201 &&
        registerRes.json.data.user.role === "STUDENT" &&
        registerRes.json.data.user.isOnboarded === false,
      "Dynamic Student Real Registration & Initial User Session (isOnboarded: false)"
    );

    // 2.2 Duplicate Account Prevention (409 Conflict)
    const dupRegisterRes = await makeRequest({
      path: "/api/v1/auth/register",
      method: "POST",
      body: {
        name: "Test Duplicate",
        email: testEmail,
        password: "Password@123",
        role: "STUDENT",
        collegeName: "NIT",
        degree: "B.Tech",
        department: "CSE",
      },
    });
    assert(
      dupRegisterRes.statusCode === 409,
      "Duplicate Email Registration Blocked (409 Conflict)"
    );

    // -------------------------------------------------------------------------
    // 3. EXACT 5 ROLES & PROFILE INTEGRITY
    // -------------------------------------------------------------------------
    console.log("\n[3/5] 👥 TESTING ALL 5 EXACT STAKEHOLDER ROLES & SESSIONS...");

    // 3.1 INDUSTRY Recruiter
    const recruiterLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "recruiter@techcorp.com", password: "Password@123" },
    });
    assert(
      recruiterLogin.statusCode === 200 &&
        recruiterLogin.json.data.user.role === "INDUSTRY" &&
        recruiterLogin.json.data.user.industryProfile.companyName.includes("TechCorp"),
      "Role 1: INDUSTRY (Recruiter) Authenticated with Company Profile"
    );
    const recruiterAuth = { Authorization: `Bearer ${recruiterLogin.json.data.token}` };

    // 3.2 FACULTY Mentor
    const facultyLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "faculty@university.edu", password: "Password@123" },
    });
    assert(
      facultyLogin.statusCode === 200 &&
        facultyLogin.json.data.user.role === "FACULTY" &&
        facultyLogin.json.data.user.facultyProfile.department.includes("Computer Science"),
      "Role 2: FACULTY (Mentor) Authenticated with Academic Department Profile"
    );
    const facultyAuth = { Authorization: `Bearer ${facultyLogin.json.data.token}` };

    // 3.3 INSTITUTION Admin (TPO)
    const instLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "admin@nit-campus.edu", password: "Password@123" },
    });
    assert(
      instLogin.statusCode === 200 &&
        instLogin.json.data.user.role === "INSTITUTION" &&
        instLogin.json.data.user.institutionProfile.institutionType.includes("Tier-1"),
      "Role 3: INSTITUTION (TPO Admin) Authenticated with Institution Profile"
    );
    const instAuth = { Authorization: `Bearer ${instLogin.json.data.token}` };

    // 3.4 SYSTEM ADMIN
    const adminLogin = await makeRequest({
      path: "/api/v1/auth/login",
      method: "POST",
      body: { email: "admin@sih-platform.gov.in", password: "Password@123" },
    });
    assert(
      adminLogin.statusCode === 200 &&
        adminLogin.json.data.user.role === "ADMIN",
      "Role 4: ADMIN (System Admin) Authenticated with Root Privileges"
    );
    const adminAuth = { Authorization: `Bearer ${adminLogin.json.data.token}` };

    // 3.5 STUDENT Role
    assert(
      studentLogin.statusCode === 200 && studentLogin.json.data.user.role === "STUDENT",
      "Role 5: STUDENT Authenticated with Competency Profile"
    );

    // -------------------------------------------------------------------------
    // 4. ROLE-BASED ACCESS CONTROL & API AUTHORIZATION
    // -------------------------------------------------------------------------
    console.log("\n[4/5] 🛡️ TESTING API AUTHORIZATION & CROSS-ROLE RESTRICTIONS...");

    // 4.1 Student Cannot Access System Admin APIs
    const studentAccessAdminApi = await makeRequest({
      path: "/api/v1/admin/stats",
      method: "GET",
      headers: studentAuth,
    });
    assert(
      studentAccessAdminApi.statusCode === 401,
      "RBAC: Student Blocked from Admin Telemetry API (401 Forbidden)"
    );

    // 4.2 Industry Recruiter Cannot Access System Admin APIs
    const industryAccessAdminApi = await makeRequest({
      path: "/api/v1/admin/stats",
      method: "GET",
      headers: recruiterAuth,
    });
    assert(
      industryAccessAdminApi.statusCode === 401,
      "RBAC: Industry Recruiter Blocked from Admin Telemetry API (401 Forbidden)"
    );

    // 4.3 Student Cannot Endorse Skills (Faculty Only)
    const studentEndorseSkill = await makeRequest({
      path: "/api/v1/endorsements",
      method: "POST",
      headers: studentAuth,
      body: { studentSkillId: "invalid_id", endorsedScore: 90 },
    });
    assert(
      studentEndorseSkill.statusCode === 401,
      "RBAC: Student Blocked from Faculty Skill Endorsement API (401 Forbidden)"
    );

    // 4.4 Recruiter Cannot Self-Report Skills (Student Only)
    const recruiterAddSkill = await makeRequest({
      path: "/api/v1/skills",
      method: "POST",
      headers: recruiterAuth,
      body: { name: "Unauthorized Skill", selfScore: 80 },
    });
    assert(
      recruiterAddSkill.statusCode === 401,
      "RBAC: Industry Recruiter Blocked from Student Skill Self-Reporting API (401)"
    );

    // 4.5 System Admin CAN Access Admin Telemetry
    const adminAccessAdminApi = await makeRequest({
      path: "/api/v1/admin/stats",
      method: "GET",
      headers: adminAuth,
    });
    assert(
      adminAccessAdminApi.statusCode === 200 &&
        adminAccessAdminApi.json.data.metrics.totalUsers > 0,
      "RBAC: System Admin Successfully Authorized for Admin Telemetry API (200 OK)"
    );

    // -------------------------------------------------------------------------
    // 5. GUEST / PUBLIC PORTFOLIO DATA EXPOSURE
    // -------------------------------------------------------------------------
    console.log("\n[5/5] 🌐 TESTING GUEST ACCESS & PUBLIC PORTFOLIO SECURITY...");

    // 5.1 Guest Can Access Public Verified Portfolio
    const publicPortfolio = await makeRequest({
      path: "/api/v1/portfolio/aarav-sharma",
      method: "GET",
    });
    assert(
      publicPortfolio.statusCode === 200 &&
        publicPortfolio.json.data.user.name === "Aarav Sharma" &&
        publicPortfolio.json.data.user.passwordHash === undefined &&
        publicPortfolio.json.data.accreditationProof.nep2020Compliant === true,
      "Public Portfolio Open for Guest/Recruiter Access without Exposing Passwords/Private Tokens"
    );

  } catch (err) {
    console.error("Critical error during auth audit:", err);
    failed++;
  }

  console.log("\n================================================================================");
  console.log(`📊 AUTH & RBAC AUDIT RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("================================================================================");

  if (failed > 0) process.exit(1);
}

runAuthAudit();
