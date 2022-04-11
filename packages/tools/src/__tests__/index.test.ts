import path from 'path'
import { execFileSync } from 'child_process'

let cwd: string

function setCwdToFixture(name: string) {
  process.chdir(path.join(__dirname, '__fixtures__', name))
}

function execHCTools(...args: string[]) {
  return String(
    execFileSync('node', [
      path.join(__dirname, '../..', './dist/index.js'),
      ...args,
    ])
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

    const result = execHCTools('./scripts/my-script.ts')

    // loading a value from .env
    expect(result).toContain(`bar`)

    // Importing a module dependent on baseUrl
    expect(result).toContain(`hello from lib`)
  })
})
