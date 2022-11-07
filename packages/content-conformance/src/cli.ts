#!/usr/bin/env node
import { ContentConformanceRunner } from './runner.js'

/**
 * The CLI interface for our content conformance runner. Should remain a pass-through to ContentConformanceRunner if at all possible to keep the CLI and JS API in-sync
 */
async function main() {
  const runner = new ContentConformanceRunner()

  await runner.init()

  console.log(runner.config)
}

main()

export {}
