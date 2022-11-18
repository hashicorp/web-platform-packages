#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import chalk from 'chalk'
import { ContentConformanceRunner } from './runner.js'

/**
 * The CLI interface for our content conformance runner. Should remain a pass-through to ContentConformanceRunner if at all possible to keep the CLI and JS API in-sync
 */

type ErrorWithMessage = {
  message: string
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}

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
  async function (argv) {
    const runner = new ContentConformanceRunner({
      cwd: argv.cwd,
      config: argv.config,
      files: argv.files,
    })

    try {
      await runner.init()

      console.log(
        chalk.bold.greenBright(`Running content conformance checks on:`)
      )
      argv.files.forEach((file: string) => {
        console.log(chalk.green(`- ${file}`))
      })
    } catch (error) {
      let stack = 'Unknown Error'
      if (error instanceof Error) stack = error.stack ?? stack
      else stack = String(error)

      console.log(chalk.redBright(stack))
    }

    console.log(chalk.cyanBright(`Config: ${runner.config}`))
  }
).argv
