import path from 'path'
import fs from 'fs'
import readdirp from 'readdirp'
import * as pathToRegexp from 'path-to-regexp'
import remark from 'remark'
import remarkMdx from 'remark-mdx'
import remarkFrontmatter from 'remark-frontmatter'
import is from 'unist-util-is'
import visit from 'unist-util-visit'

const cwd = process.cwd()

export const PRODUCT_DOMAIN_MAP = {
  vault: 'vaultproject.io',
  terraform: 'terraform.io',
  consul: 'consul.io',
  vagrant: 'vagrantup.com',
  nomad: 'nomadproject.io',
  waypoint: 'waypointproject.io',
  cloud: 'cloud.hashicorp.com',
  packer: 'packer.io',
  boundary: 'boundaryproject.io',
  sentinel: 'docs.hashicorp.com',
} as const

/**
 * Determines if the given URL is an internal URL within the context of the provided product
 * @param url URL to check
 * @param product associated product, if any
 * @returns
 */
export function isInternalUrl(
  url: string,
  product?: keyof typeof PRODUCT_DOMAIN_MAP
) {
  // relative paths are internal
  if (url.startsWith('/')) return true

  // Check the domain name of the URL if it's not relative. If it matches the domain for the supplied product, then it's not internal
  try {
    const { hostname } = new URL(url)
    if (product && hostname.endsWith(PRODUCT_DOMAIN_MAP[product])) return true
  } catch {
    // TODO: try and handle relative paths such as ./docker at some point
  }

  return false
}

/**
 * Load and compile redirects from a redirects.js file in the cwd
 */
function loadRedirects() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rawRedirects = require(require.resolve(path.join(cwd, 'redirects.js')))

  const redirects = rawRedirects.map((redirect, i, arr) => {
    const isExternalDestination = !redirect.destination.startsWith('/')
    const doesDestinationHaveTokens = redirect.destination.includes('/:')

    let destination: string | pathToRegexp.PathFunction = redirect.destination

    // External URLs can't be passed to pathToRegexp directly, so we have to parse the URL
    if (isExternalDestination) {
      if (doesDestinationHaveTokens) {
        destination = (params?: Record<string, any>) => {
          const destUrl = new URL(redirect.destination)
          const destCompile = pathToRegexp.compile(destUrl.pathname)

          const newPath = destCompile(params)

          destUrl.pathname = newPath

          return destUrl.href
        }
      }
    } else {
      destination = pathToRegexp.compile(redirect.destination)
    }

    return {
      source: pathToRegexp.match(redirect.source),
      destination,
      permanent: redirect.permanent,
    }
  })

  return redirects
}

/**
 * Checks for a matching redirect with the given URL and, if found,
 * applies the matching redirect.
 *
 * @param url URL to check for redirects with and apply to
 * @param redirects List of redirects which will be tested against the URL
 * @returns The redirected URL
 */
export const checkAndApplyRedirect = (
  url: string,
  redirects
): string | false => {
  let matchedResult: pathToRegexp.Match = false
  let matchedRedirect

  redirects.some((redirect) => {
    if (!redirect.permanent) return
    matchedResult = redirect.source(url)
    if (matchedResult) {
      matchedRedirect = redirect
      return true
    }
  })

  if (matchedRedirect && matchedResult) {
    // If the matched destination has no tokens, we can just return it
    if (typeof matchedRedirect.destination === 'string')
      return matchedRedirect.destination

    // TS is not cooperating, so having to use typecasting here
    return matchedRedirect.destination(
      typeof (matchedResult as pathToRegexp.Match) !== 'boolean'
        ? (matchedResult as unknown as pathToRegexp.MatchResult).params
        : {}
    )
  }

  return false
}

/**
 * Remark plugin which accepts a list of redirects and applies them to any matching links
 */
const rewriteInternalRedirectsPlugin = ({ product, redirects }) => {
  return function transformer(tree, file) {
    return visit(tree, (node: Node) => {
      if (!is(node, 'link') && !is(node, 'definition')) return [node]

      // Only check internal links
      if (
        node.url &&
        !node.url.startsWith('#') &&
        isInternalUrl(node.url, product)
      ) {
        const urlToRedirect = node.url.startsWith('/')
          ? node.url
          : new URL(node.url).pathname

        const redirectUrl = checkAndApplyRedirect(urlToRedirect, redirects)

        if (redirectUrl) {
          const data = file.data
          if (!data.internalRedirects) data.internalRedirects = []

          data.internalRedirects.push({
            source: node.url,
            destination: redirectUrl,
          })

          node.url = redirectUrl
        }
      }

      return [node]
    })
  }
}

export default async function main(product) {
  const contentFiles = []

  const dirPath = path.join(cwd, 'content')

  for await (const entry of readdirp(dirPath, {
    directoryFilter: ['!partials'],
    fileFilter: ['*.md', '*.mdx'],
  })) {
    const fileContents = await fs.promises.readFile(entry.fullPath, 'utf-8')

    contentFiles.push({
      raw: String(fileContents),
      contents: String(fileContents),
      path: entry.fullPath,
    })
  }

  const redirects = loadRedirects()

  const processor = remark()
    .data('settings', {
      listItemIndent: 1,
      bullet: '-',
      emphasis: '_',
      incrementListMarker: false,
      rule: '-',
      resourceLink: true,
      fences: true,
    })
    .use(remarkFrontmatter)
    .use(remarkMdx)
    .use(rewriteInternalRedirectsPlugin, { product, redirects })

  for (let document of contentFiles) {
    document = await processor.process(document)

    if (document.data.internalRedirects) {
      console.log('•', path.relative(cwd, document.path))
      document.data.internalRedirects.forEach(({ source, destination }) => {
        console.log('  -', `${source} -> ${destination}`)
      })
      fs.writeFileSync(document.path, document.contents, { encoding: 'utf-8' })
    }
  }
}
