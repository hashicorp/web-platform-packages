import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { trackPageview, load } from 'fathom-client'

function onRouteChangeComplete() {
  trackPageview()
}

/**
 * Sets up analytics calls on route changes to track page view analytics.
 * Currently uses [fathom](https://usefathom.com) under the hood.
 */
export default function usePageviewAnalytics(): void {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      if (
        !process.env.NEXT_PUBLIC_FATHOM_SITE_ID ||
        !process.env.NEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS
      )
        return

      load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID, {
        url: 'https://tarantula.hashicorp.com/script.js',
        includedDomains: process.env.NEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS.split(
          ' '
        ),
      })

      // Record a pageview when route changes
      router.events.on('routeChangeComplete', onRouteChangeComplete)

      // Unassign event listener
      return () => {
        router.events.off('routeChangeComplete', onRouteChangeComplete)
      }
    } else {
      if (
        !process.env.NEXT_PUBLIC_FATHOM_SITE_ID ||
        !process.env.NEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS
      ) {
        console.warn(
          `[@hashicorp/platform-analytics] Missing required environment variables for pageview analytics: ${
            !process.env.NEXT_PUBLIC_FATHOM_SITE_ID
              ? '\nNEXT_PUBLIC_FATHOM_SITE_ID'
              : ''
          }${
            !process.env.NEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS
              ? '\nNEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS'
              : ''
          }
        `
        )
      }
    }
  }, [router.events])
}
