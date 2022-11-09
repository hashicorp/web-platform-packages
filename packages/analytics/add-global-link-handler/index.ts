import { getProductIntentFromURL } from '../get-product-intent-from-url'
import { getUTMParamsCaptureState } from '../utm-params-capture'

const destinations: string[] = [
  'https://app.terraform.io',
  'https://boundaryproject.io',
  'https://cloud.hashicorp.com',
  'https://consul.io',
  'https://developer.hashicorp.com',
  'https://hashicorp.com',
  'https://nomadproject.io',
  'https://packer.io',
  'https://portal.cloud.hashicorp.com',
  'https://registry.terraform.io',
  'https://terraform.io',
  'https://vagrantup.com',
  'https://vaultproject.io',
  'https://waypointproject.io',
  'https://www.boundaryproject.io',
  'https://www.consul.io',
  'https://www.hashicorp.com',
  'https://www.nomadproject.io',
  'https://www.packer.io',
  'https://www.terraform.io',
  'https://www.vagrantup.com',
  'https://www.vaultproject.io',
  'https://www.waypointproject.io',
]

const containsDestination = (str: string): boolean =>
  destinations.some(function (destination) {
    return str.indexOf(destination) >= 0
  })

// Track if we've setup this handler already to prevent registering the handler
// multiple times.
let hasHandler = false

export function addGlobalLinkHandler(
  callback?: (destinationUrl: string) => void
) {
  if (typeof window === 'undefined' || hasHandler) return

  window.addEventListener('click', (event) => {
    const linkElement = (event.target as HTMLElement).closest('a')

    if (
      linkElement &&
      containsDestination(
        (linkElement as HTMLAnchorElement).attributes.getNamedItem('href')!
          .value
      )
    ) {
      const segmentAnonymousId = getSegmentAnonymousId()
      const productIntent = getProductIntentFromURL()
      const utmParams = getUTMParamsCaptureState()

      event.preventDefault()

      const url = new URL(linkElement.href)

      if (segmentAnonymousId) {
        url.searchParams.set('ajs_aid', segmentAnonymousId)
      }

      if (productIntent) {
        url.searchParams.set('product_intent', productIntent)
      }

      if (Object.keys(utmParams).length > 0) {
        for (const [key, value] of Object.entries(utmParams)) {
          url.searchParams.set(key, value)
        }
      }

      callback && callback(url.href)

      if (
        linkElement.getAttribute('target') === '_blank' ||
        event.ctrlKey ||
        event.metaKey
      ) {
        window.open(url.href, '_blank')
      } else {
        location.href = url.href
      }
    }
  })

  hasHandler = true
}

function getSegmentAnonymousId(): string | null {
  if (
    typeof window !== undefined &&
    window.analytics &&
    window.analytics.user &&
    typeof window.analytics.user === 'function'
  ) {
    return window.analytics.user().anonymousId()
  } else {
    return null
  }
}
