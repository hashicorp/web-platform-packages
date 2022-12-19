import flat from 'flat'

// flatten navData json object and visit all paths (keys that end with ".path")
//
// ensure a <path>.mdx or <path>/index.mdx exists, but not both
function visitor(navData, filePaths, report) {
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
    const indexFile = `${p}/index.mdx`

    const namedFileExists = filePaths.includes(namedFile)
    const indexFileExists = filePaths.includes(indexFile)

    if (!namedFileExists && !indexFileExists) {
      report(
        `NavData path (${p}) is missing a corresponding file in the content directory`
      )
    }

    if (namedFileExists && indexFileExists) {
      report(
        `NavData path (${p}) should not have both a named file and an index file in the content directory`
      )
    }
  })
}

/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  id: 'ensure-valid-nav-paths',
  type: 'data',
  description: 'TODO.',
  executor: {
    async dataFile(file, context) {
      // by convention, nav data files are those that end in nav-data.json
      if (!file.basename.endsWith('nav-data.json')) {
        return
      }

      const subpath = file.basename.split('-nav-data.json')[0]
      const navData = file.contents()

      const report = (message) => context.report(message, file)

      // get all the paths of files in the {contentDir} directory under the {subpath}
      const fsPaths = context.contentFiles.map((e) => {
        let pathParts = e.path.split('/')
        // drop the first segment, (contentDir)
        pathParts = pathParts.slice(1)
        // only keep the paths that are under the {subpath}
        if (pathParts[0] !== subpath) {
          return false
        }
        // drop the subpath because navData paths
        // are relative to the subpath, which is part of the
        // filename: {subpath}-nav-data.json
        pathParts = pathParts.slice(1)
        return pathParts.join('/')
      })

      visitor(navData, fsPaths, report)
    },
  },
}
