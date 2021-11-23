import path from 'path'
import { getHashicorpPackages } from './get-hashicorp-packages'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
