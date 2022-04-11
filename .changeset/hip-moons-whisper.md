---
'@hashicorp/platform-tools': minor
---

* Ensure that scripts invoked through hc-tools respect a project's tsconfig `paths` and `baseUrl` options
* Load .env variables using `@next/env` and make the values available in invoked local scripts
