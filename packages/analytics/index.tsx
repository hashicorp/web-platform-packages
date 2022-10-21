import usePageviewAnalytics from './use-page-view-analytics'
import useErrorPageAnalytics from './use-error-page-analytics'
import { getProductIntentFromURL } from './get-product-intent-from-url'
import {
  initializeUTMParamsCapture,
  getUTMParamsCaptureState,
} from './utm-params-capture'
import { addCloudLinkHandler } from './add-cloud-link-handler'
import { addAnonymousIdHandler } from './add-anonymous-id-handler'

export default usePageviewAnalytics
export {
  usePageviewAnalytics,
  useErrorPageAnalytics,
  getProductIntentFromURL,
  initializeUTMParamsCapture,
  getUTMParamsCaptureState,
  addCloudLinkHandler,
  addAnonymousIdHandler,
}
