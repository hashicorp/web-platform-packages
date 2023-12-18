# @hashicorp/platform-tools

## 0.11.0

### Minor Changes

- [#254](https://github.com/hashicorp/web-platform-packages/pull/254) [`a8eb6bb`](https://github.com/hashicorp/web-platform-packages/commit/a8eb6bb2ec84404f0188d542ec7e39db1e0fb6b0) Thanks [@dstaley](https://github.com/dstaley)! - Disable .env file logging

## 0.10.0

### Minor Changes

- [#199](https://github.com/hashicorp/web-platform-packages/pull/199) [`7c4c6a4`](https://github.com/hashicorp/web-platform-packages/commit/7c4c6a405b8b04b12e23f94a361940647136e09b) Thanks [@dstaley](https://github.com/dstaley)! - Add support for skipCommentIfEmpty

## 0.9.0

### Minor Changes

- [#191](https://github.com/hashicorp/web-platform-packages/pull/191) [`804ed22`](https://github.com/hashicorp/web-platform-packages/commit/804ed22de4da89ed9d0e35e9a636421475ca8407) Thanks [@dstaley](https://github.com/dstaley)! - Support being run in a subdirectory

* [#189](https://github.com/hashicorp/web-platform-packages/pull/189) [`cb02c01`](https://github.com/hashicorp/web-platform-packages/commit/cb02c01247d43bfc4fa544b34a4f2b6b2be46320) Thanks [@dstaley](https://github.com/dstaley)! - Correctly find the next executable in monorepos

## 0.8.0

### Minor Changes

- [#151](https://github.com/hashicorp/web-platform-packages/pull/151) [`87150e4`](https://github.com/hashicorp/web-platform-packages/commit/87150e4dd689384ee44e7e2a2bd64ea0a9cfa10f) Thanks [@dstaley](https://github.com/dstaley)! - Add next-touched-pages script

## 0.7.0

### Minor Changes

- [#98](https://github.com/hashicorp/web-platform-packages/pull/98) [`71ca03c`](https://github.com/hashicorp/web-platform-packages/commit/71ca03ccf7ed0d6d17ffac8c661608176d47f79c) Thanks [@dstaley](https://github.com/dstaley)! - Add `capture-build-metrics` script to send Next build metrics to Datadog

## 0.6.0

### Minor Changes

- [#95](https://github.com/hashicorp/web-platform-packages/pull/95) [`d389efd`](https://github.com/hashicorp/web-platform-packages/commit/d389efd63d8a14e1c31e7e578e640bf07c9fb415) Thanks [@BRKalow](https://github.com/BRKalow)! - Pass along arguments to the invoked script if it is locally defined.

## 0.5.0

### Minor Changes

- [#39](https://github.com/hashicorp/web-platform-packages/pull/39) [`ef3de40`](https://github.com/hashicorp/web-platform-packages/commit/ef3de4066819fac1c842145817139b45f6eaeb66) Thanks [@BRKalow](https://github.com/BRKalow)! - Add new `--resolve-paths` flag, which allows us to opt-out of resolving based on the baseUrl and custom paths in tsconfig.json

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
