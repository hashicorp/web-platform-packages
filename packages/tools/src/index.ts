#!/usr/bin/env node
import path from 'path'
import fs from 'fs'
import { execFileSync } from 'child_process'
import { register } from 'ts-node'
import { doesFileExist } from './util'

// Register ts-node with the node process so it can handle imports of ts files
register({ transpileOnly: true, skipIgnore: true })

async function main() {
  const [, , scriptName, ...rest] = process.argv

  if (!scriptName) {
    const scripts = await fs.promises.readdir(
      path.join(__dirname, '..', 'scripts')
    )
    console.warn(
      '[hc-tools]: Expected a script name to be passed, available scripts:',
      ...scripts.map((script) => `\n  - ${script}`)
    )
    return
  }

  // If we receive a relative file path that is found on disk, execute it directly with ts-node.
  if (await doesFileExist(scriptName)) {
    execFileSync(
      'npx',
      ['ts-node', '--transpileOnly', '--skipIgnore', scriptName],
      { stdio: 'inherit' }
    )
    return
  }

  const scriptPath = path.join(__dirname, '..', 'scripts', scriptName)

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

main()
