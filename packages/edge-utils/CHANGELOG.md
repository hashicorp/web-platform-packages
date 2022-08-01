# @hashicorp/platform-edge-utils

## 0.1.1

### Patch Changes

- [#69](https://github.com/hashicorp/web-platform-packages/pull/69) [`d8a3be7`](https://github.com/hashicorp/web-platform-packages/commit/d8a3be77f22ebbab9c3ce4ed6bddc8e71deb8bdd) Thanks [@BRKalow](https://github.com/BRKalow)! - Fix a type error when using older next types.

## 0.1.0

### Minor Changes

- [#62](https://github.com/hashicorp/web-platform-packages/pull/62) [`fb425af`](https://github.com/hashicorp/web-platform-packages/commit/fb425af2a956b7ab7040f88d8bb529b641a298d2) Thanks [@BRKalow](https://github.com/BRKalow)! - Introduces a new package, `@hashicorp/platform-edge-utils`, which will contain utilities for use in a Next.js edge environment. The first addition is a `setGeoCookie` utility, which parses the geo data from the request object and passes it along in a cookie. A new utility in `@hashicorp/platform-util` was added to parse this cookie and make the information available for use.
