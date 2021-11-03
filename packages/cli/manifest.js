const fs = require('fs')
const path = require('path')

const MANIFEST_FILE = 'version-manifest.json'
/**
 * @typedef {Object} Version
 * @prop {string} slug
 * @prop {string} display
 * @prop {number} ref 
 * @prop {number|undefined} sha
 * @prop {Record<string, string>|undefined} navData

 * @typedef {Version[]} VersionManifest
 */

/**
 * @returns {Promise<VersionManifest>}
 */
async function loadVersionManifest(cwd = process.cwd()) {
  let result = []

  try {
    result = JSON.parse(
      await fs.promises.readFile(path.join(cwd, MANIFEST_FILE), {
        encoding: 'utf-8',
      })
    )
  } catch {
    // fail silently
  }

  return result
}

async function writeVersionManifest(manifest, cwd = process.cwd()) {
  await fs.promises.writeFile(
    path.join(cwd, MANIFEST_FILE),
    JSON.stringify(manifest, null, 2) + '\n',
    { encoding: 'utf-8' }
  )
}

module.exports = {
  loadVersionManifest,
  writeVersionManifest,
  MANIFEST_FILE,
}
