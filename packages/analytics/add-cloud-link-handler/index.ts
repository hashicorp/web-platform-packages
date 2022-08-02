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
      const searchParams = {
        ...getUTMParamsCaptureState(),
        ...(productIntent && {
          product: productIntent,
        }),
      }
      try {
        const url = new URL(linkElement.href)
        location.href = `${url.origin}${
          Object.keys(searchParams).length > 0
            ? `?${new URLSearchParams(searchParams).toString()}`
            : ''
        }`
      } catch (error) {
        location.href = linkElement.href
        console.error(error)
      }
    }
  })
}
