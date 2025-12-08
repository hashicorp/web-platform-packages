/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

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

type Product = typeof products[number]

/**
 * Based on a URL, return the first instance of a product name or HCP within
 * a URL else return null.
 * @example
 * // returns consul
 * getProductIntentFromURL('https://hashicorp.com/consul/docs')
 * @example
 * // returns waypoint
 * getProductIntentFromURL('https://developer.hashicorp.com/waypoint/tutorials/get-started-nomad/get-started-nomad')
 * @param {string} [url] defaults to window object if no URL is provided
 * @returns {string | null} A product name or null
 */
export const getProductIntentFromURL = (
  url?: string
): Product | 'hcp' | null => {
  if (!url && typeof window === 'undefined') {
    return null
  }
  const fromUrl = url || window.location.href.toString()
  const result: Partial<Record<Product, number>> = {}
  // Create an object of product names found
  // as keys with the index as the value.
  products.forEach((product) => {
    const index = fromUrl.indexOf(product)
    result[product] = index
  })
  // Capture the first index of a product name
  // found within the URL.
  const productIntent = (Object.entries(result) as [Product, number][])
    .filter(([_, index]) => index > -1)
    .sort((a, b) => a[1] - b[1])

  if (productIntent.length) {
    return productIntent[0][0]
  }

  if (fromUrl.includes('hcp')) {
    return 'hcp'
  }

  return null
}
