import { spawn } from 'child_process'
import which from 'which'

/**
 * Wrap the next build command to only run the webpack step of the build, short-circuiting before static generation.
 */
export default async function main() {
  const nextBin = await which('next')
  const buildProc = spawn(nextBin, ['build'], {
    env: { ...process.env, FORCE_COLOR: 'true' },
  })

  buildProc.stdout.on('data', (data) => {
    const value = data.toString()
    // This is the log output immediately following the webpack build and before static generation starts,
    // so it should be safe to abort
    if (value.includes('Collecting page data')) {
      console.log('Webpack build finished, exiting.')
      buildProc.kill('SIGINT')
    } else {
      console.log(value.trim())
    }
  })

  buildProc.stderr.on('data', (data) => {
    console.error(data.toString().trim())
  })

  buildProc.on('exit', (code, signal) => {
    if (signal === 'SIGINT') process.exit(0)
    process.exit(code ?? undefined)
  })
}
