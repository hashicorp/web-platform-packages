/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

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

// Track if we've setup this handler already to prevent registering the handler
// multiple times.
let hasHandler = false

export function addCloudLinkHandler(
  callback?: (destinationUrl: string) => void
) {
  if (typeof window === 'undefined' || hasHandler) return

  window.addEventListener('click', (event) => {
    const linkElement = (event.target as HTMLElement).closest('a')
    if (linkElement && containsDestination(linkElement.href)) {
      event.preventDefault()
      const productIntent = getProductIntentFromURL()
      const forwardedSearchParams: Record<string, string> = {
        ...getUTMParamsCaptureState(),
        ...(productIntent && {
          product_intent: productIntent,
        }),
      }
      try {
        const url = new URL(linkElement.href)
        const urlSearchParams = url.searchParams
        urlSearchParams.forEach((value, key) => {
          if (!forwardedSearchParams.hasOwnProperty(key)) {
            forwardedSearchParams[key] = value
          }
        })
        const destinationUrl = `${url.origin}${url.pathname}${
          Object.keys(forwardedSearchParams).length > 0
            ? `?${new URLSearchParams(forwardedSearchParams).toString()}`
            : ''
        }`
        callback && callback(destinationUrl)
        if (
          linkElement.getAttribute('target') === '_blank' ||
          event.ctrlKey ||
          event.metaKey
        ) {
          window.open(destinationUrl, '_blank')
        } else {
          location.href = destinationUrl
        }
      } catch (error) {
        location.href = linkElement.href
        console.error(error)
      }
    }
  })

  hasHandler = true
}
