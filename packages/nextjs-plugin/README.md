# `@hashicorp/platform-nextjs-plugin`

A Next.js plugin with all of our default configuration, additional next plugins, custom webpack config, etc. This should be implemented by default for all of our web properties that are using Next.js.

## Usage

The plugin looks like this inside of your `next.config.js` file:

```js
const withHashicorp = require('@hashicorp/platform-nextjs-plugin')

module.exports = withHashicorp(/* options */)(/* normal nextjs config */)
```

Let's go through the full options:

```js
withHashicorp({
  css: {
    // array of postcss plugins
    plugins: [somePlugin(), otherPlugin()],
    // https://github.com/csstools/postcss-preset-env#options
    presetEnvOptions: { stage: 3 },
  },
  dato: { token: 'xxx', environment: 'xxx' }, // if necessary, override the default datocms token/env with your own
  tipBranch: 'main', // configure a branch name for tip.project.io subdomain, to ensure "noindex" http header is set
  transpileModules: ['foo'], // third party package names that should be transpiled by babel
})
```

All of these are optional, none are required to make `withHashicorp` function properly. In fact, we recommend not using any custom options unless you need to.

### Default Plugins and Enhancements

Out of the box, this plugin adds a couple useful utilities:

- [next-optimized-images](https://github.com/cyrilwanner/next-optimized-images)
- [next-bundle-analyzer](https://github.com/zeit/next.js/tree/canary/packages/next-bundle-analyzer)

These can both be used in any project implementing `@hashicorp/platform-nextjs-plugin` as described in their readmes.

### CSS Processing

`nextjs-plugin` configures a standard stack of postcss plugins, listed below:

- [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)
- [postcss-normalize](https://github.com/csstools/postcss-normalize)
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)
  - `stage` is set to `3`
  - `nesting-rules` is set to `true`
  - `custom-media-queries` loads in some [of our defaults](https://github.com/hashicorp/web-components/blob/master/packages/global-styles/custom-media.css) out of the box
  - `custom-properties` is set to false - we polyfill these for ie11 and do not compile them

If you'd like to add extra plugins before or after the stack, or change the options passed to `postcss-preset-env`, you can control this via the `css` options as such:

```js
withHashicorp({
  css: {
    beforePlugins: [plugin1, plugin2],
    afterPlugins: [plugin3],
    presetEnvOptions: { nesting: false },
  },
})(/* normal nextjs config */)
```
