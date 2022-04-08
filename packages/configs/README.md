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
