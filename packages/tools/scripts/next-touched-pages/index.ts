import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

interface Sourcemap {
  sources: string[]
}

interface BuildManifest {
  pages: Record<string, string[]>
}

const css = /\/\*+[\s\S]*?sourceMappingURL\s*=([\s\S]*?)\*\//
const js = /\/\/#\s*sourceMappingURL\s*=(.*)/

const asyncExec = promisify(exec)

async function getPathToSourcemapForChunk(
  buildDir: string,
  chunkPath: string
): Promise<string> {
  const fullPathToChunk = path.join(buildDir, chunkPath)
  const f = await fs.open(fullPathToChunk, 'r')
  const { size } = await f.stat()

  let cursor = 0
  let line = ''

  for (;;) {
    cursor -= 1
    const buffer = Buffer.alloc(1)
    await f.read(buffer, 0, 1, size + cursor)
    if (cursor != -1 && (buffer[0] === 10 || buffer[0] === 13)) {
      break
    }

    line = buffer.toString('utf-8') + line

    if (cursor === -size) {
      break
    }
  }
  await f.close()

  const cssMatch = line.match(css)
  if (cssMatch) {
    return path.join(path.dirname(fullPathToChunk), cssMatch[1])
  }

  const jsMatch = line.match(js)
  if (jsMatch) {
    return path.join(path.dirname(fullPathToChunk), jsMatch[1])
  }

  throw new Error(`Unable to determine sourcemap for file: ${fullPathToChunk}`)
}

async function getSourcesForSourcemap(
  sourceMapPath: string
): Promise<string[]> {
  const data = await fs.readFile(sourceMapPath, 'utf-8')
  const sourcemap = JSON.parse(data) as Sourcemap
  return sourcemap.sources
}

async function readBuildManifest(buildDir: string): Promise<BuildManifest> {
  const data = await fs.readFile(
    path.join(buildDir, 'build-manifest.json'),
    'utf-8'
  )
  const manifest = JSON.parse(data) as BuildManifest
  return manifest
}

function unprefixSource(s: string): string {
  return s.replaceAll('webpack://_N_E/./', '')
}

async function generateSourceToPageMap(
  buildDir: string
): Promise<Record<string, string[]>> {
  const manifest = await readBuildManifest(buildDir)

  const promises: Promise<{ page: string; unprefixedPath: string }[]>[] = []
  Object.entries(manifest.pages).map(([page, chunks]) => {
    return chunks.map((chunk) => {
      promises.push(
        getPathToSourcemapForChunk(buildDir, chunk)
          .then((p) => {
            return getSourcesForSourcemap(p)
          })
          .then((sources) => {
            return sources.map((s) => {
              return {
                page,
                unprefixedPath: unprefixSource(s),
              }
            })
          })
      )
    })
  })

  const results = await Promise.all(promises)

  const sourceToPageMap: Record<string, string[]> = {}
  results.flat(2).forEach(({ page, unprefixedPath }) => {
    if (unprefixedPath in sourceToPageMap) {
      sourceToPageMap[unprefixedPath].push(page)
    } else {
      sourceToPageMap[unprefixedPath] = [page]
    }
  })

  return sourceToPageMap
}

async function getGitChangedFiles(baseBranch: string): Promise<string[]> {
  const { stdout } = await asyncExec(
    `git --no-pager diff --name-only '${baseBranch}'`
  )
  return stdout.split(os.EOL)
}

export default async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('files', {
      alias: 'f',
      description: 'list of files',
      type: 'array',
      conflicts: ['base-branch'],
    })
    .option('base-branch', {
      alias: 'b',
      description: 'base branch to compare against',
      type: 'string',
      conflicts: ['files'],
    })
    .parseSync()

  try {
    const buildDir = '.next'
    const sourceToPageMap = await generateSourceToPageMap(buildDir)

    const changedPages = new Set<string>()

    let changedFiles: string[] = []
    if (argv.files) {
      changedFiles = argv.files as string[]
    } else if (argv.baseBranch) {
      const gitChangedFiles = await getGitChangedFiles(argv.baseBranch)
      changedFiles = gitChangedFiles
    }

    changedFiles.forEach((f) => {
      const affectedPages = sourceToPageMap[f]
      affectedPages.forEach((p) => {
        changedPages.add(p)
      })
    })

    changedPages.forEach((p) => {
      console.log(p)
    })
  } catch (err) {
    console.error(err)
  }
}
