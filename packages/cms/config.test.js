const config = require('./config')
const withHashicorp = require('@hashicorp/platform-nextjs-plugin')

test('returns the correct url based on the environment', async () => {
  // first we test the default url
  expect(config.url).toBe('https://graphql.datocms.com')

  // then we shim out the env to be preview and dynamically require the module
  // to simulate that it's being run in preview
  const oldEnv = process.env.HASHI_ENV
  jest.resetModules()
  process.env.HASHI_ENV = 'preview'
  const prodConfig = await require('./config')
  expect(prodConfig.headers['X-Include-Drafts']).toBe('true')

  // finally we reset the HASHI_ENV for subsequent tests
  process.env.HASHI_ENV = oldEnv
})

// this would require an integration test, since nextjs internals set this variable now
test.skip('returns the correct dato token based on withHashicorp options', () => {
  const testToken = '12345'
  withHashicorp({ dato: { token: testToken } })()
  jest.resetModules()
  const clientConfig = require('./config')
  expect(clientConfig.headers.Authorization).toBe(testToken)
})
