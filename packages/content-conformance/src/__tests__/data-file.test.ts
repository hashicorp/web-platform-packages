/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { DataFile } from '../data-file.js'

const fixture = {
  title: 'Section',
  routes: [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
  ],
}

describe('DataFile', () => {
  test('parses JSON', () => {
    const file = new DataFile({
      value: JSON.stringify(fixture),
      path: '/nav.json',
    })

    expect(file.contents()).toEqual(fixture)
  })

  test('parses YAML', () => {
    const file = new DataFile({
      value: `title: Section
routes:
  - title: Home
    path: /
  - title: About
    path: /about
  `,
      path: '/nav.yaml',
    })

    expect(file.contents()).toEqual(fixture)
  })

  test('parsed object is immutable', () => {
    const file = new DataFile({
      value: JSON.stringify(fixture),
      path: '/nav.json',
    })

    expect(() => {
      // @ts-expect-error -- the type is marked as Readonly, but this validates runtime behavior as well
      file.contents().title = 'Home updated'
    }).toThrowErrorMatchingInlineSnapshot(`"Unable to modify object"`)
  })
})
