#!/usr/bin/env node
/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import chalk from 'chalk'
import { ContentConformanceRunner, RunnerStatus } from './runner.js'

// Disable colored output when running in a test environment so we can snapshot the CLI output without the color codes.
if (process.env.NODE_ENV === 'test') {
  chalk.level = 0
}

/**
 * The CLI interface for our content conformance runner. Should remain a pass-through to ContentConformanceRunner if at all possible to keep the CLI and JS API in-sync
 */
yargs(hideBin(process.argv)).command(
  ['$0', 'content-check'],
  'Content conformance runner',
  {
    cwd: {
      description: 'Current working directory',
      type: 'string',
    },
    config: {
      description: 'Path to config file',
      type: 'string',
    },
  },
  async (argv): Promise<void> => {
    const [...files] = argv._ as string[]
    const runner = new ContentConformanceRunner({
      cwd: argv.cwd,
      config: argv.config,
      files: files,
    })

    try {
      await runner.init()

      console.log('')
      console.log(`Running content conformance checks...`)
      console.log('')

      if (files.length) {
        console.log(
          `${chalk.bold(
            `Checking ${files.length > 1 ? 'files' : 'file'}:`
          )} ${chalk.dim(files.join(', '))}`
        )
      } else {
        console.log(
          `${chalk.bold('Checking files matching:')} ${chalk.dim(
            [
              runner.config?.contentFileGlobPattern,
              runner.config?.dataFileGlobPattern,
            ]
              .filter(Boolean)
              .join(', ')
          )}`
        )
      }

      await runner.run()
    } catch (error) {
      let stack = 'Unknown Error'
      if (error instanceof Error) stack = error?.stack ?? stack
      else stack = String(error)

      console.log('')
      console.log(chalk.redBright(stack))
    }

    try {
      const report = await runner.report()

      const color = runner.status === 'SUCCESS' ? 'green' : 'red'

      console.log(
        chalk.bold('Status: '),
        chalk.bold[color](runner.status?.toLowerCase())
      )

      if (report.length) {
        console.log('')
        console.log(report)
      }
    } catch (error) {
      let stack = 'Unknown Error'
      if (error instanceof Error) stack = error?.stack ?? stack
      else stack = String(error)

      console.log(
        chalk.redBright(`Check status: ${runner.status?.toLowerCase()}`)
      )
      console.log('')
      console.log(chalk.redBright(stack))
    }

    if (runner.status !== RunnerStatus.SUCCESS) {
      process.exitCode = 1
    }
  }
).argv
