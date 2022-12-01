import { ApiResponse, Method, request } from './standard-client'

export enum Product {
  TERRAFORM = 'terraform',
  VAULT = 'vault',
  NOMAD = 'nomad',
  CONSUL = 'consul',
  PACKER = 'packer',
  VAGRANT = 'vagrant',
  WAYPOINT = 'waypoint',
  BOUNDARY = 'boundary',
}

// ===========================
// ========== Flags ==========
// ===========================

export interface Flag {
  id: string
  slug: string
  name: string
  description: string
}

export async function fetchFlag(
  identifier: string
): Promise<ApiResponse<Flag>> {
  return request<Flag>(Method.GET, `/flags/${identifier}`)
}

// ================================
// ========== Components ==========
// ================================

export interface Component {
  id: string
  slug: string
  name: string
  plural_name: string
}

export async function fetchComponents(
  product: Product
): Promise<ApiResponse<Array<Component>>> {
  return request<Array<Component>>(
    Method.GET,
    `/products/${product}/components`
  )
}

export async function fetchComponent(
  product: Product,
  identifier: string
): Promise<ApiResponse<Component>> {
  return request<Component>(
    Method.GET,
    `/products/${product}/components/${identifier}`
  )
}

// ==================================
// ========== Integrations ==========
// ==================================

export enum Tier {
  OFFICIAL = 'official',
  PARTNER = 'partner',
  COMMUNITY = 'community',
}

interface NameSlugObj {
  id: string
  slug: Product
  name: string
}

export interface Integration {
  id: string
  name: string
  product: NameSlugObj
  description: string
  license_type?: string
  license_url?: string
  external_only: boolean
  external_url?: string
  slug: string
  tier: Tier
  repo_url: string
  subdirectory?: string
  hide_versions?: boolean
  versions: Array<string>
  components: Array<NameSlugObj>
  flags: Array<NameSlugObj>
}

export async function fetchIntegration(
  product: Product,
  identifier: string
): Promise<ApiResponse<Integration>> {
  return request<Integration>(
    Method.GET,
    `/products/${product}/integrations/${identifier}`
  )
}

export async function updateIntegration(
  product: Product,
  integration: Integration
): Promise<ApiResponse<Integration>> {
  return request<Integration>(
    Method.PATCH,
    `/products/${product}/integrations/${integration.id}`,
    {
      body: integration,
    }
  )
}

// ========================================
// ========== Release Components ==========
// ========================================

interface ReleaseComponent {
  id: string
  readme: string | null
  component_id: string
  integration_release_id: string
  component: Component
}

export async function fetchReleaseComponents(
  integration: Integration,
  releaseVersion: string
): Promise<ApiResponse<Array<ReleaseComponent>>> {
  return request<any>(
    Method.GET,
    `/products/${integration.product.id}/integrations/${integration.id}/releases/${releaseVersion}/components`
  )
}

interface ReleaseComponentPostBody {
  component_id: string
  readme?: string
}

export async function createReleaseComponent(
  integration: Integration,
  releaseVersion: string,
  body: ReleaseComponentPostBody
): Promise<ApiResponse<ReleaseComponent>> {
  return request<any>(
    Method.POST,
    `/products/${integration.product.id}/integrations/${integration.id}/releases/${releaseVersion}/components`,
    {
      body: body,
    }
  )
}

interface ReleaseComponentUpdateBody {
  readme?: string
}

export async function updateReleaseComponent(
  integration: Integration,
  releaseVersion: string,
  componentID: string,
  body: ReleaseComponentUpdateBody
): Promise<ApiResponse<ReleaseComponent>> {
  return request<any>(
    Method.PATCH,
    `/products/${integration.product.id}/integrations/${integration.id}/releases/${releaseVersion}/components/${componentID}`,
    {
      body: body,
    }
  )
}

export async function fetchReleaseComponent(
  integration: Integration,
  releaseVersion: string,
  componentID: string
): Promise<ApiResponse<any>> {
  return request<any>(
    Method.GET,
    `/products/${integration.product.id}/integrations/${integration.id}/releases/${releaseVersion}/components/${componentID}`
  )
}

export async function deleteReleaseComponent(
  integration: Integration,
  releaseVersion: string,
  componentID: string
): Promise<ApiResponse<any>> {
  return request<any>(
    Method.DELETE,
    `/products/${integration.product.id}/integrations/${integration.id}/releases/${releaseVersion}/components/${componentID}`
  )
}

// ===========================
// ========== Flags ==========
// ===========================

export async function addFlag(
  integration: Integration,
  flag: string
): Promise<ApiResponse<any>> {
  return request<any>(
    Method.POST,
    `/products/${integration.product.id}/integrations/${integration.id}/flags/${flag}`
  )
}

export async function deleteFlag(
  integration: Integration,
  flag: string
): Promise<ApiResponse<any>> {
  return request<any>(
    Method.DELETE,
    `/products/${integration.product.id}/integrations/${integration.id}/flags/${flag}`
  )
}

// ==============================
// ========== Releases ==========
// ==============================

export interface IntegrationRelease {
  version: string
  readme?: string
}

export async function getRelease(
  integration: Integration,
  version: string
): Promise<ApiResponse<IntegrationRelease>> {
  return request<IntegrationRelease>(
    Method.GET,
    `/products/${integration.product.id}/integrations/${integration.id}/releases/${version}`
  )
}

export async function createRelease(
  integration: Integration,
  release: IntegrationRelease
): Promise<ApiResponse<IntegrationRelease>> {
  return request<IntegrationRelease>(
    Method.POST,
    `/products/${integration.product.id}/integrations/${integration.id}/releases`,
    {
      body: release,
    }
  )
}

export async function updateRelease(
  integration: Integration,
  release: IntegrationRelease
): Promise<ApiResponse<IntegrationRelease>> {
  return request<IntegrationRelease>(
    Method.PATCH,
    `/products/${integration.product.id}/integrations/${integration.id}/releases/${release.version}`,
    {
      body: {
        readme: release.readme,
      },
    }
  )
}
