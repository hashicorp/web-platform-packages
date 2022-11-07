/**
 * @jest-environment jsdom
 */
import Cookies from 'js-cookie'
import { getGeoInformation, __test__resetGeoInformation } from '..'

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}))

describe('getGeoInformation', () => {
  afterEach(() => {
    __test__resetGeoInformation()
  })

  test('parses cookie', () => {
    ;(Cookies.get as jest.Mock).mockReturnValueOnce('country=US,region=MN')

    expect(getGeoInformation()).toMatchInlineSnapshot(`
      {
        "country": "US",
        "region": "MN",
      }
    `)
  })

  test('handles no cookie', () => {
    ;(Cookies.get as jest.Mock).mockReturnValueOnce('')

    expect(getGeoInformation()).toMatchInlineSnapshot(`{}`)
  })

  test('handles null', () => {
    ;(Cookies.get as jest.Mock).mockReturnValueOnce('country=US,region=null')

    expect(getGeoInformation()).toMatchInlineSnapshot(`
      {
        "country": "US",
        "region": null,
      }
    `)
  })
})
