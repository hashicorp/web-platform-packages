import path from 'path'
import fs from 'fs'

/**
 * Recursively finds all hashicorp packages that are installed in the current directory.
 *
 * @param directory the directory to search
 * @param isRecursive whether or not the function is recursing
 */
export function getHashicorpPackages(
  directory: string,
  isRecursive = false
): string[] {
  let results: string[] = []

  const packageJsonPath = path.join(directory, 'package.json')

  // If we're searching the root directory, check package.json for explicit dependencies. This helps with the case where we are running in a monorepo with dependency hoisting.
  if (!isRecursive && fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    if (packageJson.dependencies) {
      results = results.concat(
        Object.keys(packageJson.dependencies).filter((pkg) =>
          pkg.startsWith('@hashicorp/')
        )
      )
    }
  }

  const dirToSearch = path.join(directory, 'node_modules', '@hashicorp')

  if (!fs.existsSync(dirToSearch)) {
    return results
  }

  // grab all packages in the nested node_modules/@hashicorp directory
  fs.readdirSync(dirToSearch).forEach((dir) => {
    if (
      (dir !== 'react-global-styles' && dir.startsWith('react-')) ||
      dir.startsWith('platform-') ||
      dir === 'nextjs-scripts' ||
      dir === 'versioned-docs'
    )
      results.push(path.join(dirToSearch, dir))

    // call the function again to get nested deps
    results = results.concat(
      getHashicorpPackages(path.join(dirToSearch, dir), true)
    )
  })

  if (isRecursive) return results

  // if we're not a recursive call, resolve all of the paths relative to the first directory searched
  return results.map((dir) =>
    path.isAbsolute(dir)
      ? path.relative(path.join(directory, 'node_modules'), dir)
      : dir
  )
}
