#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import chalk from 'chalk'
import { ContentConformanceRunner } from './runner.js'

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
    const [...files] = <string[]>argv._
    const runner = new ContentConformanceRunner({
      cwd: argv.cwd,
      config: argv.config,
      files: files,
    })

    try {
      console.log('Configuring content conformance runner...')

      await runner.init()

      if (files.length) {
        console.log('')
        console.log(
          chalk.bold.green(`Included ${files.length > 1 ? 'files' : 'file'}:`)
        )

        files.forEach((file: string) => {
          console.log(chalk.whiteBright(`- ${file}`))
        })
      }

      console.log('')
      console.log('Running content conformance checks...')
      console.log('')

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

      console.log(
        chalk.bold('Status: '),
        chalk.bold.green(runner.status?.toLowerCase())
      )

      if (report.length) {
        console.log('')
        console.log(chalk.red(report))
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
  }
).argv
