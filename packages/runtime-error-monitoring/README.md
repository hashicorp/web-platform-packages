# `@hashicorp/platform-runtime-error-monitoring`

Utilities and tools for handling and reporting on runtime errors.

## Bugsnag Configuration

It's nice and easy to set up Bugsnag with the central config in nextjs-scripts. To pull down and initialize the client, you can import it as such:

```js
import Bugsnag from '@hashicorp/platform-runtime-error-monitoring'
```

Just make sure that you have defined `BUGSNAG_CLIENT_KEY` and `BUGSNAG_SERVER_KEY` as environment variables. It requires two keys because nextjs can render javascript on the client and server, and will interact with the service differently depending on the environment. The first time this import runs, the client will be initialized.

If you want to just pull down the `ErrorBoundary` component, this can be imported directly as such:

```js
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
```
