import path from 'path'
import fs from 'fs'
import readdirp from 'readdirp'
import * as pathToRegexp from 'path-to-regexp'
import remark from 'remark'
import remarkMdx from 'remark-mdx'
import remarkFrontmatter from 'remark-frontmatter'
import is from 'unist-util-is'
import visit from 'unist-util-visit'
import fetch from 'node-fetch'

import type { Node } from 'unist'
import type { VFile } from 'vfile'

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
    if (
      !product &&
      (Object.values(PRODUCT_DOMAIN_MAP) as string[]).some((domain) =>
        hostname.endsWith(domain)
      )
    ) {
      return true
    }

    if (product && hostname.endsWith(PRODUCT_DOMAIN_MAP[product])) {
      // Don't match TF Registry for TF.
      if (hostname.includes('registry.terraform.io')) {
        return false
      }
      // Don't match TF Cloud for TF.
      if (hostname.includes('app.terraform.io')) {
        return false
      }
      return true
    }
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

  const redirects = rawRedirects.map((redirect) => {
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

  const [urlWithoutHash, hash] = url.split('#')

  redirects.some((redirect) => {
    if (!redirect.permanent) return
    matchedResult = redirect.source(url) || redirect.source(urlWithoutHash)
    if (matchedResult) {
      matchedRedirect = redirect
      return true
    }
  })

  if (matchedRedirect && matchedResult) {
    // If the matched destination has no tokens, we can just return it
    if (typeof matchedRedirect.destination === 'string') {
      // include new hash
      if (matchedRedirect.destination.includes('#')) {
        return matchedRedirect.destination
      }
      // include old hash, if exists
      return `${matchedRedirect.destination}${hash ? `#${hash}` : ''}`
    }

    // TS is not cooperating, so having to use typecasting here
    const destinationUrl = matchedRedirect.destination(
      typeof (matchedResult as pathToRegexp.Match) !== 'boolean'
        ? (matchedResult as unknown as pathToRegexp.MatchResult).params
        : {}
    )

    return `${destinationUrl}${hash ? `#${hash}` : ''}`
  }

  return false
}

/**
 * Remark plugin which accepts a list of redirects and applies them to any matching links
 *
 * For terraform:
 * - `redirects` will be ignored
 * - Prepend the domain, execute the fetch, resolve, and grab the new path only
 */
const rewriteInternalRedirectsPlugin = ({ product, redirects }) => {
  return async function transformer(tree, file) {
    return visit(tree, (node: Node & { url?: string }) => {
      if (!is(node, 'link') && !is(node, 'definition')) return

      // Only check internal links
      if (node.url && !node.url.startsWith('#') && isInternalUrl(node.url)) {
        const urlToRedirect = node.url.startsWith('/')
          ? node.url
          : new URL(node.url).pathname

        // don't transform links like `[https://terraform.io](https://terraform.io)`
        if (urlToRedirect == '/' || urlToRedirect == '') {
          console.log('...Skipping homepage URL')
          return
        }

        let redirectUrl

        if (isInternalUrl(node.url, product)) {
          if (product === 'terraform') {
            try {
              const oldUrl = new URL(node.url, 'https://www.terraform.io')
              // use `fetch` to follow any redirects
              redirectUrl = fetch(oldUrl).then((res) => {
                const [, oldHash] = node.url!.split('#')
                const newUrl = new URL(res.url)
                const newHost = newUrl.host

                // Handle redirects from `/cloud` (terraform.io/cloud) to `cloud.hashicorp.com/products/terraform`
                if (newHost !== 'www.terraform.io') {
                  // Do we want to preserve hash across different domains?
                  return newUrl.toString()
                }

                const newPath = newUrl.pathname
                if (oldHash && !newUrl.hash) {
                  newUrl.hash = oldHash
                }
                return newPath + newUrl.hash
              })
            } catch (err) {
              console.error('Something went wrong:', err)
            }
          } else {
            redirectUrl = checkAndApplyRedirect(urlToRedirect, redirects)
          }
        } else {
          const [, hash] = node.url.split('#')
          redirectUrl = fetch(node.url, { method: 'HEAD' }).then(
            (res) =>
              `${res.url}${hash && !res.url.includes('#') ? `#${hash}` : ''}`
          )
        }

        if (redirectUrl) {
          const data = file.data
          if (!data.internalRedirects) data.internalRedirects = []

          data.internalRedirects.push({
            source: node.url,
            destination: redirectUrl,
          })

          if (!(redirectUrl instanceof Promise)) {
            node.url = redirectUrl
          }
        }
      }
    })
  }
}

// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

/**
 * In order to preserve the structure of the content
 */
function applyRedirectToContent(content, { source, destination }) {
  // matches definitions OR links
  const pattern = new RegExp(
    `(^\\[.*\\]: )${escapeRegExp(source)}((?:#.*)?$)|(\\]\\()${escapeRegExp(
      source
    )}((?:#.*)?\\))`,
    'gim'
  )

  return content.replace(
    pattern,
    (_match, definitionPrefix, definitionSuffix, linkPrefix, linkSuffix) => {
      if (definitionPrefix && typeof definitionSuffix !== 'undefined') {
        return `${definitionPrefix}${destination}${definitionSuffix}`
      }

      if (linkPrefix && linkSuffix) {
        return `${linkPrefix}${destination}${linkSuffix}`
      }
    }
  )
}

interface Data {
  internalRedirects: { source: string; destination: string }[]
}
type ParsedFile = Partial<VFile> & { data?: Data }

/**
 * @example `npx hc-tools rewrite-internal-redirects terraform docs`
 */
export default async function main(product: string, dir = 'content') {
  const contentFiles: ParsedFile[] = []

  let dirPath = path.join(cwd, dir)
  if (product === 'tutorials') {
    dirPath = path.join(cwd, 'content', 'tutorials')
  }

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

  let redirects = []
  if (product !== 'tutorials' && product !== 'terraform') {
    redirects = loadRedirects()
  }

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

  for await (let document of contentFiles) {
    const raw = document.raw
    document = (await processor.process(document)) as ParsedFile

    if (document.data?.internalRedirects) {
      console.log('•', path.relative(cwd, document.path as string))

      let content = raw

      await document.data.internalRedirects.reduce(
        async (previousPromise, { source, destination }) => {
          await previousPromise

          const finalDestination = await destination
          if (source === finalDestination) return

          console.log('  -', `${source} -> ${finalDestination}`)

          content = await applyRedirectToContent(content, {
            source,
            destination: finalDestination,
          })
        },
        Promise.resolve()
      )

      if (process.env.DRY_RUN !== 'true') {
        fs.writeFileSync(document.path as string, content as string, {
          encoding: 'utf-8',
        })
      }
    }
  }
}
