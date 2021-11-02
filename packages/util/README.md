# `@hashicorp/platform-util`

Shared utilities used across our web properties and libraries.

### NProgress

By default, Next.js does not provide any loading indicator for client-side route transitions. They recommend the use of [NProgress](https://ricostacruz.com/nprogress/), a small script that dislays a loading bar at the top of the browser frame.

It can be added to your app as such, within `_app.js`

```js
import '@hashicorp/platform-util/nprogress/style.css'
import NProgress from '@hashicorp/platform-util/nprogress'
import Router from 'next/router'

NProgress({ Router })
```

If you want to add some custom action to the route change's `start`, `finish`, or `error` states, you can pass in functions that will run accordingly:

```js
import '@hashicorp/platform-util/nprogress/style.css'
import NProgress from '@hashicorp/platform-util/nprogress'
import Router from 'next/router'

NProgress({
  Router,
  start: () => console.log('route change started'),
  finish: () => console.log('route change complete'),
  error: () => console.log('route change error'),
})
```

It's worth noting that the `finish` handler will always automatically fire an analytics `page` event as long as the `window.analytics` object is present.

Make sure to remember the css import as well!

### Anchor Link Analytics

HashiCorp maintains a lot of documentation sites, all of which have many automatically generated permalinks based on headline text, and which can often break as a result of text changes and reorganization. As such, we try to run some extra analytics on permalinks by tracking, when a page url contains an anchor link (like `hashicorp.com#foo`) whether the given anchor is actually present on the page. This allows us to more confidently remove custom anchor links that are unused, and to detect when a popular incoming anchor link is broken so it can be fixed.

To enable this tracking, simply import `@hashicorp/platform-util/anchor-link-analytics` in your `_app.js`. This script is SSR-compatible and runs inside `requestIdleCallback` so that it has a minimal impact on page performance. An example of a bare bones implementation:

```js
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'

export default function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()
  return <Component {...pageProps} />
}
```
