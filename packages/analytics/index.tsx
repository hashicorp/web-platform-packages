import usePageviewAnalytics from './use-page-view-analytics'

export { default as useErrorPageAnalytics } from './use-error-page-analytics'
export { getProductIntentFromURL } from './get-product-intent-from-url'
export {
  initializeUTMParamsCapture,
  getUTMParamsCaptureState,
} from './utm-params-capture'
export { addCloudLinkHandler } from './add-cloud-link-handler'

export { addDevAnalyticsLogger } from './analytics-event-logger'

export * from './analytics-js-helpers'

/**
 * The default export here is for backwards compatibility
 */
export default usePageviewAnalytics
export { usePageviewAnalytics }
