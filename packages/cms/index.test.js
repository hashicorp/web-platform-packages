const rivet = require('./')
const config = require('./config')

test('configuration is passed into rivet correctly', () => {
  expect(rivet.client.url).toBe(config.url)
  expect(rivet.client.requestConfig.headers['Authorization']).toBe(
    config.headers['Authorization']
  )
})
