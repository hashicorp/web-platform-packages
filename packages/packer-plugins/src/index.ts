/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import grayMatter from 'gray-matter'
import { fetchDevPluginDocs } from './fetch-dev-plugin-docs'
import { fetchPluginDocs } from './fetch-plugin-docs'
import { PluginFile, PluginManifestEntry } from './types'

/**
 * Takes in a plugin manifest array and returns it decorated with file data for each plugin.
 *
 * Example:
 *
 * ```ts
 * const result = resolvePluginDocs([
 *   {
 *     title: '1&1',
 *     path: 'oneandone',
 *     repo: 'hashicorp/packer-plugin-oneandone',
 *     pluginTier: 'community',
 *     version: 'latest',
 *   },
 * ])
 *
 * console.log(result.files) // [{ filePath, fileString, path, sourceUrl, title }]
 * ```
 */
export async function resolvePluginDocs(pluginManifest: PluginManifestEntry[]) {
  return Promise.all(
    pluginManifest.map(async (manifestEntry) => {
      const {
        repo,
        pluginTier,
        zipFile = '',
        version,
        sourceBranch = 'main',
      } = manifestEntry
      // Determine the pluginTier, which can be set manually,
      // or will be automatically set based on repo ownership
      const pluginOwner = repo.split('/')[0]
      const parsedPluginTier =
        pluginTier || (pluginOwner === 'hashicorp' ? 'official' : 'community')
      // Fetch the MDX files for the plugin entry
      let docsMdxFiles = []
      if (zipFile !== '') {
        docsMdxFiles = (await fetchDevPluginDocs(zipFile)) ?? []
      } else {
        docsMdxFiles = await fetchPluginDocs({ repo, tag: version })
      }

      const files: PluginFile[] = docsMdxFiles.map((rawFile) => {
        const { filePath, fileString } = rawFile
        // Process into a NavLeaf, with a remoteFile attribute
        const dirs = path.dirname(filePath).split('/')
        const dirUrl = dirs.slice(2).join('/')
        const basename = path.basename(filePath, path.extname(filePath))
        // build urlPath
        // note that this will be prefixed to get to our final path
        const isIndexFile = basename === 'index'
        const urlPath = isIndexFile ? dirUrl : path.join(dirUrl, basename)
        // parse title, either from frontmatter or file name
        const { data: frontmatter } = grayMatter(fileString)
        const { nav_title, sidebar_title } = frontmatter
        const title = nav_title || sidebar_title || basename
        // construct sourceUrl (used for "Edit this page" link)
        const sourceUrl = `https://github.com/${repo}/blob/${sourceBranch}/${filePath}`

        return {
          filePath,
          fileString,
          title,
          path: urlPath,
          sourceUrl,
        }
      })

      return {
        ...manifestEntry,
        pluginTier: parsedPluginTier,
        files,
      }
    })
  )
}
