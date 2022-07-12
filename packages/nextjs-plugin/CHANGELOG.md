# @hashicorp/platform-nextjs-plugin

## 2.1.0

### Minor Changes

- [#56](https://github.com/hashicorp/web-platform-packages/pull/56) [`85c209c`](https://github.com/hashicorp/web-platform-packages/commit/85c209cb26ab89439566f55e78238a4227b88131) Thanks [@dstaley](https://github.com/dstaley)! - Disable ES modules for framer-motion

## 2.0.1

### Patch Changes

- Updated dependencies [[`4d53e04`](https://github.com/hashicorp/web-platform-packages/commit/4d53e047eeddcd7461fc9ee05306ace1f08947cd)]:
  - @hashicorp/next-optimized-images@0.2.0

## 2.0.0

### Major Changes

- [#14](https://github.com/hashicorp/web-platform-packages/pull/14) [`4a627bd`](https://github.com/hashicorp/web-platform-packages/commit/4a627bd9ab531a474e6abc51937c9592f729755c) Thanks [@dstaley](https://github.com/dstaley)! - PostCSS configuration is now done with `@hashicorp/platform-postcss-config`. Please see the [README](https://github.com/hashicorp/web-platform-packages/blob/main/packages/postcss-config/README.md) for more information on how to migrate your configuration.

## 1.0.1

### Patch Changes

- [#209](https://github.com/hashicorp/nextjs-scripts/pull/209) [`e06df86`](https://github.com/hashicorp/nextjs-scripts/commit/e06df8675bc6b72f19e95452a6d3b4d623fcc6fc) Thanks [@BRKalow](https://github.com/BRKalow)! - Bump postcss-normalize dependency to fix error from sanitize.css

## 1.0.0

### Major Changes

- [#205](https://github.com/hashicorp/nextjs-scripts/pull/205) [`a0324fc`](https://github.com/hashicorp/nextjs-scripts/commit/a0324fcf5af12d2fd313693fd6098342756e145d) Thanks [@BRKalow](https://github.com/BRKalow)! - - Excludes `next-optimized-images` plugin by default, it is now opt-in by passing a `nextOptimizedImages: true` option to `withHashicorp`: `withHashicorp({ nextOptimizedImages: true })`

## 0.3.0

### Minor Changes

- [#200](https://github.com/hashicorp/nextjs-scripts/pull/200) [`deaedfa`](https://github.com/hashicorp/nextjs-scripts/commit/deaedfae0d11c62163f6d085324e6ae9b4375f4a) Thanks [@BRKalow](https://github.com/BRKalow)! - Disable eslint during next's build in favor of our existing linting setup.

## 0.2.0

### Minor Changes

- [#188](https://github.com/hashicorp/nextjs-scripts/pull/188) [`5ba652a`](https://github.com/hashicorp/nextjs-scripts/commit/5ba652a7b0a6d3c2008a7cdf2e3b3f1599a41fcd) Thanks [@BRKalow](https://github.com/BRKalow)! - Updates platform-nextjs-plugin to work with next v11

### Patch Changes

- [#188](https://github.com/hashicorp/nextjs-scripts/pull/188) [`5ba652a`](https://github.com/hashicorp/nextjs-scripts/commit/5ba652a7b0a6d3c2008a7cdf2e3b3f1599a41fcd) Thanks [@BRKalow](https://github.com/BRKalow)! - Adds fork of next-optimized-images which works with next 11

- Updated dependencies [[`5ba652a`](https://github.com/hashicorp/nextjs-scripts/commit/5ba652a7b0a6d3c2008a7cdf2e3b3f1599a41fcd)]:
  - @hashicorp/next-optimized-images@0.1.0

## 0.1.0

### Minor Changes

- [#162](https://github.com/hashicorp/nextjs-scripts/pull/162) [`f3e68b8`](https://github.com/hashicorp/nextjs-scripts/commit/f3e68b8a00066fe9ab7a789aecfd6bc97bcd047f) Thanks [@jescalan](https://github.com/jescalan)! - Initial release of the platform-\* packages.

### Patch Changes

- [#162](https://github.com/hashicorp/nextjs-scripts/pull/162) [`f3e68b8`](https://github.com/hashicorp/nextjs-scripts/commit/f3e68b8a00066fe9ab7a789aecfd6bc97bcd047f) Thanks [@jescalan](https://github.com/jescalan)! - Fix inclusion of platform-types

## 0.1.0-canary.1

### Patch Changes

- [#162](https://github.com/hashicorp/nextjs-scripts/pull/162) [`4b1fa03`](https://github.com/hashicorp/nextjs-scripts/commit/4b1fa03b0157c05c343e5b45a3a37704da06850a) Thanks [@jescalan](https://github.com/jescalan)! - Fix inclusion of platform-types

## 0.1.0-canary.0

### Minor Changes

- [#162](https://github.com/hashicorp/nextjs-scripts/pull/162) [`a4eda04`](https://github.com/hashicorp/nextjs-scripts/commit/a4eda047e75d843997ea95a8c36a83108b639cb8) Thanks [@jescalan](https://github.com/jescalan)! - Initial release of the platform-\* packages.
