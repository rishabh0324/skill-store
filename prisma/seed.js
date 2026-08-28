const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Phase 2 Users & Profiles for SIH 2026 PS-44...");

  const passwordHash = await bcrypt.hash("Password@123", 10);

  // 1. Student User
  const student = await prisma.user.upsert({
    where: { email: "student@sih.edu" },
    update: {},
    create: {
      email: "student@sih.edu",
      passwordHash,
      name: "Aarav Sharma",
      role: "STUDENT",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      studentProfile: {
        create: {
          collegeName: "National Institute of Technology (NIT)",
          degree: "B.Tech",
          department: "Computer Science & Engineering",
          graduationYear: 2026,
          cgpa: 8.8,
          rollNo: "CS22B044",
          bio: "Student passionate about Distributed Systems, Full-Stack Next.js, and Vector Databases.",
        },
      },
    },
  });

  // 2. Industry / Recruiter User
  const industry = await prisma.user.upsert({
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

  // 3. Faculty / Mentor User
  const faculty = await prisma.user.upsert({
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

  // 4. Institution Admin User
  const institution = await prisma.user.upsert({
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

  // 5. System Administrator User
  const admin = await prisma.user.upsert({
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

  console.log("✅ Phase 2 Seed Completed Successfully!");
  console.log("-----------------------------------------");
  console.log("Student:     student@sih.edu        (Password@123)");
  console.log("Industry:    recruiter@techcorp.com (Password@123)");
  console.log("Faculty:     faculty@university.edu (Password@123)");
  console.log("Institution: admin@nit-campus.edu   (Password@123)");
  console.log("Admin:       admin@sih-platform.gov.in (Password@123)");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
