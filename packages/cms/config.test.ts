import { jest } from '@jest/globals'
import config from './config'

test('returns the correct url based on the environment', async () => {
  // first we test the default url
  expect(config.url).toBe('https://graphql.datocms.com')

  // then we shim out the env to be preview and dynamically require the module
  // to simulate that it's being run in preview
  const oldEnv = process.env.HASHI_ENV
  jest.resetModules()
  process.env.HASHI_ENV = 'preview'
  const { default: prodConfig } = await import('./config')
  expect(prodConfig.url).toBe('https://graphql.datocms.com/preview')

  // finally we reset the HASHI_ENV for subsequent tests
  process.env.HASHI_ENV = oldEnv
})
