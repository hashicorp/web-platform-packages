# `@hashicorp/platform-configs`

This package provides shared configuration files that can be used in HashiCorp projects.

## Available Config Files

### `tsconfig/next.json`

For Next.js applications, we have a shared configuration that sets important `compilerOptions` such as `"target": "es5"` and `"lib": ["dom", "dom.iterable", "esnext"]`. You can use this config by adding the following to your `tsconfig.json`:

```json
"extends": "@hashicorp/platform-configs/tsconfig/next.json"
```

### `prettier.config.js`

Add to your `prettier.config.js`

```js
module.exports = {
  ...require('@hashicorp/platform-configs/prettier.config.js'),
  // add additional configuration options here
}
```

### jest/config.js`

We expose a shared config built on Next.js's built-in jest configuration. To get started, add the following to your `jest.config.js`:

```js
const makeConfig = require('@hashicorp/platform-configs/jest/config.js')

module.exports = makeConfig({
  // The directory of your Next.js project, if applicable
  nextDir: './',
  // Any other custom jest config
  ...customJestConfig,
})
```

See the [Next.js docs](https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler) for more information.
