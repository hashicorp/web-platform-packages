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

      // If fathom hasn't loaded, warn the user and shortcircuit
      if (!window.fathom) {
        console.warn(
          '[@hashicorp/platform-analytics] The Fathom script has failed to load.'
        )
        return
      }

      // Record a pageview when route changes
      router.events.on('routeChangeComplete', onRouteChangeComplete)

      return () => {
        router.events.off('routeChangeComplete', onRouteChangeComplete)
      }
    } else if (
      process.env.HASHI_ENV === 'preview' &&
      process.env.NEXT_PUBLIC_FATHOM_DEV_SITE_ID
    ) {
      /**
       * Send analytics traffic to a test site in Fathom
       * when running in dev, but only when dev env vars
       * are set.
       *
       * This allows optional testing of new instances
       * locally before merge, without affecting live
       * analytics.
       */
      load(process.env.NEXT_PUBLIC_FATHOM_DEV_SITE_ID, {
        url: 'https://tarantula.hashicorp.com/script.js',
        includedDomains: ['localhost'],
      })

      if (!window.fathom) {
        console.warn(
          '[@hashicorp/platform-analytics] The Fathom script has failed to load.'
        )
        return
      }

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
