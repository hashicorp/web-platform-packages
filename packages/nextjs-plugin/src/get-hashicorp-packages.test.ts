import path from 'path'
import url from 'url'
import { getHashicorpPackages } from './get-hashicorp-packages'

const currentFilePath = url.fileURLToPath(new URL(import.meta.url))

describe('getHashicorpPackages', () => {
  test('gets all nested @hashicorp packages', () => {
    expect(
      getHashicorpPackages(
        path.join(path.dirname(currentFilePath), '__fixtures__', 'basic')
      )
    ).toMatchInlineSnapshot(`
      [
        "@hashicorp/react-button",
        "@hashicorp/react-package",
        "@hashicorp/react-package/node_modules/@hashicorp/react-nested",
        "@hashicorp/versioned-docs",
      ]
    `)
  })

  test('includes packages from package.json dependencies', () => {
    expect(
      getHashicorpPackages(
        path.join(path.dirname(currentFilePath), '__fixtures__', 'package-json')
      )
    ).toMatchInlineSnapshot(`
      [
        "@hashicorp/platform-analytics",
      ]
    `)
  })
})
