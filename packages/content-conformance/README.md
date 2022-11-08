# `@hashicorp/platform-content-conformance`

A system to execute checks against HashiCorp's various types of content. Very similar to [ESLint](https://eslint.org/), but tailored to checking content (MDX) and data (JSON, YAML) instead of JavaScript source.

## Installation

## Usage

### CLI

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

_TK: fill out how to leverage existing remark-lint rules._

## Internals

At its core, the content conformance checker handles loading a number of different file types and running rules against those files. Rule violations are tracked by file, and after execution rules can be passed to a reporter method to present the results.

Files that are eligible to be checked are represented as `VFile`[https://github.com/vfile/vfile] instances. `VFile` has a notion of messages attached to a file, along with a number of custom reporters to format and output a file's messages. We take advantage fo this by logging rule violations as a [`VFileMessage`](https://github.com/vfile/vfile-message) on the relevant file.

### Runner

### Engine

### File

### Rule
