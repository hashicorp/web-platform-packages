import { getProductIntentFromURL } from '../get-product-intent-from-url'
import { getUTMParamsCaptureState } from '../utm-params-capture'

const destinations: string[] = [
  'portal.cloud.hashicorp.com',
  'app.terraform.io',
]
const containsDestination = (str: string): boolean =>
  destinations.some(function (destination) {
    return str.indexOf(destination) >= 0
  })

export function addCloudLinkHandler() {
  if (typeof window === 'undefined') return

  window.addEventListener('click', (event) => {
    /**
     * Current <Button /> component implementation wraps the
     * inner button elements within a <span /> which requires us
     * to traverse up the dom to the closest anchor tag.
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath}
     */
    const composedPath = event.composedPath()

    composedPath.forEach((path: EventTarget) => {
      if (
        path &&
        (path as HTMLElement).nodeName === 'A' &&
        containsDestination((path as HTMLAnchorElement).href)
      ) {
        event.preventDefault()
        const productIntent = getProductIntentFromURL()
        const searchParams = {
          ...getUTMParamsCaptureState(),
          ...(productIntent && {
            product: productIntent,
          }),
        }
        try {
          const url = new URL((path as HTMLAnchorElement).href)
          location.href = `${url.origin}${
            Object.keys(searchParams).length > 0
              ? `?${new URLSearchParams(searchParams).toString()}`
              : ''
          }`
        } catch (error) {
          console.error(error)
        }
      }
    })
  })
}
