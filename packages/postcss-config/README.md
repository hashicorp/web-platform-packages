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

## CSS Processing

This package configures a standard stack of PostCSS plugins, listed below:

- [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)
- [postcss-normalize](https://github.com/csstools/postcss-normalize)
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)
  - `stage` is set to `3`
  - `nesting-rules` is set to `true`
  - `custom-media-queries` loads in some [of our defaults](https://github.com/hashicorp/web-components/blob/master/packages/global-styles/custom-media.css) out of the box
  - `custom-properties` is set to false - we polyfill these for ie11 and do not compile them
