import React from 'react'
import Bugsnag from '@bugsnag/js'
import BugsnagReact from '@bugsnag/plugin-react'

const env = process.env.HASHI_ENV || process.env.NODE_ENV || 'development'

if (!Bugsnag._client) {
  Bugsnag.start({
    apiKey:
      typeof window === 'undefined'
        ? process.env.BUGSNAG_CLIENT_KEY
        : process.env.BUGSNAG_SERVER_KEY,
    plugins: [new BugsnagReact(React)],
    otherOptions: { releaseStage: env },
    enabledReleaseStages: ['production'],
  })
}

// primary bugsnag client export
export default Bugsnag

// get the react ErrorBoundary component
export const ErrorBoundary = Bugsnag.getPlugin('react')
