import { remark } from 'remark'
import remarkMdx from 'remark-mdx'
import paragraphCustomAlerts from './index.js'

const compiler = remark().use(remarkMdx).use(paragraphCustomAlerts)

describe('paragraph-custom-alerts', () => {
  it('should produce the expected html output', () => {
    expect(compiler.processSync(`=> this is a success paragraph`).toString())
      .toMatchInlineSnapshot(`
      "<div className=\\"alert alert-success g-type-body\\">
        this is a success paragraph
      </div>
      "
    `)
  })

  it.only('should handle multiple paragraph blocks', () => {
    const md = `this is a normal, non-alert paragraph

~> this is a warning block

this is another "normal" block

=> success block here! yeah!`
    expect(compiler.processSync(md).toString()).toMatchInlineSnapshot(`
"this is a normal, non-alert paragraph

<div className=\\"alert alert-warning g-type-body\\">
  this is a warning block
</div>

this is another \\"normal\\" block

<div className=\\"alert alert-success g-type-body\\">
  success block here! yeah!
</div>
"
`)
  })
})
