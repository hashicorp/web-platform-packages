import util from 'util'
import withBundleAnalyzer from '@next/bundle-analyzer'
import withOptimizedImages from '@hashicorp/next-optimized-images'
import withTMBase from 'next-transpile-modules'
import { NextConfig } from 'next/dist/server/config'
import withCss, { WithCssOptions } from './plugins/with-css'
import withGraphqlBasic from './plugins/with-graphql-basic'
import { getHashicorpPackages } from './get-hashicorp-packages'

const debugLog = util.debuglog('nextjs-scripts')

interface DatoOptions {
  environment?: string
  token?: string
}
interface NextHashiCorpOptions {
  css?: WithCssOptions
  dato?: DatoOptions
  transpileModules?: string[]
  /** Controls whether or not to include next-optimized-images. Set it to true to use next-optimized-images. Defaults to false. */
  nextOptimizedImages?: boolean
}

// Export a plugin function that just goes through and calls our chain
export default function withHashicorp({
  css = {},
  dato = {},
  transpileModules = [],
  nextOptimizedImages = false,
}: NextHashiCorpOptions = {}): (
  nextConfig?: Partial<NextConfig>
) => NextConfig {
  return function withHashicorpInternal(nextConfig: Partial<NextConfig> = {}) {
    const chain = [
      withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' }),
      withCss(css),
      withGraphqlBasic(),
    ]

    // If nextOptimizedImages is true, add the plugin and set the necessary config value
    if (nextOptimizedImages) {
      chain.unshift(withOptimizedImages)

      nextConfig.images = {
        disableStaticImages: true,
        ...nextConfig.images,
      } as NextConfig['images']
    }

    nextConfig.future = {
      ...nextConfig.future,
      strictPostcssConfiguration: true,
    }

    const hcPackages = getHashicorpPackages(process.cwd())

    debugLog('detected @hashicorp dependencies: %s', hcPackages)

    // Automatically determine hashicorp packages from directories in node_modules
    chain.unshift(withTMBase([...transpileModules, ...hcPackages]))

    // Set dato token if a custom token is provided
    if (dato?.token) {
      if (!nextConfig.env) nextConfig.env = {}
      process.env.HASHI_DATO_TOKEN = dato.token
      nextConfig.env.HASHI_DATO_TOKEN = dato.token
    }

    // Set dato environment if custom environment is provided
    if (dato?.environment) {
      if (!nextConfig.env) nextConfig.env = {}
      process.env.HASHI_DATO_ENVIRONMENT = dato.environment
      nextConfig.env.HASHI_DATO_ENVIRONMENT = dato.environment
    }

    // the difference between defaults and permanents are that defaults will
    // be overridden by user land configuration, whereas permanents are always
    // tacked on to the end and therefore can't be overidden
    // header overriding docs: https://nextjs.org/docs/api-reference/next.config.js/headers#header-overriding-behavior
    const defaultHeaders: ThenType<
      ReturnType<NonNullable<NextConfig['headers']>>
    > = []
    const permanentHeaders = [
      {
        source: '/:path*{/}?', // https://github.com/vercel/next.js/issues/14930
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]

    // support tipBranch config, which activates noindex HTTP headers
    // MKTG-030 - https://docs.google.com/document/d/1AlBW3DPT7D54vDQa0P6QBMjTKqssJFPDz1CuthkI5oM/edit#
    if (
      nextConfig.tipBranch &&
      process.env.VERCEL_GIT_COMMIT_REF == nextConfig.tipBranch
    ) {
      defaultHeaders.push({
        source: '/:path*{/}?',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      })
    }
    // if there are user land headers, combine them with defaults & permanents
    if (nextConfig.headers) {
      const origHeaders = nextConfig.headers
      nextConfig.headers = () =>
        origHeaders().then((res) => {
          return [...defaultHeaders, ...res, ...permanentHeaders]
        })
    } else {
      // else, just add defaults and permanent headers and resolve the promise
      nextConfig.headers = () =>
        Promise.resolve([...defaultHeaders, ...permanentHeaders])
    }

    // Disable Next's built-in eslint integration as we already execute elsewhere
    nextConfig.eslint = {
      ignoreDuringBuilds: true,
      ...nextConfig.eslint,
    }

    return chain.reduce((acc, next) => next(acc), nextConfig) as NextConfig
  }
}
