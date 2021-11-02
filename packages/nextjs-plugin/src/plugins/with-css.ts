// @ts-expect-error -- no types from this
import postcssPresetEnv from 'next/dist/compiled/postcss-preset-env'
// @ts-expect-error -- no types from this
import flexbugs from 'next/dist/compiled/postcss-flexbugs-fixes'
import normalize from 'postcss-normalize'
import path from 'path'
import { NextConfig } from 'next/dist/next-server/server/config'
import { pluginOptions as PostCSSPluginOptions } from 'postcss-preset-env'
import * as webpack from 'webpack'
import * as postcss from 'postcss'

export interface WithCssOptions {
  afterPlugins?: Plugin[]
  beforePlugins?: Plugin[]
  presetEnvOptions?: PostCSSPluginOptions
}

function getPostcssPlugins(
  dir: string,
  presetEnvOptions?: PostCSSPluginOptions
): postcss.AcceptedPlugin[] {
  return [
    flexbugs(),
    postcssPresetEnv(
      Object.assign(
        {
          stage: 3,
          browsers: ['defaults'],
          autoprefixer: { flexbox: 'no-2009' },
          features: {
            'nesting-rules': true,
            'custom-media-queries': {
              importFrom: path.join(
                dir,
                'node_modules/@hashicorp/mktg-global-styles/custom-media.css'
              ),
            },
            'custom-properties': false,
          },
        },
        presetEnvOptions || {}
      )
    ),
    normalize({ browsers: 'defaults' }),
  ].filter(Boolean) as postcss.AcceptedPlugin[]
}

export default function withCss({
  afterPlugins = [],
  beforePlugins = [],
  presetEnvOptions = {},
}: WithCssOptions = {}) {
  return function withCssInternal(
    nextConfig: Partial<NextConfig> = {}
  ): Partial<NextConfig> {
    let hasAppliedModifications = false

    return Object.assign({}, nextConfig, {
      webpack(config: webpack.Configuration, options: any) {
        const { dir } = options

        const postCssPlugins: postcss.AcceptedPlugin[] = [
          ...beforePlugins,
          ...getPostcssPlugins(dir, presetEnvOptions),
          ...afterPlugins,
        ] as postcss.AcceptedPlugin[]

        // c.f.: https://github.com/vercel/next.js/blob/canary/packages/next/build/webpack/config/blocks/css/overrideCssConfiguration.ts
        function overridePostcssPlugins(rule: webpack.RuleSetRule) {
          if (
            rule.options &&
            typeof rule.options === 'object' &&
            typeof rule.options.postcssOptions === 'object'
          ) {
            rule.options.postcssOptions.plugins = postCssPlugins
            hasAppliedModifications = true
          } else if (Array.isArray(rule.oneOf)) {
            rule.oneOf.forEach(overridePostcssPlugins)
          } else if (Array.isArray(rule.use)) {
            rule.use.forEach((u) => {
              if (typeof u === 'object') {
                overridePostcssPlugins(u)
              }
            })
          }
        }

        config.module?.rules?.forEach((entry) => {
          overridePostcssPlugins(entry)
        })

        if (!hasAppliedModifications)
          throw new Error(
            'nextjs-scripts - PostCSS loader modifications were not applied! This may have been caused by an issue in a newer version of next. Please reach out in #team-web-platform.'
          )

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    })
  }
}
