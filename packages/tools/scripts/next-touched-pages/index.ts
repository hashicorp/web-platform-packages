import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { summary } from '@actions/core'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

interface Sourcemap {
  sources: string[]
}

interface BuildManifest {
  pages: Record<string, string[]>
}

interface Configuration {
  paths?: Record<string, string[]>
  buildUrl?: (branch: string) => string
}

const css = /\/\*+[\s\S]*?sourceMappingURL\s*=([\s\S]*?)\*\//
const js = /\/\/#\s*sourceMappingURL\s*=(.*)/

const asyncExec = promisify(exec)

function determineSourcemapUrl(
  line: string,
  fullPathToChunk: string
): string | null {
  const cssMatch = line.match(css)
  if (cssMatch) {
    return path.join(path.dirname(fullPathToChunk), cssMatch[1])
  }

  const jsMatch = line.match(js)
  if (jsMatch) {
    return path.join(path.dirname(fullPathToChunk), jsMatch[1])
  }

  return null
}

async function getPathToSourcemapForChunkFallback(
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

  const sourcemapUrl = determineSourcemapUrl(line, fullPathToChunk)
  if (sourcemapUrl) {
    return sourcemapUrl
  }

  throw new Error(`Unable to determine sourcemap for file: ${fullPathToChunk}`)
}

async function getPathToSourcemapForChunk(
  buildDir: string,
  chunkPath: string
): Promise<string> {
  const fullPathToChunk = path.join(buildDir, chunkPath)
  const f = await fs.open(fullPathToChunk, 'r')
  const { size } = await f.stat()

  const buffer = Buffer.alloc(128)
  await f.read(buffer, 0, 128, size - 128)
  await f.close()
  const line = buffer.toString('utf-8')

  const sourcemapUrl = determineSourcemapUrl(line, fullPathToChunk)
  if (sourcemapUrl) {
    return sourcemapUrl
  }

  // A sourcemap declaration wasn't found in the last 128 bytes, so fallback
  // to using a byte-by-byte scan to find the last line.
  return getPathToSourcemapForChunkFallback(buildDir, chunkPath)
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

function transformManifest(
  manifest: BuildManifest
): Record<string, { pages: string[]; sources: string[] }> {
  const map: Record<string, { pages: string[]; sources: string[] }> = {}
  Object.entries(manifest.pages).forEach(([page, chunks]) => {
    chunks.forEach((chunk) => {
      if (chunk in map) {
        map[chunk].pages.push(page)
      } else {
        map[chunk] = { pages: [page], sources: [] }
      }
    })
  })

  return map
}

async function generateSourceToPageMap(
  buildDir: string
): Promise<Record<string, string[]>> {
  const manifest = await readBuildManifest(buildDir)

  const mapping = transformManifest(manifest)

  const promises: Promise<void>[] = []
  Object.keys(mapping).forEach((chunk) => {
    promises.push(
      getPathToSourcemapForChunk(buildDir, chunk)
        .then((p) => {
          return getSourcesForSourcemap(p)
        })
        .then((sources) => {
          mapping[chunk].sources = sources.map(unprefixSource)
        })
    )
  })

  await Promise.all(promises)

  const sourceToPageMap: Record<string, string[]> = {}
  Object.entries(mapping).forEach(([, { pages, sources }]) => {
    sources.forEach((source) => {
      if (source in sourceToPageMap) {
        sourceToPageMap[source].push(...pages)
      } else {
        sourceToPageMap[source] = [...pages]
      }
    })
  })

  return sourceToPageMap
}

async function getGitChangedFiles(baseBranch: string): Promise<string[]> {
  const { stdout } = await asyncExec(
    `git --no-pager diff --name-only '${baseBranch}'`
  )
  return stdout.split(os.EOL)
}

async function getGitBranch(): Promise<string> {
  const { stdout } = await asyncExec(`git branch --show-current`)
  return stdout.trim()
}

export function getListOfUrls(
  page: string,
  {
    base,
    dynamicPathsConfig,
    urlBuilderConfig,
  }: {
    base?: string
    dynamicPathsConfig?: Record<string, string[]>
    urlBuilderConfig?: (branch: string) => string
  }
): string {
  if (dynamicPathsConfig && page in dynamicPathsConfig) {
    const paths = dynamicPathsConfig[page]
    if (base) {
      return paths
        .map(
          (p, i) =>
            `<li><a href="${
              urlBuilderConfig ? urlBuilderConfig(base) : base
            }${p}"><code>${p}</code> #${i + 1}</a></li>`
        )
        .join('')
    } else {
      return paths
        .map((p, i) => `<li><code>${p}</code> #${i + 1}</li>`)
        .join('')
    }
  }

  return `<li><code>${page}</code></li>`
}

export function generateCommentMarkdown(
  changedPages: string[],
  {
    baseBranch,
    branch,
    urlBuilderConfig,
    dynamicPathsConfig,
  }: {
    baseBranch?: string
    branch?: string
    urlBuilderConfig?: (branch: string) => string
    dynamicPathsConfig?: Record<string, string[]>
  }
): string {
  let comment = summary.addHeading('Changed Pages', 2)
  if (changedPages.length > 0) {
    comment = comment.addTable([
      [
        { data: 'Page', header: true },
        { data: `<code>${baseBranch ?? 'Base'}</code>`, header: true },
        { data: `<code>${branch ?? 'This PR'}</code>`, header: true },
      ],
      ...changedPages.map((p) => [
        `<code>${p}</code>`,
        getListOfUrls(p, {
          base: baseBranch,
          dynamicPathsConfig,
          urlBuilderConfig,
        }),
        getListOfUrls(p, {
          base: branch,
          dynamicPathsConfig,
          urlBuilderConfig,
        }),
      ]),
    ])
  } else {
    comment = comment
      .addBreak()
      .addRaw("This PR doesn't appear to affect any pages.")
  }

  comment = comment
    .addBreak()
    .addRaw(
      'This comment was generated by <a href="https://github.com/hashicorp/web-platform-packages/tree/main/packages/tools/scripts/next-touched-pages"><code>next-touched-pages</code></a> and isn\'t guaranteed to be accurate.'
    )
    .addBreak()
    .addRaw('<!-- __NEXTJS_TOUCHED_PAGES -->')

  return comment.stringify()
}

async function printCommentMarkdown(
  changedPages: string[],
  options: Parameters<typeof generateCommentMarkdown>[1]
): Promise<void> {
  const comment = generateCommentMarkdown(changedPages, options)
  console.log(comment)
}

async function loadConfig(): Promise<Configuration> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(path.join(
      process.cwd(),
      'next-touched-pages.config.js'
    ))
    return config as Configuration
  } catch {
    return {}
  }
}

export default async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('paths', {
      alias: 'p',
      description: 'list of paths',
      type: 'array',
      conflicts: ['base-branch'],
    })
    .option('base-branch', {
      alias: 'b',
      description: 'base branch to compare against',
      type: 'string',
      conflicts: ['files'],
    })
    .option('format', {
      alias: 'f',
      description: 'format of output',
      type: 'string',
      choices: ['text', 'json', 'comment-markdown'],
      default: 'text',
    })
    .parseSync()

  try {
    const buildDir = '.next'
    const sourceToPageMap = await generateSourceToPageMap(buildDir)
    const changedPages = new Set<string>()

    let changedFiles: string[] = []
    if (argv.paths) {
      changedFiles = argv.paths as string[]
    } else if (argv.baseBranch) {
      const gitChangedFiles = await getGitChangedFiles(argv.baseBranch)
      changedFiles = gitChangedFiles
    }

    changedFiles.forEach((f) => {
      const affectedPages = sourceToPageMap[f] ?? []
      affectedPages.forEach((p) => {
        changedPages.add(p)
      })
    })

    const sortedChangedPages = Array.from(changedPages).sort()

    const branch = await getGitBranch()
    const config = await loadConfig()

    switch (argv.format) {
      case 'text':
        sortedChangedPages.forEach((p) => {
          console.log(p)
        })
        break
      case 'json':
        console.log(JSON.stringify(sortedChangedPages))
        break
      case 'comment-markdown':
        await printCommentMarkdown(sortedChangedPages, {
          branch,
          baseBranch: argv.baseBranch,
          urlBuilderConfig: config.buildUrl,
          dynamicPathsConfig: config.paths,
        })
        break
    }
  } catch (err) {
    console.error(err)
  }
}
