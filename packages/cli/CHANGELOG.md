# @hashicorp/platform-cli

## 2.1.0

### Minor Changes

- [#32](https://github.com/hashicorp/web-platform-packages/pull/32) [`5b48abc`](https://github.com/hashicorp/web-platform-packages/commit/5b48abc1f7b92433a50130fc2d9386f7bb5b6845) Thanks [@BRKalow](https://github.com/BRKalow)! - \* Rely on eslint-config-next's parser instead of the deprecated babel-eslint parser.
  - Only attempt to fix rules when not in CI, to ensure anything which is not caught locally will fail in CI.
  - Ensures fixes made by ESLint are applied.

## 2.0.0

### Major Changes

- [#21](https://github.com/hashicorp/web-platform-packages/pull/21) [`4ea603c`](https://github.com/hashicorp/web-platform-packages/commit/4ea603cf0f7304d882af3ddc159cf402f7511453) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - - Upgrade ESLint to v8.8.0, and its related dependencies as needed to support the new major version.
  - Upgrades prettier to 2.5.1

## 1.2.1

### Patch Changes

- [#217](https://github.com/hashicorp/nextjs-scripts/pull/217) [`6b12bf4`](https://github.com/hashicorp/nextjs-scripts/commit/6b12bf4a8757e1895022e40ef5452f1b239b74f3) Thanks [@BRKalow](https://github.com/BRKalow)! - Remove manual prettier parser assignment and rely on prettier automatically inferring the parser instead. Fixes an issue where `package-lock.json` was getting formatted incorrectly. See [here](https://github.com/prettier/prettier/issues/11553) for reference.

## 1.2.0

### Minor Changes

- [#206](https://github.com/hashicorp/nextjs-scripts/pull/206) [`e34a1fa`](https://github.com/hashicorp/nextjs-scripts/commit/e34a1fa290913be2ccfc417890b2835a99e9d719) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - Added `docs:add-version` command to interface with a product repo's `version-manifest.json`

* [#207](https://github.com/hashicorp/nextjs-scripts/pull/207) [`720fc5a`](https://github.com/hashicorp/nextjs-scripts/commit/720fc5ac355addd275d74a73443d8d4fa105b838) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - feat(cli): add `docs:remove-version` command to remove a version from a product repo's `version-manifest.json`

## 1.1.2

### Patch Changes

- [#192](https://github.com/hashicorp/nextjs-scripts/pull/192) [`8d87467`](https://github.com/hashicorp/nextjs-scripts/commit/8d87467e57cac695fab96da2f48159939c922edc) Thanks [@BRKalow](https://github.com/BRKalow)! - Updates the config file generator to use extends instead of spread to ensure that our base rules don't get overwritten.

## 1.1.1

### Patch Changes

- Updated dependencies [[`754168b`](https://github.com/hashicorp/nextjs-scripts/commit/754168b3c0c6896a4b4e9f88f48f0189f7abde93)]:
  - @hashicorp/platform-cms@0.3.0

## 1.1.0

### Minor Changes

- [#193](https://github.com/hashicorp/nextjs-scripts/pull/193) [`e8eaf66`](https://github.com/hashicorp/nextjs-scripts/commit/e8eaf665ae95df3176eb81f2a21e0e11bb29cef1) Thanks [@BRKalow](https://github.com/BRKalow)! - Resolve eslint plugins relative to the next-hashicorp bin, per recommendations from the eslint docs.

### Patch Changes

- [#196](https://github.com/hashicorp/nextjs-scripts/pull/196) [`fdb69d2`](https://github.com/hashicorp/nextjs-scripts/commit/fdb69d26376073973fe016f51a5db69a3b934792) Thanks [@BRKalow](https://github.com/BRKalow)! - Bump lint-staged dependency.

## 1.0.1

### Patch Changes

- Updated dependencies [[`c27878d`](https://github.com/hashicorp/nextjs-scripts/commit/c27878da0205da7222c5880460b441b555040da1)]:
  - @hashicorp/platform-cms@0.2.0

## 1.0.0

### Major Changes

- [#190](https://github.com/hashicorp/nextjs-scripts/pull/190) [`771210a`](https://github.com/hashicorp/nextjs-scripts/commit/771210aa456d9d5a603709e12e48f0710779a537) Thanks [@kendallstrautman](https://github.com/kendallstrautman)! - Removes auto-formatting for .mdx files

### Minor Changes

- [#188](https://github.com/hashicorp/nextjs-scripts/pull/188) [`5ba652a`](https://github.com/hashicorp/nextjs-scripts/commit/5ba652a7b0a6d3c2008a7cdf2e3b3f1599a41fcd) Thanks [@BRKalow](https://github.com/BRKalow)! - Integrate eslint-config-next into our shared eslint config.

## 0.2.0

### Minor Changes

- [#184](https://github.com/hashicorp/nextjs-scripts/pull/184) [`798cf52`](https://github.com/hashicorp/nextjs-scripts/commit/798cf5243a9d93c91256c1f17d5cd4a806772033) Thanks [@BRKalow](https://github.com/BRKalow)! - Rename stylelint config file to stylelint.config.js

## 0.1.3

### Patch Changes

- [#178](https://github.com/hashicorp/nextjs-scripts/pull/178) [`278209e`](https://github.com/hashicorp/nextjs-scripts/commit/278209e57480999aac2522cf52859f17dc477884) Thanks [@BRKalow](https://github.com/BRKalow)! - Add prettier.config.js shared config file

## 0.1.2

### Patch Changes

- [#175](https://github.com/hashicorp/nextjs-scripts/pull/175) [`88df3b6`](https://github.com/hashicorp/nextjs-scripts/commit/88df3b6cbe62192204227d6f337709d3168f27b6) Thanks [@jescalan](https://github.com/jescalan)! - add missing dependency on `@hashicorp/platform-cms`

## 0.1.1

### Patch Changes

- [#173](https://github.com/hashicorp/nextjs-scripts/pull/173) [`0c9d559`](https://github.com/hashicorp/nextjs-scripts/commit/0c9d5595cf97404479c59442c62cd3c0e46755e7) Thanks [@BRKalow](https://github.com/BRKalow)! - Fix pluginRoot so lint-staged config can be found

## 0.1.0

### Minor Changes

- [#162](https://github.com/hashicorp/nextjs-scripts/pull/162) [`f3e68b8`](https://github.com/hashicorp/nextjs-scripts/commit/f3e68b8a00066fe9ab7a789aecfd6bc97bcd047f) Thanks [@jescalan](https://github.com/jescalan)! - Initial release of the platform-\* packages.

## 0.1.0-canary.0

### Minor Changes

- [#162](https://github.com/hashicorp/nextjs-scripts/pull/162) [`a4eda04`](https://github.com/hashicorp/nextjs-scripts/commit/a4eda047e75d843997ea95a8c36a83108b639cb8) Thanks [@jescalan](https://github.com/jescalan)! - Initial release of the platform-\* packages.
