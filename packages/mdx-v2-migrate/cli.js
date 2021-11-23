#!/usr/bin/env node
import { migrate } from './src/migrate.js'

async function main() {
  const [, , ...files] = process.argv
  await migrate(files)
}

main()
