const products = [
  'packer',
  'terraform',
  'vault',
  'boundary',
  'consul',
  'nomad',
  'waypoint',
  'vagrant',
] as const

type Products = typeof products[number]

export const getProductIntentFromURL = (url: string): Products | null => {
  if (!url || typeof url !== 'string') {
    return null
  }
  let productIntent = null
  try {
    // The URL is an absolute URL. Check if the hostname
    // or pathname includes a product name.
    const _url = new URL(url)
    products.forEach((product) => {
      if (_url.hostname.includes(product)) {
        productIntent = product
      }
    })

    _url.pathname.split('/').forEach((path) => {
      if (products.includes(path)) {
        productIntent = path
      }
    })
  } catch (e) {
    // The URL is relative. Check if the pathname includes
    // a product name.
    url.split('/').forEach((path) => {
      if (products.includes(path)) {
        productIntent = path
      }
    })
  }
  return productIntent
}
