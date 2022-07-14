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
