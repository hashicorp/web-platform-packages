import rivet from 'rivet-graphql'
import config from './config'

const instance = rivet(config.url, {
  headers: config.headers,
  retryCount: 3,
})
const client = instance.client

export default instance
export { client }
