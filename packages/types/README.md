# `@hashicorp/platform-types`

Common, shared types for use across all web properties.

## Usage

Install the package as a `devDependency`:

```
npm install --save-dev @hashicorp/platform-types
```

Add a `global.d.ts` file at the root of your project:

```ts
/// <reference types="@hashicorp/platform-types" />
```

Ensure that `global.d.ts` is included in `tsconfig.json`

```jsonc
{
  // "compilerOptions":...
  "include": [ "global.d.ts", /* other types */ ],
  // "exclude": [...]
}
```
