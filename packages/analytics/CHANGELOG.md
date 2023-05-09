# @hashicorp/platform-analytics

## 0.12.0

### Minor Changes

- [#221](https://github.com/hashicorp/web-platform-packages/pull/221) [`f05c77c`](https://github.com/hashicorp/web-platform-packages/commit/f05c77c6a0993c8c589de846952e56f1420fd660) Thanks [@mwickett](https://github.com/mwickett)! - Update url used to load Fathom script - custom domains no longer work

## 0.11.2

### Patch Changes

- [#209](https://github.com/hashicorp/web-platform-packages/pull/209) [`8e8fb6b`](https://github.com/hashicorp/web-platform-packages/commit/8e8fb6b4155857ff26c075f9ace4d5ceabfeed9f) Thanks [@BRKalow](https://github.com/BRKalow)! - Fix return type of getSegmentAnonymousId()

## 0.11.1

### Patch Changes

- [#203](https://github.com/hashicorp/web-platform-packages/pull/203) [`dd65f08`](https://github.com/hashicorp/web-platform-packages/commit/dd65f08293c1456cad0f5d25e38531ae6a282446) Thanks [@BRKalow](https://github.com/BRKalow)! - Update types for window.analytics to include the latest APIs

## 0.11.0

### Minor Changes

- [#103](https://github.com/hashicorp/web-platform-packages/pull/103) [`ce88545`](https://github.com/hashicorp/web-platform-packages/commit/ce885452222ddb0f5521fbbc49d73c22ceb89dda) Thanks [@alexcarpenter](https://github.com/alexcarpenter)! - add addGlobalLinkHandler

## 0.10.0

### Minor Changes

- [#104](https://github.com/hashicorp/web-platform-packages/pull/104) [`eae4733`](https://github.com/hashicorp/web-platform-packages/commit/eae4733754d1d7ba00bfcc26addb09954214d503) Thanks [@BRKalow](https://github.com/BRKalow)! - Adds a few helper methods for working with segment's `window.analytics` API: `track()`, `getSegment()`, and `isAnalyticsMethodAvailable()`.

### Patch Changes

- [#106](https://github.com/hashicorp/web-platform-packages/pull/106) [`3b5a7ff`](https://github.com/hashicorp/web-platform-packages/commit/3b5a7ffd9cdb7b0a4f2514e066209bbe93f16fa9) Thanks [@BRKalow](https://github.com/BRKalow)! - Use proper typeof check

## 0.9.0

### Minor Changes

- [#100](https://github.com/hashicorp/web-platform-packages/pull/100) [`d6b3f48`](https://github.com/hashicorp/web-platform-packages/commit/d6b3f482d44b02a58c80cb0c077d7c00473c25a3) Thanks [@alexcarpenter](https://github.com/alexcarpenter)! - add hcp product intent check

## 0.8.0

### Minor Changes

- [#96](https://github.com/hashicorp/web-platform-packages/pull/96) [`4db223f`](https://github.com/hashicorp/web-platform-packages/commit/4db223fdc485f4deffbfe38694a78fbb61467739) Thanks [@alexcarpenter](https://github.com/alexcarpenter)! - add check for external link functionality

## 0.7.0

### Minor Changes

- [#90](https://github.com/hashicorp/web-platform-packages/pull/90) [`139cea1`](https://github.com/hashicorp/web-platform-packages/commit/139cea110a78b6449c20069bc911dbbb5e25e2b1) Thanks [@alexcarpenter](https://github.com/alexcarpenter)! - adds optional callback to handler

## 0.6.1

### Patch Changes

- [#86](https://github.com/hashicorp/web-platform-packages/pull/86) [`4bf17bb`](https://github.com/hashicorp/web-platform-packages/commit/4bf17bb91ed711eadc60d219eef7a3d9df623d77) Thanks [@nandereck](https://github.com/nandereck)! - Add useErrorPageAnalytics hook

## 0.6.0

### Minor Changes

- [#84](https://github.com/hashicorp/web-platform-packages/pull/84) [`2c7fe1b`](https://github.com/hashicorp/web-platform-packages/commit/2c7fe1bb3f21946cfbd252bdd1f3156b97a6d33c) Thanks [@alexcarpenter](https://github.com/alexcarpenter)! - fix: include pathname in url generation

## 0.5.1

### Patch Changes

- [#80](https://github.com/hashicorp/web-platform-packages/pull/80) [`79b0392`](https://github.com/hashicorp/web-platform-packages/commit/79b03920a32efefd5cdddcb41889dfa7e543e041) Thanks [@alexcarpenter](https://github.com/alexcarpenter)! - Change product intent search param key

## 0.5.0

### Minor Changes

- [#72](https://github.com/hashicorp/web-platform-packages/pull/72) [`c584e5e`](https://github.com/hashicorp/web-platform-packages/commit/c584e5e8217e6f929d0e575e2fc6ce8dd27474cc) Thanks [@alexcarpenter](https://github.com/alexcarpenter)! - add addCloudLinkHandler util

### Patch Changes

- [#73](https://github.com/hashicorp/web-platform-packages/pull/73) [`412cad2`](https://github.com/hashicorp/web-platform-packages/commit/412cad2d04c92719ac24d150ffe282ffa5aafb57) Thanks [@alexcarpenter](https://github.com/alexcarpenter)! - update utm allow list

## 0.4.0

### Minor Changes

- [#57](https://github.com/hashicorp/web-platform-packages/pull/57) [`d9566d2`](https://github.com/hashicorp/web-platform-packages/commit/d9566d2940912e180631b67914210cf81f174278) Thanks [@alexcarpenter](https://github.com/alexcarpenter)! - Adds utmParamsCapture

* [#63](https://github.com/hashicorp/web-platform-packages/pull/63) [`c3f6caf`](https://github.com/hashicorp/web-platform-packages/commit/c3f6caf1d2884bf6db98abe27a8c68276af60e85) Thanks [@alexcarpenter](https://github.com/alexcarpenter)! - add getProductIntentFromURL util

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
