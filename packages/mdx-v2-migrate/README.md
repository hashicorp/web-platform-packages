# `@hashicorp/mdx-v2-migrate`

Utility to migrate our MDX authored against v1 to be compatible with MDX v2. Tailored to how we author and structure MDX, may not be totally safe for all MDX v1 usages.

## Usage

By default, this will transform every single `.mdx` file found in the project. You can pass file filters as arguments to scope usage.

```shell
$ npx @hashicorp/mdx-v2-migrate [file1] [file2] [... fileN]
```
