/**
 * test_phase6_faculty_institution.js
 * End-to-End Automated Test Suite for Phase 6:
 * Faculty Mentorship, Institutional Analytics & NAAC/NIRF Accreditation
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
      res.on("data", (chunk) => {
        data += chunk;
      });
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
          cookie = setCookie
            .map((c) => c.split(";")[0])
            .join("; ");
        }

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          cookie,
          json,
        });
      });
    });

    req.on("error", (err) => reject(err));

    if (requestBody) {
      req.write(requestBody);
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  } else {
    console.log(`  ✅ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log("==========================================================================");
  console.log("🚀 STARTING PHASE 6: FACULTY MENTORSHIP & INSTITUTIONAL TELEMETRY SUITE");
  console.log("==========================================================================\n");

  let facultyCookie = null;
  let studentCookie = null;
  let institutionCookie = null;
  let createdSlotId = null;
  let createdBookingId = null;
  let targetStudentSkillId = null;

  // -------------------------------------------------------------
  // TEST 1: Faculty Authentication
  // -------------------------------------------------------------
  console.log("👉 Test 1: Faculty Mentor Authentication");
  const facultyLogin = await makeRequest({
    path: "/api/v1/auth/login",
    method: "POST",
    body: {
      email: "faculty@university.edu",
      password: "Password@123",
    },
  });

  assert(facultyLogin.statusCode === 200, "Faculty login returns 200 OK");
  assert(facultyLogin.json.success === true, "Faculty login success is true");
  assert(facultyLogin.json.data.user.role === "FACULTY", "Faculty role is FACULTY");
  facultyCookie = facultyLogin.cookie;

  // -------------------------------------------------------------
  // TEST 2: Faculty Publishes New Mentorship Advisory Slot
  // -------------------------------------------------------------
  console.log("\n👉 Test 2: Faculty Publishes Mentorship Advisory Slot");
  const createSlotRes = await makeRequest({
    path: "/api/v1/mentorship",
    method: "POST",
    headers: { Cookie: facultyCookie },
    body: {
      title: "Advanced Distributed AI & Capstone Review",
      topic: "Neural Search Engines & Scalable Microservices Architecture",
      durationMinutes: 45,
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  });

  assert(createSlotRes.statusCode === 201, "Slot creation returns 201 Created");
  assert(createSlotRes.json.success === true, "Slot creation success is true");
  assert(!!createSlotRes.json.data.slot.id, "Slot ID returned");
  createdSlotId = createSlotRes.json.data.slot.id;

  // -------------------------------------------------------------
  // TEST 3: Student Authentication
  // -------------------------------------------------------------
  console.log("\n👉 Test 3: Student Authentication");
  const studentLogin = await makeRequest({
    path: "/api/v1/auth/login",
    method: "POST",
    body: {
      email: "student@sih.edu",
      password: "Password@123",
    },
  });

  assert(studentLogin.statusCode === 200, "Student login returns 200 OK");
  assert(studentLogin.json.data.user.role === "STUDENT", "Student role is STUDENT");
  studentCookie = studentLogin.cookie;

  // -------------------------------------------------------------
  // TEST 4: Student Queries Available Mentorship Slots
  // -------------------------------------------------------------
  console.log("\n👉 Test 4: Student Queries Available Mentorship Schedule");
  const getSlotsRes = await makeRequest({
    path: "/api/v1/mentorship",
    method: "GET",
    headers: { Cookie: studentCookie },
  });

  assert(getSlotsRes.statusCode === 200, "Mentorship schedule query returns 200 OK");
  const foundSlot = getSlotsRes.json.data.sessions.find((s) => s.id === createdSlotId || s.slotId === createdSlotId);
  assert(!!foundSlot, "Newly published faculty slot is discoverable");

  // -------------------------------------------------------------
  // TEST 5: Student Books Mentorship Slot
  // -------------------------------------------------------------
  console.log("\n👉 Test 5: Student Books 1:1 Guidance Slot");
  const bookSlotRes = await makeRequest({
    path: "/api/v1/mentorship",
    method: "POST",
    headers: { Cookie: studentCookie },
    body: {
      slotId: createdSlotId,
      notes: "Need consultation on neural vector ranking algorithms.",
    },
  });

  assert(bookSlotRes.statusCode === 201, "Booking submission returns 201 Created");
  assert(bookSlotRes.json.success === true, "Booking submission success is true");
  assert(bookSlotRes.json.data.status === "CONFIRMED", "Booking status is CONFIRMED");
  createdBookingId = bookSlotRes.json.data.bookingId;

  // -------------------------------------------------------------
  // TEST 6: Faculty Updates Mentorship Status to COMPLETED
  // -------------------------------------------------------------
  console.log("\n👉 Test 6: Faculty Marks Guidance Session COMPLETED");
  const completeSessionRes = await makeRequest({
    path: "/api/v1/mentorship",
    method: "PATCH",
    headers: { Cookie: facultyCookie },
    body: {
      bookingId: createdBookingId,
      status: "COMPLETED",
    },
  });

  assert(completeSessionRes.statusCode === 200, "Status update returns 200 OK");
  assert(completeSessionRes.json.data.booking.status === "COMPLETED", "Booking status is COMPLETED");

  // -------------------------------------------------------------
  // TEST 7: Query Student Skills Available for Endorsement
  // -------------------------------------------------------------
  console.log("\n👉 Test 7: Faculty Queries Student Competencies for Endorsement");
  const getEndorsementsRes = await makeRequest({
    path: "/api/v1/endorsements",
    method: "GET",
    headers: { Cookie: facultyCookie },
  });

  assert(getEndorsementsRes.statusCode === 200, "Endorsements query returns 200 OK");
  assert(Array.isArray(getEndorsementsRes.json.data.endorsements), "Endorsements array returned");
  const candidateSkill = getEndorsementsRes.json.data.endorsements.find((e) => e.studentName === "Aarav Sharma");
  assert(!!candidateSkill, "Found candidate skill for Aarav Sharma");
  targetStudentSkillId = candidateSkill.studentSkillId || candidateSkill.id;

  // -------------------------------------------------------------
  // TEST 8: Faculty Endorses Student Competency
  // -------------------------------------------------------------
  console.log("\n👉 Test 8: Faculty Grants Official Academic OBE Endorsement");
  const endorseRes = await makeRequest({
    path: "/api/v1/endorsements",
    method: "POST",
    headers: { Cookie: facultyCookie },
    body: {
      studentSkillId: targetStudentSkillId,
      endorsedScore: 94.0,
      feedback: "Demonstrated superior implementation patterns and high code quality in lab capstone.",
    },
  });

  assert(endorseRes.statusCode === 201, "Skill endorsement returns 201 Created");
  assert(endorseRes.json.success === true, "Skill endorsement success is true");
  assert(endorseRes.json.data.verificationStatus === "FACULTY_ENDORSED", "Verification tier upgraded to FACULTY_ENDORSED");
  assert(endorseRes.json.data.verifiedScore === 94.0, "Verified score credit is 94.0%");

  // -------------------------------------------------------------
  // TEST 9: Institution Admin Authentication
  // -------------------------------------------------------------
  console.log("\n👉 Test 9: Institution TPO Administrator Authentication");
  const instLogin = await makeRequest({
    path: "/api/v1/auth/login",
    method: "POST",
    body: {
      email: "admin@nit-campus.edu",
      password: "Password@123",
    },
  });

  assert(instLogin.statusCode === 200, "Institution admin login returns 200 OK");
  assert(instLogin.json.data.user.role === "INSTITUTION", "User role is INSTITUTION");
  institutionCookie = instLogin.cookie;

  // -------------------------------------------------------------
  // TEST 10: Institution Queries Real-Time TPO Placement Telemetry
  // -------------------------------------------------------------
  console.log("\n👉 Test 10: Institution Queries Campus TPO Placement Telemetry");
  const analyticsRes = await makeRequest({
    path: "/api/v1/analytics",
    method: "GET",
    headers: { Cookie: institutionCookie },
  });

  assert(analyticsRes.statusCode === 200, "Analytics query returns 200 OK");
  assert(analyticsRes.json.success === true, "Analytics success is true");
  const tpoData = analyticsRes.json.data.analytics;
  assert(typeof tpoData.overallPlacementRate === "number", "overallPlacementRate is present");
  assert(Array.isArray(tpoData.departmentReadiness), "Department readiness array is present");
  assert(Array.isArray(tpoData.demandVsSupply), "Industry demand vs supply curve is present");

  // -------------------------------------------------------------
  // TEST 11: Institution Queries NAAC / NIRF Accreditation Data
  // -------------------------------------------------------------
  console.log("\n👉 Test 11: Institution Queries NAAC & NIRF Compliance Telemetry");
  const accreditationRes = await makeRequest({
    path: "/api/v1/analytics/accreditation",
    method: "GET",
    headers: { Cookie: institutionCookie },
  });

  assert(accreditationRes.statusCode === 200, "Accreditation query returns 200 OK");
  assert(accreditationRes.json.success === true, "Accreditation response success is true");
  const accData = accreditationRes.json.data.accreditation;
  assert(!!accData.naacMetrics.criterion2_6, "NAAC Criterion 2.6 (OBE outcomes) present");
  assert(!!accData.naacMetrics.criterion5_2, "NAAC Criterion 5.2 (Placements) present");
  assert(!!accData.nirfMetrics.medianSalaryGraduating, "NIRF Median Salary metric present");
  assert(Array.isArray(accData.nbaProgramOutcomes), "NBA Program Outcomes matrix present");

  // -------------------------------------------------------------
  // TEST 12: Public/Guest Access to Analytics Telemetry
  // -------------------------------------------------------------
  console.log("\n👉 Test 12: Guest Public Telemetry Inspection");
  const guestAnalyticsRes = await makeRequest({
    path: "/api/v1/analytics",
    method: "GET",
  });
  assert(guestAnalyticsRes.statusCode === 200, "Guest can inspect public institutional analytics");

  // -------------------------------------------------------------
  // TEST 13: Security & RBAC Guards
  // -------------------------------------------------------------
  console.log("\n👉 Test 13: Security & RBAC Guards");
  // Student cannot endorse skills
  const studentEndorseRes = await makeRequest({
    path: "/api/v1/endorsements",
    method: "POST",
    headers: { Cookie: studentCookie },
    body: { studentSkillId: targetStudentSkillId, endorsedScore: 99 },
  });
  assert(studentEndorseRes.statusCode === 401 || studentEndorseRes.statusCode === 403, "Student is blocked from endorsing skills (401/403)");

  // -------------------------------------------------------------
  // TEST 14: Public Student Portfolio Reflects Endorsed Tier
  // -------------------------------------------------------------
  console.log("\n👉 Test 14: Verified Public Portfolio Verification");
  const portfolioRes = await makeRequest({
    path: "/api/v1/portfolio/aarav-sharma",
    method: "GET",
  });

  assert(portfolioRes.statusCode === 200, "Public portfolio endpoint returns 200 OK");
  assert(portfolioRes.json.data.user.name === "Aarav Sharma", "Portfolio name is Aarav Sharma");
  assert(Array.isArray(portfolioRes.json.data.radarSkills), "Radar skills array returned in portfolio");
  assert(!!portfolioRes.json.data.accreditationProof.nep2020Compliant, "Accreditation proof is present");

  console.log("\n==========================================================================");
  console.log("🎉 ALL 14 PHASE 6 TESTS COMPLETED WITH 100% SUCCESS!");
  console.log("==========================================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution aborted with error:", err);
  process.exit(1);
});
