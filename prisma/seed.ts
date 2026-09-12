import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database for SYNQVERSE Phase 10...")

  // Reset Data
  await prisma.user.deleteMany()
  await prisma.team.deleteMany()
  await prisma.workspace.deleteMany()

  // Constants
  const branches = ["CSE", "ECE", "Mechanical", "Design", "Business"]
  const expLevels = ["Beginner", "Intermediate", "Advanced"]
  const tiers = ["FREE", "PRO", "ORGANIZATION"]
  const allSkills = ["React", "Next.js", "Python", "Figma", "ML", "Solidity", "Marketing", "UI/UX", "Node.js"]
  const allInterests = ["AI", "Web3", "SaaS", "EdTech", "Fintech", "Startups"]

  console.log("Generating 50 Users...")
  const users = []
  
  // Explicit Admin User
    const admin = await prisma.user.create({
    data: {
      id: "current-user-id",
      email: "demo@synqverse.com",
      name: "Demo Admin",
      anonymousId: "Anonymous Student #0001",
      role: "ADMIN",
      tier: "PRO",
      profile: {
        create: {
          bio: "Building the future of student collaboration.",
          lookingFor: "Talented engineers and designers.",
          availability: "Full-time",
          projectTypes: "Startup, Hackathon",
          anonymousMode: false,
          experienceLevel: "Advanced"
        }
      },
      academic: {
        create: {
          universityName: "Example University",
          branch: "CSE",
          stream: "B.Tech",
          year: "4th Year"
        }
      }
    }
  })
  users.push(admin)

  // 49 Random Users
  for (let i = 2; i <= 50; i++) {
    const branch = branches[Math.floor(Math.random() * branches.length)]
    const exp = expLevels[Math.floor(Math.random() * expLevels.length)]
    const tier = Math.random() > 0.8 ? "PRO" : "FREE"
    const isAnon = Math.random() > 0.3

    const user = await prisma.user.create({
      data: {
        email: `student${i}@example.com`,
        name: `Student ${i}`,
        anonymousId: `Anonymous Student #${Math.floor(1000 + Math.random() * 9000)}`,
        role: "STUDENT",
        tier,
        profile: {
          create: {
            bio: "Passionate builder looking for a great team.",
            lookingFor: "Frontend and Backend roles",
            availability: "Weekends",
            projectTypes: "Hackathon",
            anonymousMode: isAnon,
            experienceLevel: exp
          }
        },
        academic: {
          create: {
            universityName: "Example University",
            branch,
            stream: "B.Tech",
            year: `${Math.floor(Math.random() * 4) + 1}st Year`
          }
        }
      }
    })
    
    // Connect random skills
    const randomSkills = allSkills.sort(() => 0.5 - Math.random()).slice(0, 3)
    for (const skillName of randomSkills) {
      const skill = await prisma.skill.upsert({ where: { name: skillName }, update: {}, create: { name: skillName } })
      await prisma.userSkill.create({ data: { userId: user.id, skillId: skill.id } })
    }

    users.push(user)
  }

  console.log("Generating 10 Teams & 5 Workspaces...")
  // Team 1: The main demo team
  const team1 = await prisma.team.create({
    data: {
      ownerId: admin.id,
      name: "Synqverse Alpha",
      projectIdea: "A SaaS platform for student startups.",
      description: "We are building the future of college innovation. Looking for serious builders.",
      category: "Startup",
      targetSize: 4,
      requiredSkills: JSON.stringify(["React", "Next.js", "UI/UX", "Node.js"]),
      members: { create: [{ userId: admin.id, role: 'OWNER' }] }
    }
  })
  
  // Add 3 members to team 1 to make it full
  await prisma.teamMember.createMany({
    data: [
      { teamId: team1.id, userId: users[1].id, role: 'MEMBER' },
      { teamId: team1.id, userId: users[2].id, role: 'MEMBER' },
      { teamId: team1.id, userId: users[3].id, role: 'MEMBER' }
    ]
  })

  // Create Workspace for Team 1
  const ws1 = await prisma.workspace.create({
    data: {
      teamId: team1.id,
      name: team1.name,
      description: team1.projectIdea,
      members: {
        create: [
          { userId: admin.id, role: 'OWNER' },
          { userId: users[1].id, role: 'ADMIN' },
          { userId: users[2].id, role: 'MEMBER' },
          { userId: users[3].id, role: 'MEMBER' }
        ]
      },
      channels: {
        create: [
          { name: "general", description: "General discussions" },
          { name: "engineering", description: "Technical architecture" },
          { name: "design", description: "UI/UX syncs" }
        ]
      }
    },
    include: { channels: true }
  })

  // Add dummy tasks
  await prisma.workspaceTask.createMany({
    data: [
      { workspaceId: ws1.id, title: "Design Landing Page", status: "DONE", priority: "HIGH", creatorId: admin.id },
      { workspaceId: ws1.id, title: "Implement Authentication", status: "IN_PROGRESS", priority: "URGENT", creatorId: admin.id },
      { workspaceId: ws1.id, title: "Set up Prisma Models", status: "IN_PROGRESS", priority: "HIGH", creatorId: admin.id },
      { workspaceId: ws1.id, title: "Write Seed Script", status: "TODO", priority: "MEDIUM", creatorId: admin.id },
      { workspaceId: ws1.id, title: "Fix Mobile Layouts", status: "BACKLOG", priority: "LOW", creatorId: admin.id }
    ]
  })

  // Add dummy milestones
  await prisma.workspaceMilestone.createMany({
    data: [
      { workspaceId: ws1.id, title: "Market Research", phase: "Research", status: "COMPLETED", order: 0 },
      { workspaceId: ws1.id, title: "Figma Prototype", phase: "Prototype", status: "COMPLETED", order: 1 },
      { workspaceId: ws1.id, title: "Alpha MVP Release", phase: "MVP", status: "IN_PROGRESS", order: 2, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
    ]
  })

  // Add dummy project & innovation submission
  const project1 = await prisma.project.create({
    data: {
      workspaceId: ws1.id,
      problem: "Students struggle to find serious teammates for startups.",
      solution: "A verified platform with skill-based matching and dedicated workspaces.",
      targetUsers: "University students globally",
      technology: "Next.js, Prisma, Tailwind",
      stage: "MVP",
      impact: "Accelerate 1,000 student startups."
    }
  })

  await prisma.innovationSubmission.create({
    data: {
      teamId: team1.id,
      projectId: project1.id,
      problem: project1.problem,
      solution: project1.solution,
      innovation: "Anonymous-first discovery combined with serious workspaces.",
      technology: project1.technology || "",
      prototype: "https://synqverse.demo",
      targetUsers: project1.targetUsers || "",
      expectedImpact: project1.impact || "",
      currentStage: project1.stage,
      resourcesNeeded: "Cloud credits, Mentorship",
      supportRequested: "Mentorship",
      status: "SUBMITTED"
    }
  })

  // Generate 9 other random teams
  for (let i = 4; i <= 12; i++) {
    const owner = users[i]
    await prisma.team.create({
      data: {
        ownerId: owner.id,
        name: `Startup Project ${i}`,
        projectIdea: "Building an AI-powered study tool.",
        category: "Hackathon",
        targetSize: 4,
        requiredSkills: JSON.stringify(["Python", "React"]),
        members: { create: [{ userId: owner.id, role: 'OWNER' }] }
      }
    })
  }

  console.log("Seeding complete.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
