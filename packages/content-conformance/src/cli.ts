#!/usr/bin/env node
import { ContentConformanceRunner } from './runner.js'

async function main() {
  const runner = new ContentConformanceRunner()

  await runner.init()

  console.log(runner.config)
}

main()

export {}
