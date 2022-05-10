import { COMPONENT_TYPES } from './constants'

export function isValidDocsPath(filePath: string): boolean {
  // Allow the docs root folder
  const isDocsRoot = filePath === 'docs/'
  // Allow component folders
  const isComponentRoot = COMPONENT_TYPES.reduce((acc, type) => {
    return acc || filePath === `docs/${type}/`
  }, false)
  // Allow .mdx files in component folders
  const isComponentDocsContent = isValidDocsContentPath(filePath)
  // Allow docs/README.md files
  const isDocsReadme = filePath == 'docs/README.md'
  // Combine all allowed types
  const isValidPath =
    isDocsRoot || isComponentRoot || isComponentDocsContent || isDocsReadme
  return isValidPath
}

export function isValidDocsContentPath(filePath: string): boolean {
  return COMPONENT_TYPES.reduce((acc: boolean, type: string) => {
    const mdxPathRegex = new RegExp(`^docs/${type}/(.*).mdx?$`)
    const isValidMdxFile = mdxPathRegex.test(filePath)
    return acc || isValidMdxFile
  }, false)
}
