/** @jest-environment jsdom */
import { getProductIntentFromURL } from '.'

describe('getProductIntentFromURL', () => {
  let originalLocation

  beforeAll(() => {
    originalLocation = window.location
  })

  beforeEach(() => {
    delete window.location
    window.location = {
      // We use an absolute URL here since fetch in Jest can't use relative URLs
      origin: 'http://hashicorp.com',
      pathname: '/consul',
      href: 'http://hashicorp.com/consul',
    }
  })

  afterEach(() => {
    window.location = originalLocation
  })

  it('uses the window object when no url is defined', () => {
    expect(getProductIntentFromURL()).toBe('consul')
  })

  it('returns null if no product is found within the URL', () => {
    expect(getProductIntentFromURL('https://hashicorp.com')).toBe(null)
    expect(getProductIntentFromURL('https://cloud.hashicorp.com')).toBe(null)
  })

  it('returns the first product name found within a url', () => {
    expect(getProductIntentFromURL('https://hashicorp.com/consul')).toBe(
      'consul'
    )
    expect(
      getProductIntentFromURL(
        'https://developer.hashicorp.com/waypoint/tutorials/get-started-nomad/get-started-nomad'
      )
    ).toBe('waypoint')
    expect(getProductIntentFromURL('/consul/docs')).toBe('consul')
    expect(getProductIntentFromURL('https://consul.io')).toBe('consul')
    expect(
      getProductIntentFromURL(
        'https://learn.hashicorp.com/collections/packer/cloud-production'
      )
    ).toBe('packer')
  })

  it('handles HCP urls', () => {
    expect(getProductIntentFromURL('https://developer.hashicorp.com/hcp')).toBe(
      'hcp'
    )
    expect(
      getProductIntentFromURL(
        'https://developer.hashicorp.com/hcp/docs/terraform'
      )
    ).toBe('terraform')
  })
})
