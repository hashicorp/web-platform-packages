## `@hashicorp/platform-analytics`

Utilities for collecting analytics from our applications.

### `usePageviewAnalytics({ siteId?: string, includedDomains?: string })`

Sets up pageviews to be tracked by listening to router events, currently done with [Fathom](https://usefathom.com). Needs two environment variables to be set:

- `NEXT_PUBLIC_FATHOM_SITE_ID` - The site ID for the application in Fathom
- `NEXT_PUBLIC_FATHOM_INCLUDED_DOMAINS` - A space-separated list of domains that are eligible for tracking.

Alternatively, you can pass in an options object with `siteId` and `includedDomains`:

```js
usePageviewAnalytics({
  siteId: '1234',
  includedDomains: 'example.com example2.com',
})
```

### `getProductIntentFromURL`

Given a URL, find the first occurance of a product name within the URL and return the product name, else return null.

```js
getProductIntentFromURL('https://hashicorp.com/consul') // => 'consul'
getProductIntentFromURL('https://consul.io') // => 'consul'
getProductIntentFromURL('https://hashicorp.com') // => null
getProductIntentFromURL(
  'https://developer.hashicorp.com/waypoint/tutorials/get-started-nomad/get-started-nomad'
) // => 'waypoint
```

### `utmParamsCapture`

Captures UTM params from a URL and stores an approved list of UTM params as cookies which can then be read and used within forms and segment data.

Initialize utmParamsCapture within your `_app.tsx` file:

```tsx
import { initializeUTMParamsCapture } from '@hashicorp/platform-analytics'

initializeUTMParamsCapture()

export default function App({ Component, pageProps, layoutProps }) {
  ...
}
```

Access stored UTM params from state:

```tsx
import { getUTMParamsCaptureState } from '@hashicorp/platform-analytics'

const utmParams = getUTMParamsCaptureState()
```

### `addCloudLinkHandler`

Adds window event listener to watch for clicks on links within a specified list and passes along utm and product params if present.

```tsx
import { addCloudLinkHandler } from '@hashicorp/platform-analytics'

addCloudLinkHandler()
```

### `track(eventName: string, properties?: Record<sting, unknown>)`

A helper method around `window.analytics.track()` to ensure it won't error if `window.analytics.track()` is unavailable.

```ts
import { track } from '@hashicorp/platform-analytics'

track('my event', { properties: 'here' })
```

### `getSegmentId()`

A helper method around `window.analytics.user().anonymousId()` to ensure it won't error if `window.analytics.user()` is unavailable.

```ts
import { getSegmentId } from '@hashicorp/platform-analytics'

getSegmentId()
```

### `addDevAnalyticsLogger()`

A small Segment Analytics Plugin that logs out calls to Segment's `window.analytics` tracking methods. Logs out the full event payload when `NODE_ENV !== 'production'`. Should only be called once, but it needs to be loaded after the `window.analytics` API is bootstrapped with the Segment Analytics snippet.

Initialization:

```ts
import { addDevAnalyticsLogger } from '@hashicorp/platform-analytics'

// call this once
addDevAnalyticsLogger()
```

Calls to `track()`, for example, will output logs that look like this:

```
[track] Page Scrolled
```
