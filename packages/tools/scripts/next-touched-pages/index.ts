/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

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
  name?: string
  paths?: Record<string, string[]>
  skipCommentIfEmpty?: boolean
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

async function getGitPrefix(): Promise<string | null> {
  const { stdout } = await asyncExec('git rev-parse --show-prefix')
  const prefix = stdout.trim()
  return prefix ?? null
}

async function getGitChangedFiles(
  baseBranch: string,
  branch: string
): Promise<string[]> {
  const { stdout: mergeBaseStdOut } = await asyncExec(
    `git merge-base origin/${branch} ${baseBranch}`
  )
  const mergeBase = mergeBaseStdOut.trim()
  const { stdout } = await asyncExec(
    `git --no-pager diff --name-only 'origin/${branch}' '${mergeBase}'`
  )
  const prefix = await getGitPrefix()
  return stdout.split(os.EOL).map((p) => {
    if (prefix && p.startsWith(prefix)) {
      return p.replace(prefix, '')
    }

    return p
  })
}

export function getListOfUrls(
  page: string,
  {
    hostname,
    dynamicPathsConfig,
  }: {
    hostname?: string
    dynamicPathsConfig?: Record<string, string[]>
  }
): string {
  if (dynamicPathsConfig && page in dynamicPathsConfig) {
    const paths = dynamicPathsConfig[page]
    if (hostname) {
      return paths
        .map(
          (p, i) =>
            `<li><a href="https://${hostname}${p}"><code>${page}</code> #${
              i + 1
            }</a></li>`
        )
        .join('')
    } else {
      return paths
        .map((p, i) => `<li><code>${p}</code> #${i + 1}</li>`)
        .join('')
    }
  }

  if (hostname && !page.includes('[')) {
    return `<li><a href="https://${hostname}${page}"><code>${page}</code></a></li>`
  }

  return `<li><code>${page}</code></li>`
}

export function generateCommentMarkdown(
  changedPages: string[],
  {
    baseBranch,
    baseBranchDeployUrl,
    branch,
    deployUrl,
    dynamicPathsConfig,
    packageName,
    skipCommentIfEmpty,
  }: {
    baseBranch?: string
    baseBranchDeployUrl?: string
    branch?: string
    deployUrl?: string
    dynamicPathsConfig?: Record<string, string[]>
    packageName?: string
    skipCommentIfEmpty?: boolean
  }
): string {
  // If there aren't any changed pages and skipCommentIfEmpty is truthy, return
  // an empty string.
  if (skipCommentIfEmpty && changedPages.length === 0) {
    return ''
  }

  let comment = summary.addHeading(
    packageName ? `📄 Changed Pages for ${packageName}` : '📄 Changed Pages',
    2
  )
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
          hostname: baseBranchDeployUrl,
          dynamicPathsConfig,
        }),
        getListOfUrls(p, {
          hostname: deployUrl,
          dynamicPathsConfig,
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
    /* eslint-disable @typescript-eslint/no-var-requires */
    const config = require(path.join(
      process.cwd(),
      'next-touched-pages.config.js'
    ))
    const pkg = require(path.join(process.cwd(), 'package.json'))
    /* eslint-enable @typescript-eslint/no-var-requires */

    return { name: pkg.name, ...config } as Configuration
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
    .option('branch', {
      description: 'the current branch',
      type: 'string',
      default: '',
    })
    .option('base-branch', {
      alias: 'b',
      description: 'base branch to compare against',
      type: 'string',
      conflicts: ['files'],
    })
    .option('base-branch-deploy-url', {
      description: 'Deploy URL of the base branch provided with --base-branch',
      type: 'string',
      default: '',
    })
    .option('deploy-url', {
      description: 'Deploy URL of the current branch',
      type: 'string',
      default: '',
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
      const gitChangedFiles = await getGitChangedFiles(
        argv.baseBranch,
        argv.branch
      )
      changedFiles = gitChangedFiles
    }

    changedFiles.forEach((f) => {
      const affectedPages = sourceToPageMap[f] ?? []
      affectedPages.forEach((p) => {
        changedPages.add(p)
      })
    })

    const sortedChangedPages = Array.from(changedPages).sort()

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
          branch: argv.branch,
          deployUrl: argv.deployUrl,
          baseBranch: argv.baseBranch,
          baseBranchDeployUrl: argv.baseBranchDeployUrl,
          dynamicPathsConfig: config.paths,
          packageName: config.name,
          skipCommentIfEmpty: config.skipCommentIfEmpty,
        })
        break
    }
  } catch (err) {
    console.error(err)
  }
}
