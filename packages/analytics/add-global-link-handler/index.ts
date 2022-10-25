const destinations: string[] = [
  'hashicorp.com',
  'terraform.io',
  'consul.io',
  'vaultproject.io',
  'waypointproject.io',
  'packer.io',
  'boundaryproject.io',
]

const containsDestination = (str: string): boolean =>
  destinations.some(function (destination) {
    return str.indexOf(destination) >= 0
  })

export function addGlobalLinkHandler() {
  if (typeof window === 'undefined') return

  window.addEventListener('click', (event) => {
    const linkElement = (event.target as HTMLElement).closest('a')
    if (
      linkElement &&
      containsDestination(linkElement.href) &&
      isValidUrl(linkElement.href)
    ) {
      event.preventDefault()
      const url = new URL(linkElement.href)
      const ajs_uid = safeGetSegmentId()
      if (ajs_uid) {
        url.searchParams.append('ajs_uid', ajs_uid)
      }
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
}

function isValidUrl(url: string): boolean {
  try {
    return Boolean(new URL(url))
  } catch (e) {
    return false
  }
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
