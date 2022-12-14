import { stringifyPosition } from 'unist-util-stringify-position'
import { VFile } from 'vfile'
import { statistics, VFileMessage } from 'vfile-statistics'

export function markdownReporter(files: VFile[] /* sha?: string */) {
  // @ts-expect-error - something is wrong with the VFile type used in vfile-statistics
  const stats = statistics(files)

  const lines = ['### 📄 Content Checks', '']

  // commit & timestamp

  // TODO: the sha isn't available to the reporter yet
  // lines.push(`Latest commit: ${sha} (updated: ${new Date().toUTCString()})`, '')

  // Make the timestamp generic so we can snapshot the output
  const updatedTimestamp =
    process.env.NODE_ENV === 'test' ? 'Date' : new Date().toUTCString()
  lines.push(`Updated: ${updatedTimestamp}`, '')

  // <details> header
  lines.push(`<details><summary> Found ${stats.fatal} error(s)</summary>`, '')

  // Each file has section led by a heading, and a table with each violation
  files.forEach((file: VFile) => {
    // Heading and Table heading
    lines.push(
      `#### \`${file.path}\``,
      '',
      '| Position | Description | Rule |',
      '|---|---|---|'
    )

    // Table row for each message
    file.messages.forEach((message: VFileMessage) => {
      const columns = []

      if (message.position) {
        columns.push(`\`${stringifyPosition(message.position)}\``)
      } else {
        columns.push('')
      }

      columns.push(message.reason)

      // TODO: link to descriptive page for the rule
      columns.push(`[\`${message.ruleId}\`](#TODO)`)

      lines.push(`|${columns.join('|')}|`, '')
    })
  })

  // Footnote
  // TODO: link to a README
  lines.push(
    '_Looking for more information? Check out the [content checks README](#TODO)_',
    ''
  )

  // Details footer
  lines.push('</details>')

  return lines.join('\n')
}
