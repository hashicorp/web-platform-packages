/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import Cookies from 'js-cookie'

interface GeoInformation {
  country?: string | null
  region?: string | null
}

// Note: also declared in packages/edge-utils/lib/set-geo-cookie.ts
const GEO_COOKIE_NAME = 'hc_geo'

// This value is only set via our edge middleware and should be safely global for the life of a session
let geoInformation: GeoInformation | undefined

/**
 * If not already done, parses the hc_geo cookie and returns its value.
 *
 * Example parsed object:
 * ```
 * { country: 'US', region: 'MN' }
 * ```
 */
export function getGeoInformation(): GeoInformation {
  if (typeof window === 'undefined') {
    return {}
  }

  if (!geoInformation) {
    // The cookie value looks like country={country},region={region}
    const cookieValue = Cookies.get(GEO_COOKIE_NAME)

    if (cookieValue) {
      geoInformation = Object.fromEntries(
        cookieValue.split(',').map((piece: string) => {
          // here we have a string like country={country}, so we split on =
          const [key, value] = piece.split('=')
          // parse the value to ensure we don't get the string literal 'null', for example
          return [key, value === 'null' ? null : value]
        })
      ) as GeoInformation
    } else {
      geoInformation = {}
    }
  }

  return geoInformation
}

export function isInUS() {
  return getGeoInformation().country === 'US'
}

/**
 * Intended to be used for testing, resets the geoInformation value in memory to validate the setting logic
 */
export function __test__resetGeoInformation() {
  geoInformation = undefined
}
