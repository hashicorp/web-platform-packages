import path from 'path'
import url from 'url'

const currentFilePath = url.fileURLToPath(new URL(import.meta.url))

export function getFixturePath(fixtureName: string) {
  return path.join(
    path.dirname(currentFilePath),
    '..',
    '__tests__',
    '__fixtures__',
    fixtureName
  )
}
