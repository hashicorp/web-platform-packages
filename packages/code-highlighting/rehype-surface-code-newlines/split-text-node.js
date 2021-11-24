/**
 * Given a string of text,
 * return an array which contains
 * all characters from the original
 * string but which has individual "\n"
 * array entries for all newline characters.
 *
 * This array can be joined with an
 * empty string to reconstruct the
 * original string.
 *
 * @param {String} string
 * @returns {String[]}
 */
export default function splitTextNode(string) {
  const noNewlines = string.indexOf('\n') === -1
  if (noNewlines) return [string]
  // if the string is literally just a newline,
  // then return an array with a single newline
  // to avoid messy logic later
  if (string === '\n') return [string]
  // split into parts on newlines,
  // and interleave the resulting array with newlines
  // eg "hello\nworld" becomes [ "hello", "world"], and
  // then with interleaved newlines is [ "hello", "\n", "world" ]
  const parts = string.split('\n')
  for (let i = parts.length - 1; i > 0; i--) {
    parts.splice(i, 0, '\n')
  }
  // filter out empty strings, consecutive newlines
  // will work either way and then empty strings would
  // just add unnecessary markup
  const filteredParts = parts.filter((p) => p !== '')
  // return the array
  return filteredParts
}
