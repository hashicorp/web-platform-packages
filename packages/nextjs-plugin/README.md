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
  dato: { token: 'xxx', environment: 'xxx' }, // if necessary, override the default datocms token/env with your own
  tipBranch: 'main', // configure a branch name for tip.project.io subdomain, to ensure "noindex" http header is set
  transpileModules: ['foo'], // third party package names that should be transpiled by babel
  nextOptimizedImages: true, // controls whether or not to integrate the next-optimized-images next plugin
})
```

All of these are optional, none are required to make `withHashicorp` function properly. In fact, we recommend not using any custom options unless you need to.

### Default Plugins and Enhancements

Out of the box, this plugin adds a couple useful utilities:

- [next-optimized-images](https://github.com/cyrilwanner/next-optimized-images)
- [next-bundle-analyzer](https://github.com/zeit/next.js/tree/canary/packages/next-bundle-analyzer)

These can both be used in any project implementing `@hashicorp/platform-nextjs-plugin` as described in their readmes.
