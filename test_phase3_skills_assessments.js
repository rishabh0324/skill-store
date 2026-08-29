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
  console.log("🧪 RUNNING PHASE 3: SKILLS, ASSESSMENTS & OBE TEST SUITE");
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

    // 2. Fetch Master Skills & Student Competency Matrix
    const skillsRes = await get("/api/v1/skills", authHeader);
    assert(skillsRes.status === 200 && Array.isArray(skillsRes.body.data) && skillsRes.body.data.length >= 6, "Master Skills Directory Retrieval");

    // 3. Student Self-Reports a New Skill (Rust)
    const addSkillRes = await post(
      "/api/v1/skills",
      {
        name: "Rust & Systems Programming",
        category: "Languages",
        selfScore: 85,
      },
      authHeader
    );
    assert(addSkillRes.status === 201 && addSkillRes.body.data.name.includes("Rust"), "Self-Report New Skill (Rust)");

    // 4. Verify Self-Reported Skill Appears in Student Competency Matrix
    const updatedSkillsRes = await get("/api/v1/skills", authHeader);
    const rustSkill = updatedSkillsRes.body.data.find((s) => s.name.includes("Rust"));
    assert(rustSkill && rustSkill.selfScore === 85 && rustSkill.verificationStatus === "SELF_REPORTED", "Self-Reported Skill Reflected in Matrix");

    // 5. Fetch Available Proctored Assessments
    const testsRes = await get("/api/v1/assessments", authHeader);
    assert(testsRes.status === 200 && Array.isArray(testsRes.body.data) && testsRes.body.data.length >= 3, "Available Assessments Retrieval");

    const dockerTest = testsRes.body.data.find((t) => t.title.includes("Docker"));
    assert(dockerTest && dockerTest.id, "Docker Assessment Found in Catalog");

    // 6. Fetch Sanitized Questions for Docker Test
    const questionsRes = await get(`/api/v1/assessments/${dockerTest.id}`, authHeader);
    assert(
      questionsRes.status === 200 &&
        questionsRes.body.data.questions.length === 5 &&
        questionsRes.body.data.questions[0].options.length === 4,
      "Sanitized Question Bank Delivery (5 Questions, Anti-Cheat)"
    );

    // 7. Submit Passing Test Attempt (All 5 correct: [1, 1, 0, 1, 2])
    const questions = questionsRes.body.data.questions;
    const passingAnswers = {
      [questions[0].id]: 1,
      [questions[1].id]: 1,
      [questions[2].id]: 0,
      [questions[3].id]: 1,
      [questions[4].id]: 2,
    };

    const submitPassRes = await post(
      `/api/v1/assessments/${dockerTest.id}/submit`,
      {
        answers: passingAnswers,
        timeSpentSeconds: 180,
      },
      authHeader
    );

    assert(
      submitPassRes.status === 200 &&
        submitPassRes.body.data.isPassed === true &&
        submitPassRes.body.data.score === 100 &&
        submitPassRes.body.data.badgeEarned.includes("Docker"),
      "Pass Assessment with 100% & Award OBE Badge"
    );

    // 8. Verify Student Skill was Upgraded to ASSESSMENT_VERIFIED with Badge in DB
    const verifiedSkillsRes = await get("/api/v1/skills", authHeader);
    const verifiedDocker = verifiedSkillsRes.body.data.find((s) => s.name.includes("Docker"));
    assert(
      verifiedDocker &&
        verifiedDocker.isVerified === true &&
        verifiedDocker.verificationStatus === "ASSESSMENT_VERIFIED" &&
        verifiedDocker.verifiedScore === 100,
      "Database StudentSkill Upgraded to ASSESSMENT_VERIFIED"
    );

    // 9. Submit Failing Test Attempt (All wrong options)
    const failingAnswers = {
      [questions[0].id]: 3,
      [questions[1].id]: 3,
      [questions[2].id]: 3,
      [questions[3].id]: 3,
      [questions[4].id]: 0,
    };

    const submitFailRes = await post(
      `/api/v1/assessments/${dockerTest.id}/submit`,
      {
        answers: failingAnswers,
        timeSpentSeconds: 90,
      },
      authHeader
    );

    assert(
      submitFailRes.status === 200 &&
        submitFailRes.body.data.isPassed === false &&
        submitFailRes.body.data.score < 70,
      "Fail Assessment Evaluation (<70% Passing Threshold)"
    );

    // 10. Fetch Public Student Portfolio (/api/v1/portfolio/aarav-sharma)
    const portfolioRes = await get("/api/v1/portfolio/aarav-sharma");
    assert(
      portfolioRes.status === 200 &&
        portfolioRes.body.data.verifiedBadges.length >= 2 &&
        portfolioRes.body.data.projects.length >= 2 &&
        portfolioRes.body.data.accreditationProof.nep2020Compliant === true,
      "Public Verified OBE Portfolio Verification (/api/v1/portfolio/aarav-sharma)"
    );

  } catch (err) {
    console.error("Test execution error:", err);
    failed++;
  }

  console.log("==========================================================");
  console.log(`📊 PHASE 3 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================================");

  if (failed > 0) process.exit(1);
}

runTests();
