import { stringifyPosition } from 'unist-util-stringify-position'
import { VFile } from 'vfile'
import { statistics, VFileMessage } from 'vfile-statistics'

export function markdownReporter(files: VFile[]) {
  // @ts-expect-error - something is wrong with the VFile type used in vfile-statistics
  const stats = statistics(files)

  const lines = ['### 📄 Content Checks', '']

  // commit & timestamp

  // Make the timestamp generic so we can snapshot the output
  const updatedTimestamp =
    process.env.NODE_ENV === 'test' ? 'Date' : new Date().toUTCString()
  lines.push(`Updated: ${updatedTimestamp}`, '')

  // <details> header
  lines.push(`<details><summary>Found ${stats.fatal} error(s)</summary>`, '')

  const filesToReport = files.filter((f) => f.messages.length > 0)

  // Each file has section led by a heading, and a table with each violation
  filesToReport.forEach((file: VFile) => {
    // Heading
    lines.push(`#### \`${file.path}\``, '')

    const parseErrors: string[] = []
    const tableRows: string[] = []

    // Table row for each message
    file.messages.forEach((message: VFileMessage) => {
      if (!message.ruleId) {
        // Messages without an explicit rule ID are a result of errors while the file is being parsed.
        parseErrors.push(`\`\`\`
${message.reason}
\`\`\``)
        return
      }

      const columns = []

      if (message.position) {
        columns.push(`\`${stringifyPosition(message.position)}\``)
      } else {
        columns.push('')
      }

      columns.push(message.reason)

      // TODO: link to descriptive page for the rule
      columns.push(`\`${message.ruleId}\``)

      tableRows.push(`| ${columns.join(' | ')} |`)
    })

    // Global parse errors
    if (parseErrors.length > 0) {
      lines.push(...parseErrors, '')
    }

    // Table
    lines.push('| Position | Description | Rule |', '|---|---|---|')
    lines.push(...tableRows, '')
  })

  // Footnote
  // TODO: link to a README
  //  lines.push(
  //    '_Looking for more information? Check out the [content checks README](#TODO)_',
  //    ''
  //  )

  // Details footer
  lines.push('</details>')

  return lines.join('\n')
}
