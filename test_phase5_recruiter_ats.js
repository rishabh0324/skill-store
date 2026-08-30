/**
 * test_phase5_recruiter_ats.js
 * End-to-End Automated Test Suite for Phase 5:
 * Recruiter Job Drives & Vector ATS Matching
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
  console.log("================================================================");
  console.log("🚀 STARTING PHASE 5: RECRUITER JOB DRIVES & VECTOR ATS TEST SUITE");
  console.log("================================================================\n");

  let recruiterCookie = null;
  let studentCookie = null;
  let createdJobId = null;
  let testApplicationId = null;

  // -------------------------------------------------------------
  // TEST 1: Recruiter Authentication
  // -------------------------------------------------------------
  console.log("👉 Test 1: Industry Recruiter Authentication");
  const recruiterLogin = await makeRequest({
    path: "/api/v1/auth/login",
    method: "POST",
    body: {
      email: "recruiter@techcorp.com",
      password: "Password@123",
    },
  });

  assert(recruiterLogin.statusCode === 200, "Recruiter login returns 200 OK");
  assert(recruiterLogin.json.success === true, "Recruiter login success is true");
  assert(recruiterLogin.json.data.user.role === "INDUSTRY", "Recruiter role is INDUSTRY");
  recruiterCookie = recruiterLogin.cookie;

  // -------------------------------------------------------------
  // TEST 2: Recruiter creates skill-weighted job opening
  // -------------------------------------------------------------
  console.log("\n👉 Test 2: Recruiter Publishes New Skill-Weighted Job Opening");
  const jobPayload = {
    title: "Senior AI Platform & Distributed Systems Engineer",
    description: "Build next-generation high-throughput vector database systems with sub-5ms inferencing pipelines.",
    type: "FULL_TIME",
    location: "Bengaluru / Hybrid",
    stipendSalary: "₹32,00,000/yr",
    minCgpa: 8.0,
    requiredSkills: [
      { name: "React.js & Next.js", weight: 5, minBenchmark: 85, isMandatory: true },
      { name: "Python & Fast-API", weight: 5, minBenchmark: 80, isMandatory: true },
      { name: "PostgreSQL & Prisma ORM", weight: 4, minBenchmark: 75, isMandatory: true },
      { name: "Docker & Containerization", weight: 4, minBenchmark: 75, isMandatory: false },
      { name: "Data Structures & Algorithms", weight: 5, minBenchmark: 85, isMandatory: true },
    ],
  };

  const createJobRes = await makeRequest({
    path: "/api/v1/jobs",
    method: "POST",
    headers: { Cookie: recruiterCookie },
    body: jobPayload,
  });

  assert(createJobRes.statusCode === 201, "Job creation returns 201 Created");
  assert(createJobRes.json.success === true, "Job creation success is true");
  assert(!!createJobRes.json.data.job.id, "Job ID is returned");
  assert(createJobRes.json.data.job.title === jobPayload.title, "Job title matches input");
  assert(createJobRes.json.data.job.requiredSkills.length === 5, "All 5 required skill weights stored");
  createdJobId = createJobRes.json.data.job.id;

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
  // TEST 4: Student queries job drives with personalized vector match score
  // -------------------------------------------------------------
  console.log("\n👉 Test 4: Student Queries Job Drives with Vector Match Scores");
  const studentJobsRes = await makeRequest({
    path: "/api/v1/jobs",
    method: "GET",
    headers: { Cookie: studentCookie },
  });

  assert(studentJobsRes.statusCode === 200, "Student jobs query returns 200 OK");
  assert(studentJobsRes.json.success === true, "Student jobs response success is true");
  const matchingJob = studentJobsRes.json.data.jobs.find((j) => j.id === createdJobId);
  assert(!!matchingJob, "Newly created job is present in student job feed");
  assert(typeof matchingJob.vectorMatchScore === "number", "Personalized vectorMatchScore is computed");
  assert(matchingJob.vectorMatchScore >= 80, `Student has high vector match score (${matchingJob.vectorMatchScore}%)`);
  assert(matchingJob.isApplied === false, "Student has not applied yet");

  // -------------------------------------------------------------
  // TEST 5: Student submits 1-Click Application
  // -------------------------------------------------------------
  console.log("\n👉 Test 5: Student Submits 1-Click Application");
  const applyRes = await makeRequest({
    path: "/api/v1/applications",
    method: "POST",
    headers: { Cookie: studentCookie },
    body: { jobId: createdJobId },
  });

  assert(applyRes.statusCode === 201, "Application submission returns 201 Created");
  assert(applyRes.json.success === true, "Application submission success is true");
  assert(applyRes.json.data.status === "APPLIED", "Initial application status is APPLIED");
  assert(typeof applyRes.json.data.vectorMatchScore === "number", "Vector match score stored in application");
  testApplicationId = applyRes.json.data.applicationId;

  // -------------------------------------------------------------
  // TEST 6: Duplicate Application Rejection
  // -------------------------------------------------------------
  console.log("\n👉 Test 6: Duplicate Application Handling (409 Conflict)");
  const dupApplyRes = await makeRequest({
    path: "/api/v1/applications",
    method: "POST",
    headers: { Cookie: studentCookie },
    body: { jobId: createdJobId },
  });

  assert(dupApplyRes.statusCode === 409, "Duplicate application returns 409 Conflict");
  assert(dupApplyRes.json.success === false, "Duplicate application rejected");

  // -------------------------------------------------------------
  // TEST 7: Recruiter queries applicant pipeline
  // -------------------------------------------------------------
  console.log("\n👉 Test 7: Recruiter Retrieves Applicant Pool with Vector Scoring");
  const recruiterAppsRes = await makeRequest({
    path: `/api/v1/applications?jobId=${createdJobId}`,
    method: "GET",
    headers: { Cookie: recruiterCookie },
  });

  assert(recruiterAppsRes.statusCode === 200, "Recruiter applications query returns 200 OK");
  const applicant = recruiterAppsRes.json.data.candidates.find(
    (c) => c.applicationId === testApplicationId || c.id === testApplicationId
  );
  assert(!!applicant, "Applicant record found in recruiter pipeline");
  assert(applicant.name === "Aarav Sharma", "Applicant name is Aarav Sharma");
  assert(applicant.status === "APPLIED", "Applicant status is APPLIED");
  assert(applicant.vectorMatchScore >= 80, `Applicant vectorMatchScore is high (${applicant.vectorMatchScore}%)`);

  // -------------------------------------------------------------
  // TEST 8: Recruiter advances applicant to UNDER_REVIEW
  // -------------------------------------------------------------
  console.log("\n👉 Test 8: Recruiter Advances Candidate to UNDER_REVIEW");
  const advanceReviewRes = await makeRequest({
    path: "/api/v1/applications",
    method: "PATCH",
    headers: { Cookie: recruiterCookie },
    body: {
      applicationId: testApplicationId,
      status: "UNDER_REVIEW",
    },
  });

  assert(advanceReviewRes.statusCode === 200, "Stage advancement returns 200 OK");
  assert(advanceReviewRes.json.data.updatedStatus === "UNDER_REVIEW", "Candidate status updated to UNDER_REVIEW");

  // -------------------------------------------------------------
  // TEST 9: Recruiter advances applicant to SHORTLISTED
  // -------------------------------------------------------------
  console.log("\n👉 Test 9: Recruiter Advances Candidate to SHORTLISTED");
  const advanceShortlistRes = await makeRequest({
    path: "/api/v1/applications",
    method: "PATCH",
    headers: { Cookie: recruiterCookie },
    body: {
      applicationId: testApplicationId,
      status: "SHORTLISTED",
    },
  });

  assert(advanceShortlistRes.statusCode === 200, "Stage advancement returns 200 OK");
  assert(advanceShortlistRes.json.data.updatedStatus === "SHORTLISTED", "Candidate status updated to SHORTLISTED");

  // -------------------------------------------------------------
  // TEST 10: Recruiter advances applicant to TECHNICAL_INTERVIEW
  // -------------------------------------------------------------
  console.log("\n👉 Test 10: Recruiter Advances Candidate to TECHNICAL_INTERVIEW");
  const advanceInterviewRes = await makeRequest({
    path: "/api/v1/applications",
    method: "PATCH",
    headers: { Cookie: recruiterCookie },
    body: {
      applicationId: testApplicationId,
      status: "TECHNICAL_INTERVIEW",
    },
  });

  assert(advanceInterviewRes.statusCode === 200, "Stage advancement returns 200 OK");
  assert(advanceInterviewRes.json.data.updatedStatus === "TECHNICAL_INTERVIEW", "Candidate status updated to TECHNICAL_INTERVIEW");

  // -------------------------------------------------------------
  // TEST 11: Recruiter advances applicant to OFFERED
  // -------------------------------------------------------------
  console.log("\n👉 Test 11: Recruiter Advances Candidate to OFFERED");
  const advanceOfferRes = await makeRequest({
    path: "/api/v1/applications",
    method: "PATCH",
    headers: { Cookie: recruiterCookie },
    body: {
      applicationId: testApplicationId,
      status: "OFFERED",
    },
  });

  assert(advanceOfferRes.statusCode === 200, "Stage advancement returns 200 OK");
  assert(advanceOfferRes.json.data.updatedStatus === "OFFERED", "Candidate status updated to OFFERED");

  // -------------------------------------------------------------
  // TEST 12: Query Applications Filtered by Status
  // -------------------------------------------------------------
  console.log("\n👉 Test 12: Query Applications Filtered by Status (OFFERED)");
  const offeredAppsRes = await makeRequest({
    path: "/api/v1/applications?status=OFFERED",
    method: "GET",
    headers: { Cookie: recruiterCookie },
  });

  assert(offeredAppsRes.statusCode === 200, "Filtered applications query returns 200 OK");
  const offeredCand = offeredAppsRes.json.data.candidates.find(
    (c) => c.applicationId === testApplicationId || c.id === testApplicationId
  );
  assert(!!offeredCand, "Offered candidate present in OFFERED stage filter");
  assert(offeredCand.status === "OFFERED", "Candidate status confirms OFFERED");

  // -------------------------------------------------------------
  // TEST 13: Student verifies updated application status
  // -------------------------------------------------------------
  console.log("\n👉 Test 13: Student Verifies Updated Application Status");
  const updatedStudentJobsRes = await makeRequest({
    path: "/api/v1/jobs",
    method: "GET",
    headers: { Cookie: studentCookie },
  });

  const updatedJob = updatedStudentJobsRes.json.data.jobs.find((j) => j.id === createdJobId);
  assert(!!updatedJob, "Job found in student feed");
  assert(updatedJob.isApplied === true, "Student job reflects isApplied: true");
  assert(updatedJob.applicationStatus === "OFFERED", "Student job reflects applicationStatus: OFFERED");

  // -------------------------------------------------------------
  // TEST 14: Security & RBAC Guards
  // -------------------------------------------------------------
  console.log("\n👉 Test 14: Security & RBAC Guards");
  // Student cannot post a job opening
  const studentPostJobRes = await makeRequest({
    path: "/api/v1/jobs",
    method: "POST",
    headers: { Cookie: studentCookie },
    body: { title: "Hacker Role" },
  });
  assert(studentPostJobRes.statusCode === 401 || studentPostJobRes.statusCode === 403, "Student is blocked from posting jobs (401/403)");

  // Recruiter cannot submit a job application as student
  const recruiterApplyRes = await makeRequest({
    path: "/api/v1/applications",
    method: "POST",
    headers: { Cookie: recruiterCookie },
    body: { jobId: createdJobId },
  });
  assert(recruiterApplyRes.statusCode === 401 || recruiterApplyRes.statusCode === 403, "Recruiter is blocked from student job applications (401/403)");

  console.log("\n================================================================");
  console.log("🎉 ALL 14 PHASE 5 TESTS COMPLETED WITH 100% SUCCESS!");
  console.log("================================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution aborted with error:", err);
  process.exit(1);
});
