# HashiCorp Web Platform Packages

This monorepo contains a collection of packages which layer a number of configuration choices, code quality checks, and code generators on top of [Next.js](<[Next.js](https://nextjs.org/)>). Specifically, it provides:

- Baked in, zero-config typescript linting & prettier formatting via binary
- Code generators for base website templates, new pages, and new components via binary
- A pre-configured client for easily fetching from DatoCMS
- A strong set of default plugins, including:
  - mdx-processed markdown with front-matter and layouts
  - css files with pre-configured postcss-preset-env can be imported directly into components
  - graphql file loader
  - webpack bundle analyzer

## Packages

Current packages:

- [`@hashicorp/platform-cli`](/packages/cli)
- [`@hashicorp/platform-cms`](/packages/cms)
- [`@hashicorp/platform-code-highlighting`](/packages/code-highlighting)
- [`@hashicorp/platform-docs-mdx`](/packages/docs-mdx)
- [`@hashicorp/platform-markdown-utils`](/packages/markdown-utils)
- [`@hashicorp/platform-nextjs-plugin`](/packages/nextjs-plugin)
- [`@hashicorp/platform-product-meta`](/packages/product-meta)
- [`@hashicorp/platform-runtime-error-monitoring`](/packages/runtime-error-monitoring)
- [`@hashicorp/platform-types`](/packages/types)
- [`@hashicorp/platform-util`](/packages/util)

## Publishing

Publishing is handled through the [`changesets` library](https://github.com/atlassian/changesets). Publishing is done in CI if changes are found. For more information on how to work with changesets, see [this document](https://github.com/atlassian/changesets/blob/main/docs/adding-a-changeset.md).

### Adding a changeset

Run the following command and follow the prompt:

```
npx changeset
```

To make any adjustments to your changeset, just edit the file!

### Releases

The release process is handled mostly automatically via the changesets GitHub action. When changeset files get merged to `main`, a Pull Request is opened which will, upon merge, release all pending changesets and remove the changeset files. We should not need to publish manually with this flow. See the `changesets/action`(https://github.com/changesets/action) repo for more information.

### Prereleases

Prereleases are also handled through a process integrated into `changesets`. The full flow is outlined in [this document](https://github.com/atlassian/changesets/blob/main/docs/prereleases.md). To enter a prerelease mode for the `canary` tag, we would do something like this:

```
npx changeset pre enter canary
GITHUB_TOKEN=<your token> npx changeset version
GITHUB_TOKEN=<your token> npx changeset publish
```

To continue publishing preleases, use the `npx changeset` command like normal and use the `version` and `publish` commands as appropriate.
