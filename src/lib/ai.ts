export class SynqAI {
  /**
   * Simulated delay to mimic LLM streaming/processing time
   */
  static async simulateDelay(ms: number = 1500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static async analyzeTeamGap(teamRoles: any[], members: any[]) {
    await this.simulateDelay(1200)
    
    // Simple heuristic to generate mock feedback
    const requested = teamRoles.map(r => r.roleName.toLowerCase())
    
    if (requested.length === 0) {
      return "Your team hasn't defined any specific roles yet. Consider adding technical and design roles to structure your search."
    }

    if (requested.includes('design') && members.length < 2) {
      return "Your team has strong technical coverage potential, but currently lacks a dedicated design role to focus on user experience."
    }

    return "Your team composition looks balanced so far. Make sure to define clear responsibilities for the upcoming milestone."
  }

  static async improveProjectIdea(problem: string, solution: string) {
    await this.simulateDelay(2000)
    
    return {
      feedback: "Your problem statement is clear, but your target user is still broad. Consider narrowing it down to a specific niche first.",
      improvedProblem: problem + " specifically for early-stage university students.",
      improvedSolution: "A streamlined version of: " + solution,
      actionItems: [
        "Define exactly who the first 100 users will be.",
        "Simplify the core feature set for the MVP.",
        "Identify the primary technical risk."
      ]
    }
  }

  static async generateRoadmap(description: string) {
    await this.simulateDelay(2500)
    
    return [
      { phase: "Research", title: "User Interviews & Competitor Analysis", description: "Validate the core assumption with 10 target users." },
      { phase: "Prototype", title: "Figma Wireframes", description: "Design the core user flow without writing code." },
      { phase: "MVP", title: "Core Features Development", description: "Build the database schema and basic API endpoints." },
      { phase: "Testing", title: "Internal Dogfooding", description: "Test the MVP within the team to find critical bugs." },
      { phase: "Launch", title: "Beta Release", description: "Onboard the first cohort of users." }
    ]
  }

  static async breakdownTask(featureDescription: string) {
    await this.simulateDelay(1800)
    
    return [
      { title: "Define database schema", priority: "HIGH" },
      { title: "Create API endpoints (GET/POST)", priority: "HIGH" },
      { title: "Build frontend UI components", priority: "MEDIUM" },
      { title: "Integrate frontend with API", priority: "HIGH" },
      { title: "Write unit tests", priority: "LOW" }
    ]
  }

  static async summarizeMeeting(notes: string) {
    await this.simulateDelay(2000)
    
    return {
      summary: "The team discussed the upcoming MVP launch and identified critical blockers in the authentication flow.",
      decisions: [
        "Switch from JWT to session-based auth for simplicity.",
        "Delay the analytics dashboard to post-launch."
      ],
      actionItems: [
        { task: "Update auth schema", owner: "Backend Lead", deadline: "Friday" },
        { task: "Redesign login screen", owner: "UI Designer", deadline: "Thursday" }
      ]
    }
  }
}
