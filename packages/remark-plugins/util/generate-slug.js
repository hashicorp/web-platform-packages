export function generateSlug(headline, links = []) {
  let slug = headline
    .toLowerCase()
    .trim()
    .replace(/<\/?[^>]*>/g, '') // Strip links
    .replace(/\(\(#.*?\)\)/g, '') // Strip anchor link aliases
    .replace(/\W+/g, '-') // Whitespace to '-'
    .replace(/-+/g, '-') // Collapse more than one '-'
    .replace(/^-/g, '') // Remove leading '-'
    .replace(/-$/g, '') // Remove trailing '-'

  // count if there are any duplicates on the page
  const dupeCount = links.reduce((m, i) => {
    if (slug === i) m++
    return m
  }, 0)
  links.push(slug)

  // append the count to the end of the slug if necessary
  if (dupeCount > 0) slug = `${slug}-${dupeCount}`

  return slug
}

export function generateAriaLabel(headline) {
  return headline
    .toLowerCase()
    .replace(/<\/?[^>]*>/g, '') // Strip html
    .replace(/\(\(#.*?\)\)/g, '') // Strip anchor link aliases
    .replace(/^-/g, '') // Remove leading '-'
    .replace(/-$/g, '') // Remove trailing '-'
    .replace(/\W+/g, ' ') // Collapse whitespace
    .trim()
}
