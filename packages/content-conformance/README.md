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
  --config ./path/to/conformance.config.mjs
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

#### Options

- `cwd` (string) - Specify the working directory where the content checks will be run. Defaults to `process.cwd()`.
- `config` (string) - Specify a path to a custom configuration file. If not provided, defaults to `{cwd}/content-conformance.config.mjs`.
- `files` (string[]) - Specify a list of filenames to match against when running checks. Acts as a filter. If not specified, all files matching the patterns provided in your configuration will be checked.
- `reporter` (string) - Specify the reporter type to use when calling `runner.report()`. Can be `text`, `json`, or `markdown`. Defaults to `text`.

## Configuration

On its own, the content conformance system does not know where the files to be checked are located, or what rules should be used. To configure the checker, we create a `content-conformance.config.mjs` file located in your project's root directory.

```js
export default {
  root: '.',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: {
    'no-h1': 'error',
  },
}
```

### Configuring rules

Rules can be specified with differing severity to control the check's failure state. The valid values are: `error`, `warn`, or `off`. By default, errors will cause a run to fail, while warnings will not. Rules can also be turned off. Individual rules may also accept a configuration object. This configuration object is made available via the rule context that is passed into the executor functions.

```js
export default {
  root: '.',
  contentFileGlobPattern: 'content/**/*.mdx',
  partialsDirectory: 'content/partials',
  rules: {
    'with-config': [
      'error',
      { message: 'this will be available as context.config.message' },
    ],
  },
}
```

### Presets

This package includes a number of configuration presets that can be used by specifying a `preset` configuration property:

```js
export default {
  preset: 'base-mdx',
  rules: {
    'my-rule': 'off',
  },
}
```

When using a preset, any properties defined in the consuming configuration will take precedence over the preset. Individual rule configuration from a preset is completely overwritten if present in the consuming configuration. In the above case, if `base-mdx` contains configuration for the `my-rule` rule, it would be replaced with `off`.

Available presets can be found in the [./src/configs](./src/configs) directory.

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

[remark-lint](https://github.com/remarkjs/remark-lint) rules are supported by default. To use a `remark-lint` rule, add it to your configuration and ensure the package is installed as a development dependency in your project.

```js
export default {
  root: '.',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: {
    'remark-lint-definition-case': 'error',
  },
}
```

### Rule Messages

Writing meaningful, actionable rule messages is important to ensure contributors can address issues on their own. Messages passed to `context.report()` should be written in an [active voice](https://writing.wisc.edu/handbook/style/ccs_activevoice). For example:

```js
❌ 'Expected frontmatter to contain: description'
✅ 'Document does not have a `description` key in its frontmatter. Add a `description` key at the top of the document.'
```

## Internals

At its core, the content conformance checker handles loading a number of different file types and running rules against those files. Rule violations are tracked by file, and after execution rules can be passed to a reporter method to present the results.

Files that are eligible to be checked are represented as `VFile`[https://github.com/vfile/vfile] instances. `VFile` has a notion of messages attached to a file, along with a number of custom reporters to format and output a file's messages. We take advantage fo this by logging rule violations as a [`VFileMessage`](https://github.com/vfile/vfile-message) on the relevant file.

### Runner

The runner is responsible for handling options, loading configuration, loading rules, and setting up the environment for the engine to execute. The runner can be called directly from JavaScript, or invoked via the CLI. After calling the engine to execute the checks, the runner is responsible for reporting the results using its configured reporter.

### Engine

The engine is responsible for reading files and executing rules against the files.

### File

All files that are checked are represented by `VFile` instances, with some additional information. The `ContentFile` primitive represents files that contain documentation content. Currently, our content files are authored with MDX, with support for YAML frontmatter, out-of-the-box. The `DataFile` primitive represents files that contain data used to render our pages. We are planning to handle JSON and YAML files.

### Rule

This package ships with a number of rules, and they can also be defined within consuming projects. Rules can define a number of executor functions that will be run on the different file types. See [Rules](#rules) for more information.

```

```
