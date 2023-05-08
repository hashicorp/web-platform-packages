# @hashicorp/integrations-hcl

## 0.5.0

### Minor Changes

- [#216](https://github.com/hashicorp/web-platform-packages/pull/216) [`1f7c61c`](https://github.com/hashicorp/web-platform-packages/commit/1f7c61c138a3fa4b3d50e06de5069b56aa114c57) Thanks [@BrandonRomano](https://github.com/BrandonRomano)! - Support a 'strategy' field for multiple integrations-hcl consumption paths. Includes a strategy for nomad-pack.

## 0.4.0

### Minor Changes

- [#212](https://github.com/hashicorp/web-platform-packages/pull/212) [`e2ddb3d`](https://github.com/hashicorp/web-platform-packages/commit/e2ddb3d55a035729cf4b706add85ab8bfe830260) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - Add support for `integration_type`. Remove at-least-one component requirement.

## 0.3.1

### Patch Changes

- [#202](https://github.com/hashicorp/web-platform-packages/pull/202) [`2ba45e9`](https://github.com/hashicorp/web-platform-packages/commit/2ba45e9b87b9f12c293b769d9828336ac1bbebc0) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - improve error messages

## 0.3.0

### Minor Changes

- [#182](https://github.com/hashicorp/web-platform-packages/pull/182) [`752c193`](https://github.com/hashicorp/web-platform-packages/commit/752c1933ef8c99a16937aac40c5b60a9d019e4e8) Thanks [@BrandonRomano](https://github.com/BrandonRomano)! - Adjusting the authoring interface to allow for multiple components of the same type. Introduces a component stanza to the integration configuration file that allows for `slug` and a `name` to be specified, as well as the integration `type` (which was what was previously specified in the string array).

## 0.2.0

### Minor Changes

- [#161](https://github.com/hashicorp/web-platform-packages/pull/161) [`22c873c`](https://github.com/hashicorp/web-platform-packages/commit/22c873cc2fde5eaa5ad5d2577512a597f4b89333) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - ### Breaking

  This updates the interface to require 'organization_id' as well as updates the internal API Client.

## 0.1.0

### Minor Changes

- [#126](https://github.com/hashicorp/web-platform-packages/pull/126) [`076768f`](https://github.com/hashicorp/web-platform-packages/commit/076768f935f75bf208df036c6f51174092b5b7f5) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - Initial release
