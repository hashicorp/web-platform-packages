# `@hashicorp/platform-edge-utils`

A collection of utilities intended for use in a Next.js edge environment.

## Utilities

### `setGeoCookie`

Set's a HashiCorp specific geo cookie so that the client has access to a user's geo information.

| Cookie Name | Cookie Value                        |
| :---------- | :---------------------------------- |
| `hc_geo`    | `country={country},region={region}` |

```ts
// src/middleware.ts
import setGeoCookie from '@hashicorp/platform-edge-utils/lib/set-geo-cookie'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  // Set's a cookie named hc_geo on the response
  const response = setGeoCookie(request)

  return response
}
```
