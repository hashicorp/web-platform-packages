/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnrichedIntegration } from '../models/EnrichedIntegration'
import type { Meta200 } from '../models/Meta200'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class IntegrationsService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Fetch All Integrations
   * Fetch all integration for a specific product
   * @param product
   * @param limit
   * @param after
   * @returns any OK
   * @throws ApiError
   */
  public fetchIntegrations(
    product: string,
    limit?: string,
    after?: string
  ): CancelablePromise<{
    meta: Meta200
    result: Array<EnrichedIntegration>
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/{product}/integrations',
      path: {
        product: product,
      },
      query: {
        limit: limit,
        after: after,
      },
    })
  }

  /**
   * Create Integration
   * Create an integration
   * @param product
   * @param organization
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public createIntegration(
    product: string,
    organization: string,
    requestBody?: {
      id?: string
      slug: string
      name?: string
      description?: string
      license_type?: string
      license_url?: string
      external_only?: boolean
      external_url?: string
      tier?: 'official' | 'partner' | 'community'
      repo_url?: string
      subdirectory?: string
      hide_versions?: boolean
      organization_id: string
    }
  ): CancelablePromise<{
    meta: Meta200
    result: EnrichedIntegration
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products/{product}/organizations/{organization}/integrations',
      path: {
        product: product,
        organization: organization,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
        409: `Conflict`,
      },
    })
  }

  /**
   * Get Integration
   * Fetch a specific integration
   * @param product
   * @param organization
   * @param integration
   * @returns any OK
   * @throws ApiError
   */
  public fetchIntegration(
    product: string,
    organization: string,
    integration: string
  ): CancelablePromise<{
    meta: Meta200
    result: EnrichedIntegration
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/{product}/organizations/{organization}/integrations/{integration}',
      path: {
        product: product,
        organization: organization,
        integration: integration,
      },
      errors: {
        404: `Not Found`,
      },
    })
  }

  /**
   * Update Integration
   * Update a specific integration
   * @param product
   * @param organization
   * @param integration
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public updateIntegration(
    product: string,
    organization: string,
    integration: string,
    requestBody?: {
      slug?: string
      name?: string | null
      description?: string | null
      license_type?: string | null
      license_url?: string | null
      external_only?: boolean
      external_url?: string | null
      hide_versions?: boolean | null
      tier?: 'official' | 'partner' | 'community'
      repo_url?: string | null
      subdirectory?: string | null
      organization_id?: string
    }
  ): CancelablePromise<{
    meta: Meta200
    result: EnrichedIntegration
  }> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/products/{product}/organizations/{organization}/integrations/{integration}',
      path: {
        product: product,
        organization: organization,
        integration: integration,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
        409: `Conflict`,
      },
    })
  }

  /**
   * Delete Integration
   * Delete a specific integration
   * @param product
   * @param organization
   * @param integration
   * @returns any OK
   * @throws ApiError
   */
  public deleteIntegration(
    product: string,
    organization: string,
    integration: string
  ): CancelablePromise<{
    meta: Meta200
  }> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/products/{product}/organizations/{organization}/integrations/{integration}',
      path: {
        product: product,
        organization: organization,
        integration: integration,
      },
    })
  }
}
