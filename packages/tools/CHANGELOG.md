# @hashicorp/platform-tools

## 0.4.0

### Minor Changes

- [#37](https://github.com/hashicorp/web-platform-packages/pull/37) [`51f3750`](https://github.com/hashicorp/web-platform-packages/commit/51f37501bf4d30dc3ec36c88483b28df4630ba8a) Thanks [@BRKalow](https://github.com/BRKalow)! - By default pass --skipProject to ts-node to ensure a stable execution. Add --project option, which mirrors the behavior of ts-nodes option of the same name.

## 0.3.0

### Minor Changes

- [#35](https://github.com/hashicorp/web-platform-packages/pull/35) [`d9a2384`](https://github.com/hashicorp/web-platform-packages/commit/d9a2384bb662e96df711c78fcc98ab17040eba40) Thanks [@BRKalow](https://github.com/BRKalow)! - \* Ensure that scripts invoked through hc-tools respect a project's tsconfig `paths` and `baseUrl` options
  - Load .env variables using `@next/env` and make the values available in invoked local scripts

## 0.2.0

### Minor Changes

- [#29](https://github.com/hashicorp/web-platform-packages/pull/29) [`efdc741`](https://github.com/hashicorp/web-platform-packages/commit/efdc7414f1f358d9f648432001bbf4fe194002bf) Thanks [@BRKalow](https://github.com/BRKalow)! - Adds next-build-webpack-only script

## 0.1.0

### Minor Changes

- [#27](https://github.com/hashicorp/web-platform-packages/pull/27) [`1587501`](https://github.com/hashicorp/web-platform-packages/commit/1587501f51b605b62daec3470f350faa66621705) Thanks [@BRKalow](https://github.com/BRKalow)! - Introduces a new @hashicorp/platform-tools package. Includes useful scripts and utilities that might be applicable for use across our applications.
