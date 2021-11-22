import splitTextNode from './split-text-node'

/**
 * Given an array of HAST tokens, extract newlines
 * and bubble them up so they are direct children of
 * the array, while preserving the ancestor structure
 * of all tokens.
 *
 * More info about HAST trees:
 * https://github.com/syntax-tree/hast
 *
 * @param {Array} tokensArray Array of HAST tokens.
 * @param {Number} depth For internal use
 * @returns
 */
export default function surfaceNewlines(tokensArray, depth = 0) {
  return tokensArray.reduce((acc, token) => {
    // return text tokens
    const isTextToken = token.type == 'text'
    if (isTextToken) {
      const splitParts = splitTextNode(token.value)
      const splitNodes = splitParts.map((value) => ({
        type: 'text',
        value,
      }))
      return acc.concat(splitNodes)
    }
    // otherwise, assumed to be an "element" token.
    // we must process these tokens' children.
    const processedChildren = surfaceNewlines(token.children, depth + 1)
    const processedTokens = processedChildren.reduce(
      (childrenAcc, child, childIdx) => {
        // On newlines, wrap up the current ancestor, and start a new one
        const isNewline = child.type === 'text' && child.value == '\n'
        if (isNewline) {
          // If there are any, push grouped (non-newline) tokens
          // wrapped in the parent element
          if (childrenAcc.currentGroup.length > 0) {
            const processedToken = Object.assign({}, token, {
              children: childrenAcc.currentGroup,
            })
            childrenAcc.tokens.push(processedToken)
          }
          // Reset the non-breaking children
          childrenAcc.currentGroup = []
          // Push the newline text token, and continue
          childrenAcc.tokens.push(child)
          return childrenAcc
        }
        // All other tokens are guaranteed to not contain newlines,
        // as we've done a depth-first traversal using surfaceNewLines.
        // We avoid creating duplicative parent elements by grouping
        // these tokens together
        childrenAcc.currentGroup.push(child)
        // If this is the last child, we need to ensure
        // the currentGroup is rendered
        if (childIdx == processedChildren.length - 1) {
          const processedToken = Object.assign({}, token, {
            children: childrenAcc.currentGroup,
          })
          childrenAcc.tokens.push(processedToken)
        }
        return childrenAcc
      },
      { tokens: [], currentGroup: [] }
    ).tokens
    return acc.concat(processedTokens)
  }, [])
}
