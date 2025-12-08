/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const GEO_COOKIE_NAME = 'hc_geo'
const GEO_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

// Return a string, of the format country={country},region={region}, to be set in our geo cookie
function getGeoCookieValueFromRequest(request: NextRequest) {
  const { geo } = request

  const country = geo?.country ?? null
  const region = geo?.region ?? null

  return `country=${country},region=${region}`
}

// Try to detect the stable middleware cookie API so that this utility can be backwards compatible
function isStableMiddleware(response: NextResponse): boolean {
  return typeof response.cookies.set !== 'undefined'
}

export default function setGeoCookie(
  request: NextRequest,
  response?: NextResponse
): NextResponse {
  const resultResponse = response ?? NextResponse.next()

  const cookieValue = getGeoCookieValueFromRequest(request)

  if (isStableMiddleware(resultResponse)) {
    // use the stable middleware cookie API, requires next >= 12.2
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - support both the stable and unstable cookie APIs
    resultResponse?.cookies.set(GEO_COOKIE_NAME, cookieValue, {
      maxAge: GEO_COOKIE_MAX_AGE_SECONDS,
    })
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - we're using the latest next types, but supporting the previous API as well
    resultResponse.cookie(GEO_COOKIE_NAME, cookieValue, {
      maxAge: GEO_COOKIE_MAX_AGE_SECONDS * 1000,
    })
  }

  return resultResponse
}
