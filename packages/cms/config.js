// Return draft content from Dato app is in preview mode
// Default to production endpoint if undefined to avoid unexpectedly exposing draft content
// https://www.datocms.com/docs/content-delivery-api/api-endpoints
const url = 'https://graphql.datocms.com'
const token = process.env.HASHI_DATO_TOKEN || '2f7896a6b4f1948af64900319aed60'
const isPreview = process.env.HASHI_ENV === 'preview'
const datoEnvironment = process.env.HASHI_DATO_ENVIRONMENT

module.exports = {
  url,
  headers: {
    Authorization: token,
    ...(isPreview && { 'X-Include-Drafts': 'true' }),
    ...(datoEnvironment && { 'X-Environment': datoEnvironment }),
  },
}
