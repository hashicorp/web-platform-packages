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

## Included scripts

### `add-deploy-preview-script`

```shell
$ hc-tools add-deploy-preview-script <product>
```

Adds a shell script in `./scripts/website-build.sh`, which is used to build deploy previews from hashicorp/dev-portal within a product repository so contributors can continue to preview their docs changes.
