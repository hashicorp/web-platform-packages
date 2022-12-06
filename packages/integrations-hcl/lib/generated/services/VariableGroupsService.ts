/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnrichedVariableGroup } from '../models/EnrichedVariableGroup'
import type { Meta200 } from '../models/Meta200'
import type { Meta201 } from '../models/Meta201'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class VariableGroupsService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Create a Variable Group
   * Create a Variable Group
   * @param product
   * @param integration
   * @param release
   * @param component
   * @param requestBody
   * @returns any Created
   * @throws ApiError
   */
  public postProductsIntegrationsReleasesComponentsVariableGroups(
    product: string,
    integration: string,
    release: string,
    component: string,
    requestBody?: {
      variable_group_config_id: string
    }
  ): CancelablePromise<{
    meta: Meta201
    result: EnrichedVariableGroup
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}/variable_groups',
      path: {
        product: product,
        integration: integration,
        release: release,
        component: component,
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
   * Fetch all Variable Groups
   * Fetch all Variable Groups
   * @param product
   * @param integration
   * @param release
   * @param component
   * @returns any OK
   * @throws ApiError
   */
  public getProductsIntegrationsReleasesComponentsVariableGroups(
    product: string,
    integration: string,
    release: string,
    component: string
  ): CancelablePromise<{
    meta: Meta200
    result: Array<EnrichedVariableGroup>
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}/variable_groups',
      path: {
        product: product,
        integration: integration,
        release: release,
        component: component,
      },
    })
  }

  /**
   * Fetch a specific Variable Group
   * Fetch a specific Variable Group
   * @param product
   * @param integration
   * @param release
   * @param component
   * @param variableGroup
   * @returns any OK
   * @throws ApiError
   */
  public getProductsIntegrationsReleasesComponentsVariableGroups1(
    product: string,
    integration: string,
    release: string,
    component: string,
    variableGroup: string
  ): CancelablePromise<{
    meta: Meta200
    result: EnrichedVariableGroup
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}/variable_groups/{variable_group}',
      path: {
        product: product,
        integration: integration,
        release: release,
        component: component,
        variable_group: variableGroup,
      },
      errors: {
        404: `Not Found`,
      },
    })
  }

  /**
   * Delete a specific Variable Group
   * Delete a specific Variable Group
   * @param product
   * @param integration
   * @param release
   * @param component
   * @param variableGroup
   * @returns any OK
   * @throws ApiError
   */
  public deleteProductsIntegrationsReleasesComponentsVariableGroups(
    product: string,
    integration: string,
    release: string,
    component: string,
    variableGroup: string
  ): CancelablePromise<{
    meta: Meta200
  }> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}/variable_groups/{variable_group}',
      path: {
        product: product,
        integration: integration,
        release: release,
        component: component,
        variable_group: variableGroup,
      },
      errors: {
        404: `Not Found`,
      },
    })
  }
}
