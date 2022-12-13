import path from 'path'
import { jest } from '@jest/globals'
import { exec } from 'child_process'
import { currentFilePath, getFixturePath } from '../test/utils'

// TODO: replace with use of snapshots
enum ExpectedLogs {
  CONFIGURING = 'Configuring content conformance runner...',
  RUNNING = 'Running content conformance checks...',
  SUCCESS_STATUS = 'Check status: success',
}

const happyPath = [
  ExpectedLogs.CONFIGURING,
  ExpectedLogs.RUNNING,
  ExpectedLogs.SUCCESS_STATUS,
]

const determineCwd = (cwd?: string) =>
  typeof cwd !== 'undefined' ? `${cwd && '--cwd'} ${cwd}` : undefined

const determineConfig = (config?: string) =>
  typeof config !== 'undefined'
    ? `${config && '--config'} ${config}`
    : undefined

const cliCommand = (files: string | string[], cwd?: string, config?: string) =>
  `content-check --file ${files} ${determineCwd(cwd)} ${determineConfig(
    config
  )}`

function execCli(
  fixtureNames: string | string[],
  callback: () => void,
  options?: { cwd?: string; config?: string }
) {
  const fixtureBasePath = `basic-with-content-files/content/`
  const isMultipleFixtures = Array.isArray(fixtureNames)

  // return an array of absolute paths or a single absolute path
  const fixturePaths = isMultipleFixtures
    ? fixtureNames.reduce((acc: string[], path: string) => {
        if (Array.isArray(acc))
          acc.push(getFixturePath(`${fixtureBasePath}${path}`))
        return acc
      }, [])
    : getFixturePath(`${fixtureBasePath}${fixtureNames}`)

  function execWithCommand(file: string | string[]) {
    // if files are a string[] return a string of comma seperated files
    const files = Array.isArray(file) ? file.toString() : file

    // TODO: CWD into fixture path, and determine files from that CWD
    return exec(
      `${path.join(currentFilePath, '../..', 'cli.ts')} ${cliCommand(
        files,
        options?.cwd,
        options?.config
      )}`,
      () => new Promise((resolve) => resolve(callback))
    )
  }

  return execWithCommand(fixturePaths)
}

describe('Content-conformance CLI', () => {
  test('CLI - Successful run with content file and default config', async () => {
    // TODO: replace jest mocks with use of execFileSyncs ability to return STDOUT
    const logSpy = jest.spyOn(global.console, 'log')

    execCli('has-frontmatter.mdx', () => {
      expect(logSpy).toHaveBeenCalledWith(...happyPath)
    })

    logSpy.mockRestore()
  })

  test('CLI - Successful run with multiple content files and default config', async () => {
    const logSpy = jest.spyOn(global.console, 'log')

    execCli(['has-frontmatter.mdx', 'index.mdx'], () => {
      expect(logSpy).toHaveBeenCalledWith(...happyPath)
    })

    logSpy.mockRestore()
  })
})
