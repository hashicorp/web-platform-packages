/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class IntegrationReleaseComponentsService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Integration Release Components
   * Get all components for a specific integration release
   * @param product
   * @param integration
   * @returns any OK
   * @throws ApiError
   */
  public getProductsIntegrationsReleasesComponents(
    product: string,
    integration: string
  ): CancelablePromise<{
    meta: {
      status_code: 200
      status_text: 'OK'
    }
    result: Array<{
      id: string
      created_at: string
      updated_at: string
      readme: string | null
      integration_release_id: string
      component: {
        id: string
        created_at: string
        updated_at: string
        slug: string
        name: string
        plural_name: string
        product_id: string
      }
      variable_groups: Array<{
        id: string
        created_at: string
        updated_at: string
        variable_group_config_id: string
        integration_release_component_id: string
      }>
    }>
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/{product}/integrations/{integration}/releases/{release}/components',
      path: {
        product: product,
        integration: integration,
      },
    })
  }

  /**
   * Create Integration Release Component
   * Create a new component for a specific integration release.
   * @param product
   * @param integration
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public postProductsIntegrationsReleasesComponents(
    product: string,
    integration: string,
    requestBody?: {
      component_id: string
      readme?: string
    }
  ): CancelablePromise<{
    meta: {
      status_code: 200
      status_text: 'OK'
    }
    result: Array<{
      id: string
      created_at: string
      updated_at: string
      readme: string | null
      integration_release_id: string
      component: {
        id: string
        created_at: string
        updated_at: string
        slug: string
        name: string
        plural_name: string
        product_id: string
      }
      variable_groups: Array<{
        id: string
        created_at: string
        updated_at: string
        variable_group_config_id: string
        integration_release_component_id: string
      }>
    }>
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products/{product}/integrations/{integration}/releases/{release}/components',
      path: {
        product: product,
        integration: integration,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
      },
    })
  }

  /**
   * Get Integration Release Component
   * Get a specific component for a specific integration release
   * @param product
   * @param integration
   * @param component
   * @returns any OK
   * @throws ApiError
   */
  public getProductsIntegrationsReleasesComponents1(
    product: string,
    integration: string,
    component: string
  ): CancelablePromise<{
    meta: {
      status_code: 200
      status_text: 'OK'
    }
    result: {
      id: string
      created_at: string
      updated_at: string
      readme: string | null
      integration_release_id: string
      component: {
        id: string
        created_at: string
        updated_at: string
        slug: string
        name: string
        plural_name: string
        product_id: string
      }
      variable_groups: Array<{
        id: string
        created_at: string
        updated_at: string
        variable_group_config_id: string
        integration_release_component_id: string
      }>
    }
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}',
      path: {
        product: product,
        integration: integration,
        component: component,
      },
      errors: {
        400: `Bad Request`,
      },
    })
  }

  /**
   * Update Integration Release Component
   * Update a specific component for a specific integration release.
   * @param product
   * @param integration
   * @param component
   * @param requestBody Patch Body
   * @returns any OK
   * @throws ApiError
   */
  public patchProductsIntegrationsReleasesComponents(
    product: string,
    integration: string,
    component: string,
    requestBody: {
      readme: string | null
    }
  ): CancelablePromise<{
    meta: {
      status_code: 200
      status_text: 'OK'
    }
    result: {
      id: string
      created_at: string
      updated_at: string
      readme: string | null
      integration_release_id: string
      component: {
        id: string
        created_at: string
        updated_at: string
        slug: string
        name: string
        plural_name: string
        product_id: string
      }
      variable_groups: Array<{
        id: string
        created_at: string
        updated_at: string
        variable_group_config_id: string
        integration_release_component_id: string
      }>
    }
  }> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}',
      path: {
        product: product,
        integration: integration,
        component: component,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
      },
    })
  }

  /**
   * Update Integration Release Component
   * Delete a specific component for a specific integration release.
   * @param product
   * @param integration
   * @param component
   * @returns any OK
   * @throws ApiError
   */
  public deleteProductsIntegrationsReleasesComponents(
    product: string,
    integration: string,
    component: string
  ): CancelablePromise<{
    meta: {
      status_code: 200
      status_text: 'OK'
    }
    result: {
      id: string
      created_at: string
      updated_at: string
      readme: string | null
      integration_release_id: string
      component: {
        id: string
        created_at: string
        updated_at: string
        slug: string
        name: string
        plural_name: string
        product_id: string
      }
      variable_groups: Array<{
        id: string
        created_at: string
        updated_at: string
        variable_group_config_id: string
        integration_release_component_id: string
      }>
    }
  }> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/products/{product}/integrations/{integration}/releases/{release}/components/{component}',
      path: {
        product: product,
        integration: integration,
        component: component,
      },
      errors: {
        400: `Bad Request`,
      },
    })
  }
}
