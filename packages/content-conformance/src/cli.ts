#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import chalk from 'chalk'
import { ContentConformanceRunner } from './runner.js'

/**
 * The CLI interface for our content conformance runner. Should remain a pass-through to ContentConformanceRunner if at all possible to keep the CLI and JS API in-sync
 */
yargs(hideBin(process.argv)).command(
  'content-check',
  'Content conformance runner',
  {
    cwd: {
      description: 'Current working directory',
      default: undefined,
      type: 'string',
    },
    config: {
      description: 'Path to config file',
      default: undefined,
      type: 'string',
    },
    files: {
      description: 'Path to content files',
      default: [],
      type: 'array',
    },
  },
  async (argv): Promise<void> => {
    const runner = new ContentConformanceRunner({
      cwd: argv.cwd,
      config: argv.config,
      files: argv.files,
    })

    try {
      console.log('Configuring content conformance runner...')
      await runner.init()

      if (!argv.files.length) return

      console.log(
        chalk.bold.green(
          `Included ${argv.files.length > 1 ? 'files' : 'file'}:`
        )
      )

      argv.files.forEach((file: string) => {
        console.log(chalk.whiteBright(`- ${file}`))
      })

      console.log(chalk.cyanBright(`Config: ${runner.config}`))
    } catch (error) {
      let stack = 'Unknown Error'
      if (error instanceof Error) stack = error?.stack ?? stack
      else stack = String(error)

      console.log(chalk.redBright(stack))
    }

    try {
      console.log('Running content conformance checks...')
      await runner.run()

      console.log(
        chalk.bold.greenBright(`Check status: ${runner.status?.toLowerCase()}`)
      )
    } catch (error) {
      let stack = 'Unknown Error'
      if (error instanceof Error) stack = error?.stack ?? stack
      else stack = String(error)

      console.log(
        chalk.redBright(`Check status: ${runner.status?.toLowerCase()}`)
      )
      console.log(chalk.redBright(stack))
    }
  }
).argv
