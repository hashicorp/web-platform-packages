const { getProductIntentFromURL } = require('./')

describe('getProductIntentFromURL', () => {
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
  })
})
