/**
 * This method provides various helpers that wrap Segment's window.analytics API.
 */
/**
 * Determines whether or not `window.analytics.track` can be invoked.
 */
export const isAnalyticsMethodAvailable = (
  method: keyof (typeof window)['analytics']
): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.analytics &&
    window.analytics[method] &&
    typeof window.analytics[method] === 'function'
  )
}

/**
 * Invokes `window.analytics.track` if it is able to be invoked.
 */
export const track = (
  eventName: string,
  properties?: Record<string, unknown>
): void => {
  if (isAnalyticsMethodAvailable('track')) {
    window.analytics.track(eventName, properties)
  }
}

/**
 * Retrieve segment's anonymousId for the current visitorId
 */
export function getSegmentId(): string | null | undefined {
  if (isAnalyticsMethodAvailable('user')) {
    return window.analytics.user().anonymousId()
  } else {
    return null
  }
}
