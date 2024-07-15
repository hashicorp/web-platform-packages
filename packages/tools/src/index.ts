#!/usr/bin/env node
/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'
import { execFileSync } from 'child_process'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { register } from 'ts-node'
import { loadEnvConfig } from '@next/env'
import { doesFileExist } from './util'

// Register ts-node with the node process so it can handle imports of ts files
register({
  transpileOnly: true,
  skipIgnore: true,
  skipProject: true,
  compilerOptions: { module: 'CommonJS' },
})

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('project', {
      alias: 'p',
      description: 'If specified, loads the tsconfig from the specified path',
      type: 'string',
    })
    .option('resolve-paths', {
      description:
        'Controls whether or not to resolve paths based on local tsconfig settings',
      default: true,
      type: 'boolean',
    })
    .parseSync()

  const [scriptName, ...rest] = argv._

  if (!scriptName) {
    const scripts = await fs.promises.readdir(
      path.join(__dirname, '..', 'scripts')
    )
    console.warn(
      '[hc-tools]: Expected a script name to be passed, or a relative path to a script in your working directory. Available scripts:',
      ...scripts.map((script) => `\n  - ${script}`)
    )
    return
  }

  // If we receive a relative file path that is found on disk, execute it directly with ts-node.
  if (await doesFileExist(scriptName as string)) {
    // Load env variables from .env using Next.js's utility
    const env = loadEnvConfig(
      process.cwd(),
      process.env.NODE_ENV !== 'production',
      {
        info() {
          // disable console.info calls for loaded env files
          return
        },
        error(...args: any[]) {
          console.error(...args)
        },
      }
    )

    const projectOptions = argv.project
      ? ['--project', argv.project]
      : ['--skipProject']

    // including the require option here to support paths and baseUrl,
    // per: https://www.npmjs.com/package/ts-node#paths-and-baseurl
    const requireOptions = argv['resolve-paths']
      ? ['--require', 'tsconfig-paths/register']
      : []

    return execFileSync(
      'npx',
      [
        'ts-node',
        '--transpileOnly',
        '--skipIgnore',
        '--compilerOptions',
        '{"module": "CommonJS"}',
        ...requireOptions,
        ...projectOptions,
        scriptName as string,
        ...(rest as string[]),
      ],
      { stdio: 'inherit', env: { ...process.env, ...env.combinedEnv } }
    )
  }

  const scriptPath = path.join(__dirname, '..', 'scripts', scriptName as string)

  let script
  try {
    /**
     * Dynamically import the script file and grab its default export so we can execute it
     * It will get transpiled at runtime by ts-node due to the register call at the top of the file
     */
    script = (await import(scriptPath)).default
  } catch (error) {
    console.error(
      `[hc-tools]: Error loading script: ${scriptName}, it might not exist.`,
      error
    )
    return
  }

  if (typeof script !== 'function') {
    console.error(
      `[hc-tools]: Expected the default export of the script to be a function, but got ${typeof script} instead.`
    )
    return
  }

  await script(...rest)
}

main().catch(() => {
  process.exit(1)
})
