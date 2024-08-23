import * as React from 'react'
import s from './style.module.css'

interface ProductMeta {
  name: string
  slug: string
  themeClass?: string
}

export const products = [
  'hashicorp',
  'boundary',
  'consul',
  'nomad',
  'packer',
  'terraform',
  'vault',
  'vaultRadar',
  'vaultSecrets',
  'vagrant',
  'waypoint',
] as const

export type Products = (typeof products)[number]

type ISlugToDisplayNameMap = {
  [Property in Products]: string
}

const slugToDisplayNameMap: ISlugToDisplayNameMap = {
  hashicorp: 'Hashicorp',
  boundary: 'Boundary',
  consul: 'Consul',
  nomad: 'Nomad',
  packer: 'Packer',
  terraform: 'Terraform',
  vault: 'Vault',
  vaultRadar: 'Vault Radar',
  vaultSecrets: 'Vault Secrets',
  vagrant: 'Vagrant',
  waypoint: 'Waypoint',
}

const DEFAULT: ProductMeta = {
  name: 'Hashicorp',
  slug: 'hashicorp',
}

const ProductContext = React.createContext<ProductMeta>(DEFAULT)

/**
 * fn `useProductMeta` is designed to work both within and outside of a Product Context.
 * Components can pass a product name directly and get metadata outside of context,
 * or they can set the 'product' higher up in the tree via `ProductMetaProvider`, call
 * `useProductMeta` without passing a product argument, context will provide the correct metadata.
 *  */
function useProductMeta(_product?: Products): ProductMeta {
  const product = _product?.toLowerCase()
  const ctx = React.useContext(ProductContext) ?? DEFAULT
  const slug = product ?? ctx.slug
  const name = product ? slugToDisplayNameMap[product] : ctx.name
  const themeClass = product ? s[product] : ctx.themeClass // class resets base `brand` css variables per theme

  if (process.env.NODE_ENV !== 'production' && !ctx && !product) {
    console.warn(
      '@hashicorp/platform-product-meta: No product context or product prop detected, HashiCorp theme & product defaults will apply.'
    )
  }

  return { name, slug, themeClass }
}

interface withProductProps {
  product?: Products
}

function withProductMeta<T extends withProductProps>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function _withProductMeta(props: T) {
    const meta: ProductMeta = useProductMeta(props.product)
    return <Component {...props} product={meta} /> // product prop is overridden
  }
}

interface ProductProviderProps {
  product: Products
  children: React.ReactNode
}

const ProductMetaProvider = React.memo(function Provider({
  product,
  children,
}: ProductProviderProps) {
  const ctxValue = useProductMeta(product)
  return (
    <ProductContext.Provider value={ctxValue}>
      {children}
    </ProductContext.Provider>
  )
})

export default useProductMeta
export type { Products, ProductMeta }
export { ProductContext, ProductMetaProvider, withProductMeta }
