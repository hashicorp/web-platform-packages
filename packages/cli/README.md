# `@hashicorp/platform-cli`

Exposes a CLI as `next-hashicorp` with common tasks, such as linting, testing, and formatting.

## Usage

Generally, we recommend using npx or a local install and npm scripts to run the binary, rather than installing globally.

### Linting & Formatting

`@hashicorp/platform-cli` provides centrally managed, pre-configured ESLint and Prettier tasks which can be executed via `next-hashicorp lint` and `next-hashicorp format` respectively. We recommend installing locally and running them as npm tasks. We prefer to run both of these tasks before any commit can be made -- if you share that preference, you can execute both using the command `next-hashicorp precommit`.

Both the `lint` and `format` commands default to running over every file they are able to process, recursively, starting with the root of the project where you run the command. If you'd like to scope them to a specific set of files, any number of file paths or globs can be provided as an argument. For example:

```shell
$ next-hashicorp format pages/**/*.jsx lib/config.json
```

If you would like to change the configuration or use a different configuration for any of these tasks, we'd recommend forking the project and changing it to match your preferences. The purpose of a controlled, centralized config is to ensure that all projects that implement it are consistent, and allowing per-project config changes eliminates this benefit.

### Stylelint Configuration

`next-hashicorp` configures the following Stylelint plugins, listed below:

- **stylelint-config-standard** with **stylelint-config-prettier** to skip prettier-managed rules.
- **stylelint-media-use-custom-media** to enforce usage of known custom media queries.
- **stylelint-value-no-unknown-custom-properties** to enforce usage of known custom properties.
- **stylelint-order** to alphabetize style declarations.
- **stylelint-use-nesting** to enforce proper CSS nesting.

You can modify the Stylelint configuration in your local `stylelintrc.js` file.

```js
// .stylelintrc.js with configured rules of custom media and custom properties.
module.exports = {
  ...require('@hashicorp/platform-cli/config/.stylelintrc.js'),
  rules: {
    'csstools/media-use-custom-media': [
      'known',
      {
        importFrom: [
          './node_modules/@hashicorp/react-global-styles/custom-media.css',
        ],
      },
    ],
    'csstools/value-no-unknown-custom-properties': [
      true,
      {
        importFrom: [
          './node_modules/@hashicorp/react-global-styles/custom-properties/color.css',
          './node_modules/@hashicorp/react-global-styles/custom-properties/font.css',
        ],
      },
    ],
  },
}
```

### Generators

`next-hashicorp` also provides a few generators that can provision templates for common assets. At the moment, this includes:

- `next-hashicorp generate website` - creates a new, bare-bones website template that idiomatically implements next-hashicorp tooling
- `next-hashicorp generate component` - creates a new component template in your `components` folder
- `next-hashicorp generate page` - creates a new page template in your `pages` folder

After running these commands, you will be asked a couple questions, then your files will be generated.

### Markdown Blocks

Many of our websites share common sections in their readmes which describe, for example, our custom markdown configuration, or how to start the server. It is much easier to keep these sections up to date in one central location than to try to maintain parity via copy-pasting across 10+ properties. This is the purpose of the `markdown-blocks` command, which allows centrally located blocks of markdown to be rendered into readme files. Here's how it works with the markdown - you add a comment in the following format to specify a block section:

```md
Some text, etc...

<!-- BEGIN: block-name -->
<!-- END: block-name -->

More text
```

Now make sure `block-name` is a file within the `/markdown-blocks` folder in this project. If that is all set, you can run `next-hashicorp markdown-blocks path/to/readme.md` and it will parse the file and place the most recent version of any given block in its zone. Here's how the final output might look:

```md
Some text, etc...

<!-- BEGIN: block-name -->
<!-- Generated text, do not edit directly -->

Contents of the `markdown-blocks/block-name.md` file will go here!

<!-- END: block-name -->

More text
```

If the content in the markdown block file needs to update, updating it and running the same command as above will ensure that the block area in the readme is using the latest content, but only when the command has been run. It should generate a clean diff wherever it's updated. The intent here is to ensure that when updates need to be made to common, shared readme sections, they can be made in one place and applied with a short, simple command in any place that uses them.

Blocks may have any valid markdown content, and cannot be nested within each other. A clear error will be thrown if a block is not found, is misspelled, or is nested.

### GraphiQL

We provide a handy bin command that opens up [Dato's in-browser GraphiQL IDE](https://cda-explorer.datocms.com/) in your default browser. The URL to this IDE can be a bit annoying to track down because you need to have your API Token handy but since `next-hashicorp` hangs on to this, we can avoid that step.

```
next-hashicorp graphiql
```

If you're unfamiliar with what GraphiQL provides you, please have a look at the [GraphiQL repo](https://github.com/graphql/graphiql).

## Configs

We also expose some default configuration files for common tools, such as ESLint, lint-staged, stylelint, and tsconfig. See the `/config` directory for what base configs are currently exposed.
