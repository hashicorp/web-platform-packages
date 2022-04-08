# `@hashicorp/platform-configs`

This package provides shared configuration files that can be used in HashiCorp projects.

## Available Config Files

### `tsconfig/next.json`

Add to your `tsconfig.json`:

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
