/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'

function findUp(filename: string, start = process.cwd()) {
  let result
  const root = path.parse(start).root
  let currentDir = start

  while (!result) {
    // If we traverse all the way up to the root dir without finding a package-lock, abort
    if (currentDir === root) {
      break
    }

    const maybePath = path.join(currentDir, filename)

    if (fs.existsSync(maybePath)) {
      result = maybePath
      break
    } else {
      currentDir = path.resolve(currentDir, '..')
    }
  }

  return result
}

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

  // Traverse up to the root of the monorepo to ensure we detect any transitive dependencies of hoisted packages
  if (!isRecursive) {
    const monorepoRoot = findUp('package-lock.json', directory)

    if (monorepoRoot) {
      const rootMonorepoDir = path.dirname(monorepoRoot)

      // Ensure we aren't double-dipping in the same directory
      if (rootMonorepoDir !== directory) {
        results = results.concat(
          getHashicorpPackages(rootMonorepoDir, true).map((packageDir) =>
            path.relative(
              path.join(rootMonorepoDir, 'node_modules'),
              packageDir
            )
          )
        )
      }
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
      dir === 'flight-icons'
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
