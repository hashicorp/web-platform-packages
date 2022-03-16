# @hashicorp/platform-analytics

## 0.3.1

### Patch Changes

- [#24](https://github.com/hashicorp/web-platform-packages/pull/24) [`878c3d7`](https://github.com/hashicorp/web-platform-packages/commit/878c3d794f10a9776aea7ed342b59e76a2d56a73) Thanks [@EnMod](https://github.com/EnMod)! - Adds a check for `navigator.sendBeacon` before the Fathom server-side script loads.

## 0.3.0

### Minor Changes

- [#16](https://github.com/hashicorp/web-platform-packages/pull/16) [`251fa63`](https://github.com/hashicorp/web-platform-packages/commit/251fa6317392f00124d3a221dbda2661284e8ea1) Thanks [@BRKalow](https://github.com/BRKalow)! - Add support for passing options to the analytics hook

## 0.2.0

### Minor Changes

- [#223](https://github.com/hashicorp/nextjs-scripts/pull/223) [`a45507b`](https://github.com/hashicorp/nextjs-scripts/commit/a45507b12f198b795af193c60527bc9270991e9c) Thanks [@EnMod](https://github.com/EnMod)! - Adds our custom URL for Fathom analytics to the Fathom loader options

### Patch Changes

- [#222](https://github.com/hashicorp/nextjs-scripts/pull/222) [`01da17b`](https://github.com/hashicorp/nextjs-scripts/commit/01da17bdc955237b9bfa8d503f4bcc4b1001b030) Thanks [@BRKalow](https://github.com/BRKalow)! - Adds safety check for existence of env vars

## 0.1.0

### Minor Changes

- [#220](https://github.com/hashicorp/nextjs-scripts/pull/220) [`10b9c3a`](https://github.com/hashicorp/nextjs-scripts/commit/10b9c3a9dd1156fd3d0321b0b3133ecb4c4edb48) Thanks [@EnMod](https://github.com/EnMod)! - Create @hashicorp/platform-analytics and add a new `usePageviewAnalytics` hook to track pageviews via Fathom.
