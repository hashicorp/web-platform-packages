# `@hashicorp/integrations-hcl`

This contains reused HCL validation logic for `integrations` and `integration-release-action`

## Generating the API Client

An `IntegrationsAPI` TypeScript Client can be generated from our
OpenAPI spec.

- This uses the https://github.com/ferdikoomen/openapi-typescript-codegen project

Example:

```bash
# From the web-platform-packages monorepo root
npx -p openapi-typescript-codegen openapi \
  --input ../integrations-api/src/spec/api-docs.json \
  --output ./packages/integrations-hcl/lib/generated \
  --client node \
  --name IntegrationsAPI
```

Usage:

```typescript
import { IntegrationsAPI } from './lib/generated'

const client = new IntegrationsAPI({
  BASE: process.env.INPUT_INTEGRATIONS_API_BASE_URL,
})

// response is fully typed
// {
//     meta: Meta200;
//     result: EnrichedIntegration;
// }
const response = await client.integrations.getProductsIntegrations1(
  productSlug,
  integrationSlug
)
```
