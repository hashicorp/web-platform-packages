---
'@hashicorp/platform-edge-utils': minor
'@hashicorp/platform-util': minor
---

Introduces a new package, `@hashicorp/platform-edge-utils`, which will contain utilities for use in a Next.js edge environment. The first addition is a `setGeoCookie` utility, which parses the geo data from the request object and passes it along in a cookie. A new utility in `@hashicorp/platform-util` was added to parse this cookie and make the information available for use.
