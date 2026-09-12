export const AnalyticsEvents = {
  SIGNUP: "USER_SIGNUP",
  PROFILE_COMPLETED: "PROFILE_COMPLETED",
  DISCOVERY_INTERACTION: "DISCOVERY_INTERACTION",
  CONNECTION_REQUEST: "CONNECTION_REQUEST",
  CONNECTION_ACCEPTED: "CONNECTION_ACCEPTED",
  TEAM_CREATED: "TEAM_CREATED",
  WORKSPACE_CREATED: "WORKSPACE_CREATED",
  MESSAGE_SENT: "MESSAGE_SENT",
  IDEA_CREATED: "IDEA_CREATED",
  INNOVATION_SUBMISSION: "INNOVATION_SUBMISSION"
} as const

export type EventName = keyof typeof AnalyticsEvents

export class Analytics {
  /**
   * Tracks an event by sending it to the backend analytics endpoint.
   * This abstraction ensures we don't block the UI while logging.
   */
  static track(eventName: EventName, metadata?: Record<string, any>) {
    // Fire and forget
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName: AnalyticsEvents[eventName], metadata })
    }).catch(e => {
      // Silently fail for analytics to not disrupt user experience
      console.warn("Analytics tracking failed:", e)
    })
  }
}
