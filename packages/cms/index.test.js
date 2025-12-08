/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

const rivet = require('./')
const config = require('./config')

test('configuration is passed into rivet correctly', () => {
  expect(rivet.client.url).toBe(config.url)
  expect(rivet.client.options.headers['Authorization']).toBe(
    config.headers['Authorization']
  )
})
