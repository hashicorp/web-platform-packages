const destinations: string[] = [
  'https://app.terraform.io',
  'https://boundaryproject.io',
  'https://cloud.hashicorp.com',
  'https://consul.io',
  'https://hashicorp.com',
  'https://packer.io',
  'https://portal.cloud.hashicorp.com',
  'https://terraform.io',
  'https://vaultproject.io',
  'https://waypointproject.io',
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
    if (linkElement && containsDestination(linkElement.href)) {
      event.preventDefault()
      const url = new URL(linkElement.href)
      const ajs_uid = safeGetSegmentId()
      if (ajs_uid) {
        url.searchParams.append('ajs_uid', ajs_uid)
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

function safeGetSegmentId(): string | null {
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
