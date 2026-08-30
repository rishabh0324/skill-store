const http = require("http");

function post(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
          ...headers,
        },
      },
      (res) => {
        let resData = "";
        res.on("data", (chunk) => (resData += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(resData), headers: res.headers });
          } catch (e) {
            resolve({ status: res.statusCode, body: resData, headers: res.headers });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function patch(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
          ...headers,
        },
      },
      (res) => {
        let resData = "";
        res.on("data", (chunk) => (resData += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(resData), headers: res.headers });
          } catch (e) {
            resolve({ status: res.statusCode, body: resData, headers: res.headers });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path,
        method: "GET",
        headers,
      },
      (res) => {
        let resData = "";
        res.on("data", (chunk) => (resData += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(resData), headers: res.headers });
          } catch (e) {
            resolve({ status: res.statusCode, body: resData, headers: res.headers });
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function runTests() {
  console.log("==========================================================");
  console.log("🧪 RUNNING PHASE 4: AI SKILL-GAP & LEARNING ROADMAPS TESTS");
  console.log("==========================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      failed++;
    }
  }

  try {
    // 1. Authenticate as Student
    const loginRes = await post("/api/v1/auth/login", {
      email: "student@sih.edu",
      password: "Password@123",
    });
    assert(loginRes.status === 200 && loginRes.body.data.token, "Student Authentication (student@sih.edu)");
    const token = loginRes.body.data.token;
    const authHeader = { Authorization: `Bearer ${token}` };

    // 2. Fetch Master Target Career Roles Catalog
    const rolesRes = await get("/api/v1/roadmaps/targets");
    assert(
      rolesRes.status === 200 &&
        Array.isArray(rolesRes.body.data) &&
        rolesRes.body.data.length >= 4 &&
        rolesRes.body.data.some((r) => r.title.includes("Full-Stack AI")) &&
        rolesRes.body.data.some((r) => r.title.includes("Cloud DevOps")),
      "Master Target Roles Catalog Retrieval (4+ Industry Profiles)"
    );

    const devopsRole = rolesRes.body.data.find((r) => r.title.includes("Cloud DevOps"));
    const fullstackRole = rolesRes.body.data.find((r) => r.title.includes("Full-Stack AI"));

    // 3. Fetch Student Active Learning Roadmap & Gap Analysis
    const roadmapRes = await get("/api/v1/roadmaps", authHeader);
    assert(
      roadmapRes.status === 200 &&
        roadmapRes.body.data.roadmap &&
        typeof roadmapRes.body.data.roadmap.overallFitScore === "number" &&
        roadmapRes.body.data.roadmap.cosineSimilarity > 0.8,
      "Active Student Roadmap & Vector Cosine Retrieval (>80% Baseline Cosine)"
    );

    const roadmap = roadmapRes.body.data.roadmap;

    // 4. Verify Skill Gap Analysis Matrix Structure & Delta Calculations
    assert(
      Array.isArray(roadmap.gaps) &&
        roadmap.gaps.length >= 4 &&
        roadmap.gaps.every((g) => typeof g.gapDelta === "number" && g.gapStatus && g.targetBenchmark),
      "Multi-Dimensional Skill Gap Breakdown with Vector Deltas"
    );

    // 5. Verify Milestone Checklist Delivery
    assert(
      Array.isArray(roadmap.steps) &&
        roadmap.steps.length >= 3 &&
        roadmap.steps.every((s) => s.id && s.title && s.resourceType && s.resourceUrl),
      "Curated Milestone Steps Delivery (Videos, Labs, Projects)"
    );

    // 6. Generate New Personalized Roadmap for "Cloud DevOps & Platform Engineer"
    const generateRes = await post(
      "/api/v1/roadmaps",
      {
        targetRoleId: devopsRole.id,
      },
      authHeader
    );

    assert(
      generateRes.status === 201 &&
        generateRes.body.data.roadmap.roleTitle === devopsRole.title &&
        Array.isArray(generateRes.body.data.roadmap.steps) &&
        generateRes.body.data.roadmap.steps.length >= 2,
      "Generate AI Learning Roadmap for Cloud DevOps Profile"
    );

    const devopsRoadmap = generateRes.body.data.roadmap;
    const firstStep = devopsRoadmap.steps[0];
    const secondStep = devopsRoadmap.steps[1];

    // 7. Toggle First Milestone Step to Completed
    const patchStep1Res = await patch(
      `/api/v1/roadmaps/steps/${firstStep.id}`,
      { isCompleted: true },
      authHeader
    );

    assert(
      patchStep1Res.status === 200 &&
        patchStep1Res.body.data.milestone.isCompleted === true &&
        patchStep1Res.body.data.roadmap.progressPercent > 0,
      `Toggle Milestone Step 1 Completed -> Progress: ${patchStep1Res.body?.data?.roadmap?.progressPercent}%`
    );

    // 8. Toggle Second Milestone Step to Completed
    const patchStep2Res = await patch(
      `/api/v1/roadmaps/steps/${secondStep.id}`,
      { isCompleted: true },
      authHeader
    );

    assert(
      patchStep2Res.status === 200 &&
        patchStep2Res.body.data.milestone.isCompleted === true &&
        patchStep2Res.body.data.roadmap.progressPercent > patchStep1Res.body.data.roadmap.progressPercent,
      `Toggle Milestone Step 2 Completed -> Recalculated Progress: ${patchStep2Res.body?.data?.roadmap?.progressPercent}%`
    );

    // 9. Verify Database Persistence of Updated Roadmap Progress
    const verifyRoadmapRes = await get(`/api/v1/roadmaps?roleId=${devopsRole.id}`, authHeader);
    const updatedSteps = verifyRoadmapRes.body.data.roadmap.steps;
    const verifiedStep1 = updatedSteps.find((s) => s.id === firstStep.id);
    const verifiedStep2 = updatedSteps.find((s) => s.id === secondStep.id);

    assert(
      verifiedStep1 &&
        verifiedStep1.isCompleted === true &&
        verifiedStep2 &&
        verifiedStep2.isCompleted === true &&
        verifyRoadmapRes.body.data.roadmap.progressPercent >= 30,
      "Database Persistence of Milestone States & Progress Percentage"
    );

    // 10. Switch Back to Full-Stack AI Solutions Architect
    const switchRes = await post(
      "/api/v1/roadmaps",
      {
        targetRoleId: fullstackRole.id,
      },
      authHeader
    );

    assert(
      switchRes.status === 201 &&
        switchRes.body.data.roadmap.roleTitle === fullstackRole.title &&
        switchRes.body.data.roadmap.overallFitScore >= 75,
      "Switch Target Role to Full-Stack AI Architect & Recalculate Vector Metrics"
    );

    // 11. Security: Reject Unauthenticated Roadmap Generation
    const unauthPostRes = await post("/api/v1/roadmaps", { targetRoleId: devopsRole.id });
    assert(
      unauthPostRes.status === 401,
      "Security Guard: Reject Unauthenticated Roadmap Generation (401)"
    );

    // 12. Security: Reject Unauthenticated Milestone Toggle
    const unauthPatchRes = await patch(`/api/v1/roadmaps/steps/${firstStep.id}`, { isCompleted: true });
    assert(
      unauthPatchRes.status === 401,
      "Security Guard: Reject Unauthenticated Milestone Toggle (401)"
    );

    // 13. Public / Demo Preview Fallback Check
    const publicRoadmapRes = await get("/api/v1/roadmaps");
    assert(
      publicRoadmapRes.status === 200 &&
        publicRoadmapRes.body.data.roadmap &&
        publicRoadmapRes.body.data.roadmap.steps.length >= 3,
      "Public Preview Endpoint Returns Valid Demo Structure for Guests"
    );

  } catch (err) {
    console.error("Test execution error:", err);
    failed++;
  }

  console.log("==========================================================");
  console.log(`📊 PHASE 4 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================================");

  if (failed > 0) process.exit(1);
}

runTests();
