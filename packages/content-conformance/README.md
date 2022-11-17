# `@hashicorp/platform-content-conformance`

A system to execute checks against HashiCorp's various types of content. Very similar to [ESLint](https://eslint.org/), but tailored to checking content (MDX) and data (JSON, YAML) instead of JavaScript source.

## Installation

```shell
$ npm install @hashicorp/platform-content-conformance
```

## Usage

### CLI

_The CLI is in progress._

```shell
$ hc-content [options] [path/to/file] [path/to/file]

Options:
  --cwd
  --config ./path/to/conformance.config.js
```

### JavaScript

The package exposes its underlying functionality through the `ContentConformanceRunner` class.

```js
import { ContentConformanceRunner } from '@hashicorp/platform-content-conformance'

async function main() {
  const runner = new ContentConformanceRunner()

  await runner.init()

  await runner.run()

  console.log(runner.report())
}

main()
```

## Configuration

On its own, the content conformance system does not know where the files to be checked are located, or what rules should be used. To configure the checker, we create a `content-conformance.config.js` file located in your project's root directory.

```js
export default {
  root: '.',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: {
    'no-h1': 'error',
  },
}
```

## Rules

The core value of the conformance checker lies in the rules that you configure. The core package ships with a number of rules and presets that can be used, and custom rules can also be created in your project. A rule is a JavaScript module that exports a specific object format.

```js
// ./rules/my-rule.js

/** @type {import('@hashicorp/platform-content-conformance').Rule} */
export default {
  id: 'my-rule',
  type: 'content',
  description: 'This rule performs an important check.',
  executor: {
    async contentFile(file, context) {},
    async dataFile(file, context) {},
  },
}
```

### Rule Properties

- `id` (string) A unique identifier for your rule. Convention is to use the ID as the rule's filename.
- `type` (string) The type of rule. Can be `content`, `data`, or `structure`.
- `description` (string) A short description of what the rule does.
- `executor` (object) An object containing file "executor" functions. These functions contain the logic for the rule.
  - `contentFile` (function) Called when a `ContentFile` is visited.
  - `dataFile` (function) Called when a `DataFile` is visited.

### Using `remark-lint` rules

_Coming soon._

## Internals

At its core, the content conformance checker handles loading a number of different file types and running rules against those files. Rule violations are tracked by file, and after execution rules can be passed to a reporter method to present the results.

Files that are eligible to be checked are represented as `VFile`[https://github.com/vfile/vfile] instances. `VFile` has a notion of messages attached to a file, along with a number of custom reporters to format and output a file's messages. We take advantage fo this by logging rule violations as a [`VFileMessage`](https://github.com/vfile/vfile-message) on the relevant file.

### Runner

The runner is responsible for handling options, loading configuration, loading rules, and setting up the environment for the engine to execute. The runner can be called directly from JavaScript, or invoked via the CLI. After calling the engine to execute the checks, the runner is responsible for reporting the results using its configured reporter.

### Engine

The engine is responsible for reading files and executing rules against the files.

### File

All files that are checked are represented by `VFile` instances, with some additional information. The `ContentFile` primitive represents files that contain documentation content. Currently, our content files are authored with MDX. The `DataFile` primitive represents files that contain data used to render our pages. We are planning to handle JSON and YAML files.

### Rule

This package ships with a number of rules, and they can also be defined within consuming projects. Rules can define a number of executor functions that will be run on the different file types. See [Rules](#rules) for more information.