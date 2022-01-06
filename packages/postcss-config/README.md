# `@hashicorp/platform-postcss-config`

This package provides a shared PostCSS configuration that can be used in HashiCorp Next.js sites.

## Usage

Install the config package as a dev dependency:

```sh
npm install --save-dev @hashicorp/platform-postcss-config
```

Create a `postcss.config.js` file if it doesn't exist, and import the package.

```js
module.exports = {
  ...require('@hashicorp/platform-postcss-config'),
}
```
