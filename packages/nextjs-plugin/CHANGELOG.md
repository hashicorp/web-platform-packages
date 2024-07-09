# @hashicorp/platform-nextjs-plugin

## 5.1.1

### Patch Changes

- [#268](https://github.com/hashicorp/web-platform-packages/pull/268) [`9094487`](https://github.com/hashicorp/web-platform-packages/commit/9094487c570e54f62bdad4a8dbd48a05f6da0f6b) Thanks [@LeahMarieBush](https://github.com/LeahMarieBush)! - Turn off cleanupIds for svgo loader

## 5.1.0

### Minor Changes

- [#154](https://github.com/hashicorp/web-platform-packages/pull/154) [`9a33aa9`](https://github.com/hashicorp/web-platform-packages/commit/9a33aa910661d6555957d57bdb5017f7500d80c1) Thanks [@dstaley](https://github.com/dstaley)! - Use graphql-tag/loader to support #import statements in graphql files

## 5.0.0

### Major Changes

- [#163](https://github.com/hashicorp/web-platform-packages/pull/163) [`bd7a7b6`](https://github.com/hashicorp/web-platform-packages/commit/bd7a7b6903da247d427e024e65b73d717026f74c) Thanks [@BRKalow](https://github.com/BRKalow)! - Remove usage of next-transpile-modules in favor of next's native transpilePackages option. Requires next >=13.1.0.

## 4.2.0

### Minor Changes

- [#151](https://github.com/hashicorp/web-platform-packages/pull/151) [`9e971ba`](https://github.com/hashicorp/web-platform-packages/commit/9e971ba2ec48f014aadad25c69811910e4cc4c95) Thanks [@dstaley](https://github.com/dstaley)! - Add support for emitting sourcemaps via SOURCEMAP=true environment variable

## 4.1.0

### Minor Changes

- [#144](https://github.com/hashicorp/web-platform-packages/pull/144) [`7404a8a`](https://github.com/hashicorp/web-platform-packages/commit/7404a8a3993c6b8a6f0fd9041a461366c5838a3f) Thanks [@BRKalow](https://github.com/BRKalow)! - Support detecting installed @hashicorp/ packages in a monorepo.

## 4.0.0

### Major Changes

- [#112](https://github.com/hashicorp/web-platform-packages/pull/112) [`5210854`](https://github.com/hashicorp/web-platform-packages/commit/5210854f24e94b7b5b0ea148c5d87605b28e8950) Thanks [@dstaley](https://github.com/dstaley)! - Add support for Next v13

## 3.1.0

### Minor Changes

- [#66](https://github.com/hashicorp/web-platform-packages/pull/66) [`2e96273`](https://github.com/hashicorp/web-platform-packages/commit/2e96273eaebfcdd039d70bb7da820e3efc4d3882) Thanks [@dstaley](https://github.com/dstaley)! - Handle motion-config paths from react-components

## 3.0.0

### Major Changes

- [#62](https://github.com/hashicorp/web-platform-packages/pull/62) [`6841e0c`](https://github.com/hashicorp/web-platform-packages/commit/6841e0cf83c332b3d4ff610dfffd5701578ec664) Thanks [@BRKalow](https://github.com/BRKalow)! - Removes deprecated / deleted next config future flag, `strictPostcssConfiguration`. Also ups the minimum next version to 12.0.5 to coincide with the removal of this flag.

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
