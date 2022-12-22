import flat from 'flat'

const trailingIndexPattern = /\/?index/

const productSlugs = [
  'packer',
  'terraform',
  'vault',
  'boundary',
  'consul',
  'nomad',
  'waypoint',
  'vagrant',
  'hcp',
]

let flattenedNavData = []

/**
 * Transform detected nav data files into a flat list of paths. Also exposes a pattern derived from the nav-data file name to determine if a path should be represented in a specific nav data file.
 */
function getFlattenedNavData(dataFiles) {
  let result = []

  if (flattenedNavData.length > 0) {
    // only compute this once
    return flattenedNavData
  }

  for (const file of dataFiles) {
    // by convention, nav data files are those that end in nav-data.json
    if (!file.basename.endsWith('nav-data.json')) {
      continue
    }

    const navData = file.contents()

    const basePath = file.basename.split('-nav-data.json')[0]
    // ex. /cloud.docs.agents(\/|$)/i
    const basePathPattern = new RegExp(
      `^${basePath.replaceAll('-', '.')}(/|$)`,
      'i'
    )

    // removes /{productSlug}/{basePath}/ from a nav path
    const normalizeNavDataPathPattern = new RegExp(
      `^(/(${productSlugs.join('|')})/)?${basePath.replace('-', '.')}`,
      'i'
    )

    // get all the paths from the nav data file
    const navDataPaths = Object.entries(flat(navData))
      .filter(([key]) => {
        return key.endsWith('.path')
      })
      .map(([, value]) => {
        // replace product prefixes to ensure we support developer-relative paths
        // /waypoint/docs -> ''
        // docs -> ''
        // /waypoint/docs/foo/bar -> foo/bar
        // index -> ''
        return value
          .replace(normalizeNavDataPathPattern, '')
          .replace(trailingIndexPattern, '')
      })

    result.push({
      basePathPattern,
      paths: navDataPaths,
      navDataPath: file.path,
    })
  }

  // Avoid the in-memory cache to enable testing
  if (process.env.NODE_ENV !== 'test') {
    flattenedNavData = result
  }

  return result
}

/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  id: 'no-unlinked-pages',
  type: 'content',
  description:
    'Checks each file and validates that there is a corresponding nav node that links to it. Errors if a file exists that is not linked in its associated nav data file.',
  executor: {
    async contentFile(file, context) {
      if (file.isPartial) {
        // we do not expect partial files to be linked directly
        return
      }

      const normalizedFilePath = file.path
        // remove the content directory (content/docs/foo.mdx -> docs/foo.mdx)
        .split('/')
        .slice(1)
        // If it's an index.mdx file, remove the filename as we don't include "index" in nav nodes
        .filter((pathSegment) => pathSegment !== 'index.mdx')
        .join('/')
        // remove the file extension
        .replace(/\.mdx$/, '')

      for (const { basePathPattern, paths, navDataPath } of getFlattenedNavData(
        context.dataFiles
      )) {
        // validate that this file belongs to the nav data based on its basePath
        if (!basePathPattern.test(normalizedFilePath)) {
          continue
        }

        // docs -> ''
        // docs/foo/bar -> foo/bar
        const normalizedFilePathWithoutBasePath = normalizedFilePath.replace(
          basePathPattern,
          ''
        )

        const isRootIndexPath =
          normalizedFilePathWithoutBasePath === 'index' ||
          normalizedFilePathWithoutBasePath === ''

        if (
          !paths.includes(normalizedFilePathWithoutBasePath) &&
          !isRootIndexPath
        ) {
          context.report(
            `This file is not present in the nav data file at ${navDataPath}. Either add a path that maps to this file in the nav data or remove the file. If you want the page to exist but not be linked in the navigation, add a \`hidden\` property to the associated nav node.`,
            file
          )
        }
      }
    },
  },
}
