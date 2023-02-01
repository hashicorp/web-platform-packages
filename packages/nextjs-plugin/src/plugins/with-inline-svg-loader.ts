import { NextConfig } from 'next'
// @ts-expect-error -- There are no types for this package
import loader from 'svgo-loader'

export function withInlineSvgLoader() {
  return function withInlineSvgLoaderInternal(
    nextConfig: NextConfig = {}
  ): NextConfig {
    return {
      ...nextConfig,
      webpack(config, options) {
        // Allow using SVGs inline by returning them as a raw string.
        config.module.rules.push({
          test: (req: string) => /\.svg$/.test(req),
          resourceQuery: /include/,
          issuer: { not: [/\.(css|scss|sass)$/] },
          type: 'asset/source',
          use: [
            {
              loader,
              options: {
                plugins: [
                  {
                    name: 'removeViewBox',
                    active: false,
                  },
                  {
                    name: 'collapseGroups',
                    active: false,
                  },
                ],
              },
            },
          ],
        })

        // This forces the native next-image-loader rule to ignore the above rule based on the resourceQuery value
        config.module.rules.forEach((rule: any) => {
          if (rule.loader === 'next-image-loader') {
            rule.resourceQuery = { not: /include/ }
          }
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    }
  }
}
