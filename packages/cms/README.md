# `@hashicorp/platform-cms`

A small set of utilities for working with DatoCMS within nextjs. There are currently two useful utilities in this package:

### Usage

The default import - an instance of [rivet](https://github.com/hashicorp/rivet-graphql) pre-configured with our Dato instance. See the rivet docs for more details on usage. It can generally be used as such within our apps:

```jsx
import rivetQuery from '@hashicorp/platform-cms'
import query from './query.graphql'

function MyComponent({ someProps }) {
  return <>{JSON.stringify(someProps)}</>
}

export async function getStaticProps() {
  const { someProps } = await rivetQuery(query)
  return { someProps }
}
```

### `@hashicorp/platform-cms/config`

Exposes the raw configuration needed to connect to HashiCorp's DatoCMS GraphQL API. Example:

```ts
import { url, headers } from '@hashicorp/platform-cms/config'
```

`url` is the graphql endpoint, and `headers` is an object containing a read-only authorization token needed to fetch data from the API.

It's also worth noting that there is some configurability here (the environent, and the token), if you pass any of the "dato" options in to the `@hashicorp/platform-base` nextjs plugin. It is presumed that you are using both together, since `platform-base` is a default for all of our apps.
