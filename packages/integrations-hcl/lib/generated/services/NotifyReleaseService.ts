/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Meta200 } from '../models/Meta200'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class NotifyReleaseService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Notify Release
   * Notify consumption scripts that an integration release has occurred
   * @param product
   * @param organization
   * @param integration
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public notifyRelease(
    product: string,
    organization: string,
    integration: string,
    requestBody?: {
      version: string
      sha: string
    }
  ): CancelablePromise<{
    meta: Meta200
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products/{product}/organizations/{organization}/integrations/{integration}/notify-release',
      path: {
        product: product,
        organization: organization,
        integration: integration,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
        401: `Unauthenticated`,
        500: `Internal Server Error`,
      },
    })
  }
}
