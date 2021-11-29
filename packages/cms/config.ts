// Return draft content from Dato app is in preview mode
// Default to production endpoint if undefined to avoid unexpectedly exposing draft content
let url = process.env.HASHI_DATO_ENVIRONMENT
  ? `https://graphql.datocms.com/environments/${process.env.HASHI_DATO_ENVIRONMENT}`
  : 'https://graphql.datocms.com'

if (process.env.HASHI_ENV === 'preview') url += '/preview'

const token = process.env.HASHI_DATO_TOKEN || '2f7896a6b4f1948af64900319aed60'

const config = {
  url,
  headers: { Authorization: token },
}

export default config
