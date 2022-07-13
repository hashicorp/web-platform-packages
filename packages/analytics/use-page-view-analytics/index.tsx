import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { trackPageview, load } from 'fathom-client'

interface UsePageViewAnalyticsOptions {
  siteId?: string
  includedDomains?: string
}

function onRouteChangeComplete() {
  trackPageview()
}

/**
 * Sets up analytics calls on route changes to track page view analytics.
 * Currently uses [fathom](https://usefathom.com) under the hood.
 */
export default function usePageviewAnalytics({
  siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID,
  includedDomains = process.env.NEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS,
}: UsePageViewAnalyticsOptions = {}): void {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // These short-circuits prwevent the following from happening:
      // - Prevents runtime crash if siteId or includedDomains are not set
      if (!siteId || !includedDomains) return

      // - Prevents instant 404 when a Fathom client method is called and the navigator.sendBeacon method is unavailable
      if (navigator.sendBeacon === undefined) return

      load(siteId, {
        url: 'https://tarantula.hashicorp.com/script.js',
        includedDomains: includedDomains.split(' '),
      })

      // Record a pageview when route changes
      router.events.on('routeChangeComplete', onRouteChangeComplete)

      // Unassign event listener
      return () => {
        router.events.off('routeChangeComplete', onRouteChangeComplete)
      }
    } else {
      if (!siteId || !includedDomains) {
        console.warn(
          `[@hashicorp/platform-analytics] Missing required options for pageview analytics: ${
            !siteId ? '\nNEXT_PUBLIC_FATHOM_SITE_ID' : ''
          }${!includedDomains ? '\nNEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS' : ''}
        `
        )
      }

      if (!navigator.sendBeacon) {
        console.warn(
          "[@hashicorp/platform-analytics] Your browser's navigator.sendBeacon method was not found. Please enable it to test Fathom in dev."
        )
      }
    }
  }, [includedDomains, siteId, router.events])
}
