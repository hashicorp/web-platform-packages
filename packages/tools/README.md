# `@hashicorp/platform-tools`

A collection of tools and utilities intended for use throughout our applications. Also includes an out-of-the-box script runner which can execute arbitrary TypeScript scripts. This is useful for writing local scripts without introducing ts-node and additional configuration. Things that might live here:

- One-off scripts needed for use across applications
- Codemods

## Installation & Usage

```shell
npm install @hashicorp/platform-tools
```

Once installed, the runner can be used to execute a packaged script, or an arbitrary script in your current working directory. Running script without any arguments will return a list of the packaged scripts:

```shell
$ npx hc-tools

Expected a script name to be passed, available scripts:
  - add-deploy-preview-script
```

Additional arguments beyond the script name will be passed to the executed script:

```shell
$ npx hc-tools add-deploy-preview-script waypoint

# Executes the add-deploy-preview script with the argument "waypoint"
```

## Local scripts

`hc-tools` can be used to run scripts defined locally in your project, for example:

```shell
$ hc-tools ./scripts/my-script.ts
```

As part of this, `hc-tools` will also load environment variables defined in `.env` using the same [loading strategy as Next.js](https://www.npmjs.com/package/@next/env).

### Options

- `--project [path to tsconfig]` - If specified, loads the tsconfig from the specified path
- `--resolve-paths [true|false]` - Controls whether or not to resolve paths based on local tsconfig settings (default: `true`)

## Included scripts

### `add-deploy-preview-script`

```shell
$ hc-tools add-deploy-preview-script <product>
```

Adds a shell script in `./scripts/website-build.sh`, which is used to build deploy previews from hashicorp/dev-portal within a product repository so contributors can continue to preview their docs changes.

### `next-build-webpack-only`

```shell
$ hc-tools next-build-webpack-only
```

Executes `next build` and short-circuits the process before static generation occurs. Helpful for more performant builds if all we care about is the compilation output (for bundle analysis, for example).

### `rewrite-internal-redirects`

```shell
$ hc-tools rewrite-internal-redirects <product>
```

Detects and rewrites links which point at redirects defined in a `redirects.js` file in the current working directory. Redirects are assumed to be defined for a Next.js application.
