import { useEffect } from 'react'

/**
 * Given an error category to record,
 * make a call to window.analytics.track on mount and
 * when the provided statusCode changes, in order to record the
 * the specified error at the current window.location.href.
 *
 * Relies on window.analytics.track() being a valid function
 * which can be called as window.analytics.track('Error Page Loaded', { http_status_code, label, referrer }).
 */
export default function useErrorPageAnalytics(
  /** The HTTP status code to send with the track event under `http_status_code` */
  statusCode: number
): void {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof window?.analytics?.track === 'function' &&
      typeof window?.location?.href === 'string'
    )
      window.analytics.track('Error Page Loaded', {
        http_status_code: statusCode,
        label: window?.location?.href,
        referrer: window?.document?.referrer || 'No Referrer',
      })
  }, [statusCode])
}
