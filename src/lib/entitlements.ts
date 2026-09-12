export type UserTier = 'FREE' | 'PRO' | 'ORGANIZATION'

export const TIER_LIMITS = {
  FREE: {
    maxTeams: 3,
    maxWorkspaces: 1,
    canUseAI: false,
    canAccessAdvancedAnalytics: false,
    canCreateOrganization: false,
  },
  PRO: {
    maxTeams: 10,
    maxWorkspaces: 5,
    canUseAI: true,
    canAccessAdvancedAnalytics: true,
    canCreateOrganization: false,
  },
  ORGANIZATION: {
    maxTeams: 999,
    maxWorkspaces: 999,
    canUseAI: true,
    canAccessAdvancedAnalytics: true,
    canCreateOrganization: true,
  }
}

export class Entitlements {
  static getLimits(tier: UserTier) {
    return TIER_LIMITS[tier] || TIER_LIMITS.FREE
  }

  static canUseAI(tier: UserTier) {
    return this.getLimits(tier).canUseAI
  }

  static canAccessAdvancedAnalytics(tier: UserTier) {
    return this.getLimits(tier).canAccessAdvancedAnalytics
  }

  static canCreateOrganization(tier: UserTier) {
    return this.getLimits(tier).canCreateOrganization
  }

  static checkTeamLimit(tier: UserTier, currentTeamsCount: number) {
    return currentTeamsCount < this.getLimits(tier).maxTeams
  }

  static checkWorkspaceLimit(tier: UserTier, currentWorkspacesCount: number) {
    return currentWorkspacesCount < this.getLimits(tier).maxWorkspaces
  }
}
