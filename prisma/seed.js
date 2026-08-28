const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding for SIH-2026 PS-44...");

  const passwordHash = await bcrypt.hash("Password@123", 10);

  // 1. Create Institutions
  const nit = await prisma.institution.upsert({
    where: { code: "NIT-01" },
    update: {},
    create: {
      name: "National Institute of Technology (NIT)",
      code: "NIT-01",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      nirfRank: 9,
    },
  });

  // 2. Create Companies
  const msft = await prisma.company.upsert({
    where: { id: "comp-msft" },
    update: {},
    create: {
      id: "comp-msft",
      name: "Microsoft India",
      website: "https://microsoft.com",
      logoUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=100&auto=format&fit=crop&q=80",
      domain: "Cloud & Enterprise Software",
      isVerified: true,
    },
  });

  // 3. Create Users & Profiles
  // Student User
  const studentUser = await prisma.user.upsert({
    where: { email: "aarav.sharma@institution.edu.in" },
    update: {},
    create: {
      email: "aarav.sharma@institution.edu.in",
      passwordHash,
      name: "Aarav Sharma",
      role: "STUDENT",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      studentProfile: {
        create: {
          institutionId: nit.id,
          rollNo: "CS22B044",
          department: "Computer Science & Engineering",
          graduationYear: 2026,
          cgpa: 8.8,
          bio: "Full-Stack developer and AI systems enthusiast. Building scalable web architectures and vector databases.",
          githubUrl: "https://github.com/aarav-sharma",
          linkedinUrl: "https://linkedin.com/in/aarav-sharma",
          readinessScore: 92,
        },
      },
    },
    include: { studentProfile: true },
  });

  // Recruiter User
  await prisma.user.upsert({
    where: { email: "priya.nair@microsoft.com" },
    update: {},
    create: {
      email: "priya.nair@microsoft.com",
      passwordHash,
      name: "Priya Nair",
      role: "RECRUITER",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      recruiterProfile: {
        create: {
          companyId: msft.id,
          designation: "Principal Technical Recruiter",
        },
      },
    },
  });

  // Faculty User
  await prisma.user.upsert({
    where: { email: "dr.ramesh@institution.edu.in" },
    update: {},
    create: {
      email: "dr.ramesh@institution.edu.in",
      passwordHash,
      name: "Dr. Ramesh Verma",
      role: "FACULTY",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      facultyProfile: {
        create: {
          institutionId: nit.id,
          department: "Computer Science & Engineering",
          designation: "Associate Professor & Industry Liaison",
          specialization: "Distributed Systems & Cloud Computing",
        },
      },
    },
  });

  // 4. Create Master Skills
  const skillsData = [
    { name: "React.js & Next.js", category: "Technical" },
    { name: "Python & Fast-API", category: "Technical" },
    { name: "PostgreSQL & Prisma", category: "Technical" },
    { name: "Docker & Containerization", category: "Tool" },
    { name: "Machine Learning (PyTorch)", category: "Domain" },
    { name: "System Design & Architecture", category: "Technical" },
  ];

  for (const s of skillsData) {
    const skill = await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: {
        name: s.name,
        category: s.category,
      },
    });

    if (studentUser.studentProfile) {
      await prisma.studentSkill.upsert({
        where: {
          studentId_skillId: {
            studentId: studentUser.studentProfile.id,
            skillId: skill.id,
          },
        },
        update: {},
        create: {
          studentId: studentUser.studentProfile.id,
          skillId: skill.id,
          proficiencyLevel: 4,
          verificationStatus: "ASSESSMENT_VERIFIED",
          score: 88,
        },
      });
    }
  }

  console.log("✅ Database Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
