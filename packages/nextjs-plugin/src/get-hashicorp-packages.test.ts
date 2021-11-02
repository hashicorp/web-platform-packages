import path from 'path'
import { getHashicorpPackages } from './get-hashicorp-packages'

describe('getHashicorpPackages', () => {
  test('gets all nested @hashicorp packages', () => {
    expect(getHashicorpPackages(path.join(__dirname, '__fixtures__')))
      .toMatchInlineSnapshot(`
      Array [
        "@hashicorp/react-button",
        "@hashicorp/react-package",
        "@hashicorp/react-package/node_modules/@hashicorp/react-nested",
        "@hashicorp/versioned-docs",
      ]
    `)
  })
})
