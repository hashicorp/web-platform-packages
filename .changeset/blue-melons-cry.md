---
'@hashicorp/integrations-hcl': minor
---

Adjusting the authoring interface to allow for multiple components of the same type. Introduces a component stanza to the integration configuration file that allows for `slug` and a `name` to be specified, as well as the integration `type` (which was what was previously specified in the string array).
