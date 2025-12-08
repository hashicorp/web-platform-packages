/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import flat from 'flat'

// flatten navData json object and visit all paths (keys that end with ".path")
//
// ensure a <path>.mdx or <path>/index.mdx exists, but not both
function visitor(navData, filePaths, report, folder) {
  // flatten nav data file
  const flatNodes = flat(navData)
  // get all the paths from the nav data file
  const navDataPaths = Object.entries(flatNodes)
    .filter(([key]) => {
      return key.endsWith('.path')
    })
    .map(([, value]) => value)

  navDataPaths.forEach((p) => {
    const namedFile = `${p}.mdx`
    const indexFile = p ? `${p}/index.mdx` : `index.mdx`

    const namedFileExists = filePaths.includes(namedFile)
    const indexFileExists = filePaths.includes(indexFile)

    if (!namedFileExists && !indexFileExists) {
      report(
        `Failed to ensure valid nav paths exist.` +
          ` ` +
          `A nav data path (${p}) was found, but is missing a corresponding file in the website content directory.` +
          ` ` +
          `Please ensure that a (${folder}${namedFile}) or (${folder}${indexFile}) file exists.`
      )
    }

    if (namedFileExists && indexFileExists) {
      report(
        `Failed to ensure valid nav paths exist.` +
          ` ` +
          `Both a named file (${folder}${namedFile}) and an index file (${folder}${indexFile}) were detected for a single nav data path (${p}) in the website content directory` +
          ` ` +
          `Please ensure only one exists.`
      )
    }
  })
}

/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  id: 'ensure-valid-nav-paths',
  type: 'data',
  description: 'Ensures docs nav data paths have a corresponding content file.',
  executor: {
    async dataFile(file, context) {
      // by convention, nav data files are those that end in nav-data.json
      if (!file.basename.endsWith('nav-data.json')) {
        return
      }

      const subpath = file.basename.split('-nav-data.json')[0]
      // ex. /cloud.docs.agents/i
      const subpathRE = new RegExp(`^${subpath.replaceAll('-', '.')}/`, 'i')

      const navData = file.contents()

      const report = (message) => context.report(message, file)

      // for error logging purposes
      let contentDirMatch
      let subpathMatch

      // get all the paths of files in the {contentDir} directory under the {subpath}
      const fsPaths = context.contentFiles.map((e) => {
        let pathParts = e.path.split('/')
        // drop the first segment, (contentDir)
        contentDirMatch ??= pathParts[0]
        pathParts = pathParts.slice(1)

        let path = pathParts.join('/')
        if (!subpathRE.test(path)) {
          return false
        }

        subpathMatch ??= path.match(subpathRE)[0]

        // drop the subpath because navData paths
        // are relative to the subpath, which is part of the
        // filename: {subpath}-nav-data.json
        path = path.replace(subpathRE, '')
        return path
      })

      visitor(navData, fsPaths, report, contentDirMatch + '/' + subpathMatch)
    },
  },
}
