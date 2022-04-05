---
'@hashicorp/platform-cli': minor
---

* Rely on eslint-config-next's parser instead of the deprecated babel-eslint parser.
* Only attempt to fix rules when not in CI, to ensure anything which is not caught locally will fail in CI.
* Ensures fixes made by ESLint are applied.
