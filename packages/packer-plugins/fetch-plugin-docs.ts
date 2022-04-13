import fetch from 'isomorphic-unfetch'
import { parseSourceZip } from './parse-source-zip'
import { parseDocsZip } from './parse-docs-zip'
import { RawPluginFile } from './types'

interface Options {
  repo: string
  tag: string
}

// Given a repo and tag,
//
// return [null, docsMdxFiles] if docs files
// are successfully fetched and valid,
// where docsMdxFiles is an array of { filePath, fileString } items.
//
// otherwise, return [err, null]
// where err is an error message describing whether the
// docs files were missing or invalid, with a path to resolution
async function fetchDocsFiles({ repo, tag }: Options) {
  // If there's a docs.zip asset, we'll prefer that
  const docsZipUrl =
    tag === 'latest'
      ? `https://github.com/${repo}/releases/latest/download/docs.zip`
      : `https://github.com/${repo}/releases/download/${tag}/docs.zip`
  const docsZipResponse = await fetch(docsZipUrl, { method: 'GET' })
  const hasDocsZip = docsZipResponse.status === 200
  // Note: early return!
  if (hasDocsZip) {
    return await parseDocsZip(docsZipResponse)
  }
  // Else if docs.zip is not present, and we only have the "latest" tag,
  // then throw an error - we can't resolve the fallback source ZIP
  // unless we resort to calling the GitHub API, which we do not want to do
  if (tag === 'latest') {
    const err = `Failed to fetch. Could not find "docs.zip" at ${docsZipUrl}. To fall back to parsing docs from "source", please provide a specific version tag instead of "${tag}".`
    return [err, null]
  }
  // Else if docs.zip is not present, and we have a specific tag, then
  // fall back to parsing docs files from the source zip
  const sourceZipUrl = `https://github.com/${repo}/archive/${tag}.zip`
  const sourceZipResponse = await fetch(sourceZipUrl, { method: 'GET' })
  const missingSourceZip = sourceZipResponse.status !== 200
  if (missingSourceZip) {
    const err = `Failed to fetch. Could not find "docs.zip" at ${docsZipUrl}, and could not find fallback source ZIP at ${sourceZipUrl}. Please ensure one of these assets is available.`
    return [err, null]
  }
  // Handle parsing from plugin source zip
  return await parseSourceZip(sourceZipResponse)
}

const fetchPluginDocs = memoize(async function fetchPluginDocs({
  repo,
  tag,
}: Options): Promise<RawPluginFile[]> {
  const [err, docsMdxFiles] = await fetchDocsFiles({ repo, tag })
  if (err) {
    const errMsg = `Invalid plugin docs ${repo}, on release ${tag}. ${err}`
    throw new Error(errMsg)
  }
  // TODO: fix the rest of the types so we don't have to cast here
  return docsMdxFiles as RawPluginFile[]
})

function memoize<T extends (...args: any[]) => unknown>(method: T): T {
  const cache: Record<string, ReturnType<T>> = {}
  return async function (...args) {
    const key = JSON.stringify(args)
    if (!cache[key]) {
      // @ts-expect-error -- not sure on the correct way to type `this` here
      cache[key] = method.apply(this, args)
    }
    return cache[key]
  } as T
}

export default fetchPluginDocs
