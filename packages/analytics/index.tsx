import usePageviewAnalytics from './use-page-view-analytics'
import { getProductIntentFromURL } from './get-product-intent-from-url'
import {
  initializeUTMParamsCapture,
  getUTMParamsCaptureState,
} from './utm-params-capture'
import { addCloudLinkHandler } from './add-cloud-link-handler'

export default usePageviewAnalytics
export {
  usePageviewAnalytics,
  getProductIntentFromURL,
  initializeUTMParamsCapture,
  getUTMParamsCaptureState,
  addCloudLinkHandler,
}
