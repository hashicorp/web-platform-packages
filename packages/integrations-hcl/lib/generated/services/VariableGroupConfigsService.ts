/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Meta200 } from '../models/Meta200'
import type { Meta201 } from '../models/Meta201'
import type { VariableGroupConfig } from '../models/VariableGroupConfig'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class VariableGroupConfigsService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Create a VariableGroupConfig
   * Create a VariableGroupConfig
   * @param product
   * @param requestBody
   * @returns any Created
   * @throws ApiError
   */
  public postProductsVariableGroupConfigs(
    product: string,
    requestBody?: {
      id: string
      name: string
      filename: string
      stanza: string
      display_order: number
    }
  ): CancelablePromise<{
    meta: Meta201
    result: Array<VariableGroupConfig>
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products/{product}/variable_group_configs',
      path: {
        product: product,
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
   * Fetch all VariableGroupConfigs
   * Fetch all VariableGroupConfigs
   * @param product
   * @param limit
   * @param after
   * @returns any OK
   * @throws ApiError
   */
  public getProductsVariableGroupConfigs(
    product: string,
    limit?: string,
    after?: string
  ): CancelablePromise<{
    meta: Meta200
    result: Array<VariableGroupConfig>
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/{product}/variable_group_configs',
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
   * Fetch a specific VariableGroupConfig
   * Fetch a specific VariableGroupConfig
   * @param product
   * @param variableGroupConfig
   * @returns any OK
   * @throws ApiError
   */
  public getProductsVariableGroupConfigs1(
    product: string,
    variableGroupConfig: string
  ): CancelablePromise<{
    meta: Meta200
    result: VariableGroupConfig
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/{product}/variable_group_configs/{variable_group_config}',
      path: {
        product: product,
        variable_group_config: variableGroupConfig,
      },
      errors: {
        404: `Not Found`,
      },
    })
  }

  /**
   * Update a VariableGroupConfig
   * Update a VariableGroupConfig
   * @param product
   * @param variableGroupConfig
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public patchProductsVariableGroupConfigs(
    product: string,
    variableGroupConfig: string,
    requestBody?: {
      name?: string
      filename?: string
      stanza?: string
      display_order?: number
    }
  ): CancelablePromise<{
    meta: Meta200
    result: VariableGroupConfig
  }> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/products/{product}/variable_group_configs/{variable_group_config}',
      path: {
        product: product,
        variable_group_config: variableGroupConfig,
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
   * Delete a VariableGroupConfig
   * Delete a VariableGroupConfig
   * @param product
   * @param variableGroupConfig
   * @returns any OK
   * @throws ApiError
   */
  public deleteProductsVariableGroupConfigs(
    product: string,
    variableGroupConfig: string
  ): CancelablePromise<{
    meta: Meta200
  }> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/products/{product}/variable_group_configs/{variable_group_config}',
      path: {
        product: product,
        variable_group_config: variableGroupConfig,
      },
      errors: {
        404: `Not Found`,
      },
    })
  }
}
