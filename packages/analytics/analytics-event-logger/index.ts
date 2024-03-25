/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { Plugin, Context } from '@segment/analytics-next'

function createLogger(type: string) {
  return (ctx: Context) => {
    console.groupCollapsed(
      `%c${type}`,
      'color:white;background:green;border-radius:4px;padding:2px 4px;',
      ctx.event.event,
      ctx.event.properties
    )
    console.log(ctx.event)
    console.groupEnd()

    return ctx
  }
}

/**
 * A segment analytics plugin to log out calls to track in a structured way. Includes the full event payload
 * in a collapsed console group for further inspection, without interaction the event name and event properties
 * are visible.
 */
const AnalyticsPluginEventLogger: Plugin = {
  name: 'Event Logger',
  version: '0.1.0',
  type: 'after',
  track: createLogger('track'),
  page: createLogger('page'),
  identify: createLogger('identify'),
  load: () => Promise.resolve(),
  isLoaded: () => true,
}

/**
 * Register the event logger plugin for track event logging during development.
 */
export const addDevAnalyticsLogger = () => {
  if (
    process.env.NODE_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_ANALYTICS_LOG_LEVEL !== '0'
  ) {
    try {
      window.analytics.ready(() => {
        window.analytics.register(AnalyticsPluginEventLogger)
      })
    } catch {
      // do nothing, not critical
    }
  }
}
