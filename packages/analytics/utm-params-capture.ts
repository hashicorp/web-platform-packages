import Cookies from 'js-cookie'

const UTM_ALLOW_LIST = [
  'utm_source',
  'utm_offer',
  'utm_medium',
  'utm_campaign',
] as const
type UTMKeys = typeof UTM_ALLOW_LIST[number]
type UTMParams = Partial<Record<UTMKeys, string>>
const utmParamsState: UTMParams = {}

export function initializeUTMParamsCapture() {
  if (typeof window === 'undefined') {
    return
  }
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.forEach((value: string, key: string) => {
    if (UTM_ALLOW_LIST.includes(key as UTMKeys)) {
      Cookies.set(key, value, { expires: 30 })
    }
  })

  UTM_ALLOW_LIST.forEach((key: UTMKeys) => {
    const keyFromCookie = Cookies.get(key)
    if (keyFromCookie) {
      utmParamsState[key] = keyFromCookie
    }
  })
}

export function getUTMParamsCaptureState() {
  return utmParamsState
}
