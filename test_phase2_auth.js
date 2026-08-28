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
  console.log("==================================================");
  console.log("🧪 RUNNING PHASE 2 AUTH & RBAC VERIFICATION SUITE");
  console.log("==================================================");

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
    // 1. Test Seeded Login: Student
    const studentLogin = await post("/api/v1/auth/login", {
      email: "student@sih.edu",
      password: "Password@123",
    });
    assert(studentLogin.status === 200 && studentLogin.body.data.user.role === "STUDENT", "Student Login (student@sih.edu)");
    const studentToken = studentLogin.body.data.token;

    // 2. Test Seeded Login: Industry
    const industryLogin = await post("/api/v1/auth/login", {
      email: "recruiter@techcorp.com",
      password: "Password@123",
    });
    assert(industryLogin.status === 200 && industryLogin.body.data.user.role === "INDUSTRY", "Industry Login (recruiter@techcorp.com)");

    // 3. Test Seeded Login: Faculty
    const facultyLogin = await post("/api/v1/auth/login", {
      email: "faculty@university.edu",
      password: "Password@123",
    });
    assert(facultyLogin.status === 200 && facultyLogin.body.data.user.role === "FACULTY", "Faculty Login (faculty@university.edu)");

    // 4. Test Seeded Login: Institution
    const instLogin = await post("/api/v1/auth/login", {
      email: "admin@nit-campus.edu",
      password: "Password@123",
    });
    assert(instLogin.status === 200 && instLogin.body.data.user.role === "INSTITUTION", "Institution Login (admin@nit-campus.edu)");

    // 5. Test Seeded Login: System Admin
    const adminLogin = await post("/api/v1/auth/login", {
      email: "admin@sih-platform.gov.in",
      password: "Password@123",
    });
    assert(adminLogin.status === 200 && adminLogin.body.data.user.role === "ADMIN", "Admin Login (admin@sih-platform.gov.in)");

    // 6. Test Invalid Credentials
    const badLogin = await post("/api/v1/auth/login", {
      email: "student@sih.edu",
      password: "WrongPassword!999",
    });
    assert(badLogin.status === 401 && badLogin.body.success === false, "Invalid Password Rejection (401 Unauthorized)");

    // 7. Test Session Verification (/api/v1/auth/me) with Bearer token
    const meRes = await get("/api/v1/auth/me", {
      Authorization: `Bearer ${studentToken}`,
    });
    assert(meRes.status === 200 && meRes.body.data.user.email === "student@sih.edu", "Session Verification via /api/v1/auth/me");

    // 8. Test Dynamic Role Registration (New Industry Account)
    const newEmail = `recruiter_${Date.now()}@google-hiring.com`;
    const regRes = await post("/api/v1/auth/register", {
      name: "Sundar P.",
      email: newEmail,
      password: "SecurePassword@123",
      role: "INDUSTRY",
      companyName: "Google India",
      companyWebsite: "https://careers.google.com",
    });
    assert(regRes.status === 201 && regRes.body.data.user.role === "INDUSTRY", "New Industry Registration & Profile Creation");

    // 9. Test Duplicate Registration Conflict Check
    const dupRes = await post("/api/v1/auth/register", {
      name: "Sundar P.",
      email: newEmail,
      password: "SecurePassword@123",
      role: "INDUSTRY",
      companyName: "Google India",
      companyWebsite: "https://careers.google.com",
    });
    assert(dupRes.status === 409 && dupRes.body.success === false, "Duplicate Account Prevention (409 Conflict)");

    // 10. Test Forgot Password Token Generation
    const forgotRes = await post("/api/v1/auth/forgot-password", {
      email: newEmail,
    });
    assert(forgotRes.status === 200 && forgotRes.body.data.token, "Forgot Password Token Generation");
    const resetToken = forgotRes.body.data.token;

    // 11. Test Reset Password Workflow
    const resetRes = await post("/api/v1/auth/reset-password", {
      token: resetToken,
      newPassword: "BrandNewPassword@456",
    });
    assert(resetRes.status === 200 && resetRes.body.success === true, "Password Reset with Token Confirmation");

    // 12. Test Login with New Reset Password
    const loginAfterReset = await post("/api/v1/auth/login", {
      email: newEmail,
      password: "BrandNewPassword@456",
    });
    assert(loginAfterReset.status === 200 && loginAfterReset.body.success === true, "Login with Reset Password");

    // 13. Test Logout API
    const logoutRes = await post("/api/v1/auth/logout", {});
    assert(logoutRes.status === 200 && logoutRes.body.success === true, "Logout and Cookie Clearance");

  } catch (err) {
    console.error("Unexpected test error:", err);
    failed++;
  }

  console.log("==================================================");
  console.log(`📊 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runTests();
