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
    const linkElement = (event.target as HTMLElement).closest('a')
    if (linkElement && containsDestination(linkElement.href)) {
      event.preventDefault()
      const productIntent = getProductIntentFromURL()
      const forwardedSearchParams: Record<string, string> = {
        ...getUTMParamsCaptureState(),
        ...(productIntent && {
          product: productIntent,
        }),
      }
      try {
        const url = new URL(linkElement.href)
        const urlSearchParams = url.searchParams
        for (const key of urlSearchParams.keys()) {
          if (!forwardedSearchParams.hasOwnProperty(key)) {
            forwardedSearchParams[key] = urlSearchParams.get(key)!
          }
        }
        location.href = `${url.origin}${
          Object.keys(forwardedSearchParams).length > 0
            ? `?${new URLSearchParams(forwardedSearchParams).toString()}`
            : ''
        }`
      } catch (error) {
        location.href = linkElement.href
        console.error(error)
      }
    }
  })
}
