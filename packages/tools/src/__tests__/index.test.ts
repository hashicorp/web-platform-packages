import path from 'path'
import { execFileSync } from 'child_process'

let cwd: string

function setCwdToFixture(name: string) {
  process.chdir(path.join(__dirname, '__fixtures__', name))
}

function execHCTools(args: string[], opts = {}) {
  return String(
    execFileSync(
      'node',
      [path.join(__dirname, '../..', './dist/index.js'), ...args],
      opts
    )
  )
}

describe('hc-tools', () => {
  beforeAll(() => {
    cwd = process.cwd()
  })

  afterEach(() => {
    process.chdir(cwd)
  })

  test('respects baseUrl and loads .env file', () => {
    setCwdToFixture('tsconfig-paths-env')

    const result = execHCTools(['./scripts/my-script.ts'])

    // loading a value from .env
    expect(result).toContain(`bar`)

    // Importing a module dependent on baseUrl
    expect(result).toContain(`hello from lib`)
  })

  test('does not load baseUrl or paths with --resolve-paths=false', () => {
    setCwdToFixture('tsconfig-paths-env')

    try {
      execHCTools(['./scripts/my-script.ts', '--resolve-paths', 'false'], {
        stdio: 'pipe',
      })
    } catch (err) {
      expect((err as any).message).toContain("Cannot find module 'lib/index'")
    }
  })

  test('respects custom paths with different tsconfig', () => {
    setCwdToFixture('tsconfig-paths-env')

    const result = execHCTools([
      './scripts/my-script-custom-paths.ts',
      '--project',
      'tsconfig.paths.json',
    ])

    // loading a value from .env
    expect(result).toContain(`bar`)

    // Importing a module dependent on paths
    expect(result).toContain(`hello from lib`)
  })

  test('rewrite-internal-redirects', () => {
    setCwdToFixture('rewrite-internal-redirects')

    const result = execHCTools(['rewrite-internal-redirects', 'vault'], {
      env: { ...process.env, DRY_RUN: 'true' },
    })

    expect(result).toMatchInlineSnapshot(`
      "• content/index.mdx
        - /redirected/link -> /new/destination
      "
    `)
  })
})
