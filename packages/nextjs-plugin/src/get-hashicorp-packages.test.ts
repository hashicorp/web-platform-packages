/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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

  test('traverses up to the monorepo root', () => {
    expect(
      getHashicorpPackages(
        path.join(
          path.dirname(currentFilePath),
          '__fixtures__',
          'monorepo',
          'apps',
          'site'
        )
      )
    ).toMatchInlineSnapshot(`
      [
        "@hashicorp/platform-analytics",
        "@hashicorp/react-button",
        "@hashicorp/react-button/node_modules/@hashicorp/platform-product-meta",
      ]
    `)
  })
})
