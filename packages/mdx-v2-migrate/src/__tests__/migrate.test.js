import { createMigrationCompiler, beforeParse } from '../migrate.js'

const compiler = createMigrationCompiler()

async function migrate(string) {
  const result = String(await compiler.process(await beforeParse(string)))
  return result.trim()
}

describe('mdx-v2-migrate', () => {
  test('escape < sign', async () => {
    const mdx = `Talk to me about <GITHUB_USER>`

    expect(await migrate(mdx)).toMatchInlineSnapshot(
      `"Talk to me about \\\\<GITHUB_USER>"`
    )
  })

  test('escape < sign - different usage', async () => {
    const mdx = `#### vault.route.<operation\\>.<mount\\>`

    expect(await migrate(mdx)).toMatchInlineSnapshot(
      `"#### vault.route.\\\\<operation>.\\\\<mount>"`
    )
  })

  test('Existing JSX', async () => {
    const mdx = `<CodeBlockConfig foo={{ foo: "bar" }}>

  hi

</CodeBlockConfig>`

    expect(await migrate(mdx)).toMatchInlineSnapshot(`
      "<CodeBlockConfig foo={{ foo: \\"bar\\" }}>

      hi

      </CodeBlockConfig>"
    `)
  })

  test('escape <= sign', async () => {
    const mdx = `1 is <= 2`

    expect(await migrate(mdx)).toMatchInlineSnapshot(`"1 is \\\\<= 2"`)
  })

  test('transform HTML comments', async () => {
    const mdx = `<!-- HTML comments are bad -->`

    expect(await migrate(mdx)).toMatchInlineSnapshot(
      `"{/* HTML comments are bad */}"`
    )
  })

  test('transform HTML comments - multi-line', async () => {
    const mdx = `<!-- HTML comments are bad
  
  Believe it
    
-->`

    expect(await migrate(mdx)).toMatchInlineSnapshot(`
      "{/* HTML comments are bad
        
        Believe it
          
      */}"
    `)
  })

  test('transform HTML comments - special characters', async () => {
    const mdx = `<!-- TODO: fixme -->`

    expect(await migrate(mdx)).toMatchInlineSnapshot(`"{/* TODO: fixme */}"`)
  })

  test('transform HTML comments - empty comment', async () => {
    const mdx = `
- \`roles\` \`(list [string] <required>)\` - List of roles that the API Key needs to have. If the roles array is provided:

* \`ip_addresses\` \`(list [string] <Optional>)\` - IP address to be added to the whitelist for the API key. This field is mutually exclusive with the cidrBlock field.
* \`cidr_blocks\` \`(list [string] <Optional>)\` - Whitelist entry in CIDR notation to be added for the API key. This field is mutually exclusive with the ipAddress field.`

    expect(await migrate(mdx)).toMatchInlineSnapshot(`
      "- \`roles\` \`(list [string] <required>)\` - List of roles that the API Key needs to have. If the roles array is provided:

      - \`ip_addresses\` \`(list [string] <Optional>)\` - IP address to be added to the whitelist for the API key. This field is mutually exclusive with the cidrBlock field.
      - \`cidr_blocks\` \`(list [string] <Optional>)\` - Whitelist entry in CIDR notation to be added for the API key. This field is mutually exclusive with the ipAddress field."
    `)
  })

  test('Escape brackets {}', async () => {
    const mdx = `This should be {escaped}`

    expect(await migrate(mdx)).toMatchInlineSnapshot(
      `"This should be \\\\{escaped}"`
    )
  })

  test('Double brackets {{}}', async () => {
    const mdx =
      'The lab provides an example configuration file, `least-req-resolver.hcl`{{open}} for _least_request_ policy.'

    expect(await migrate(mdx)).toMatchInlineSnapshot(
      `"The lab provides an example configuration file, \`least-req-resolver.hcl\`\\\\{\\\\{open}} for _least_request_ policy."`
    )
  })

  test('Double brackets - alternate', async () => {
    const mdx = `\`left_delimiter\` \`(string: "{{")\` - Delimiter to use in the template. The
    default is "{{" but for some templates, it may be easier to use a different
    delimiter that does not conflict with the output file itself.`

    expect(await migrate(mdx)).toMatchInlineSnapshot(`
      "\`left_delimiter\` \`(string: \\"{{\\")\` - Delimiter to use in the template. The
      default is \\"\\\\{\\\\{\\" but for some templates, it may be easier to use a different
      delimiter that does not conflict with the output file itself."
    `)
  })

  test('inline img element', async () => {
    const mdx = `**Click on the save icon <img src="/img/svg/instruqt-save.svg" style={{display: "inline", margin:0, height: "16px", width: "16px"}} alt="Instruqt editor save icon" />**`

    expect(await migrate(mdx)).toMatchInlineSnapshot(
      `"**Click on the save icon <img src=\\"/img/svg/instruqt-save.svg\\" style={{display: \\"inline\\", margin:0, height: \\"16px\\", width: \\"16px\\"}} alt=\\"Instruqt editor save icon\\" />**"`
    )
  })

  test('jsx in a list element', async () => {
    const mdx = `
  - Watch __Developing a secrets engine for HashiCorp Vault__.
    <VideoEmbed url={video} />
    <br />`

    expect(await migrate(mdx)).toMatchInlineSnapshot(
      `"- Watch **Developing a secrets engine for HashiCorp Vault**. <VideoEmbed url={video} /> <br />"`
    )
  })

  test('markup in a link', async () => {
    const mdx = `[<div>url</div>](https://example.com?foo&bar=1)`

    expect(await migrate(mdx)).toMatchInlineSnapshot(
      `"[<div>url</div>](https://example.com?foo\\\\&bar=1)"`
    )
  })

  test('formatted tag', async () => {
    const mdx = `<video
  muted
  playsInline
  autoPlay
  loop
  class="boundary-clickthrough-video boundary-clickthrough-desktop-video"
>
  <source
    type="video/mp4"
    src="https://www.datocms-assets.com/2885/1613612831-boundary-desktop-clickthrough-authenticate-v1-0-0.mp4"
  />
</video>`

    expect(await migrate(mdx)).toMatchInlineSnapshot(`
      "<video
      muted
      playsInline
      autoPlay
      loop
      class=\\"boundary-clickthrough-video boundary-clickthrough-desktop-video\\"

      >

        <source
          type=\\"video/mp4\\"
          src=\\"https://www.datocms-assets.com/2885/1613612831-boundary-desktop-clickthrough-authenticate-v1-0-0.mp4\\"
        />
      </video>"
    `)
  })

  test('elements in a table cell', async () => {
    const mdx = `| Sequence              | Matches                                                                          |
| --------------------- | -------------------------------------------------------------------------------- |
| <code>x|y</code> | either \`x\` or \`y\`, preferring \`x\`                                                |
`

    expect(await migrate(mdx)).toMatchInlineSnapshot(`
      "| Sequence              | Matches                                                                          |
      | --------------------- | -------------------------------------------------------------------------------- |
      | \`x\\\\|y\` | either \`x\` or \`y\`, preferring \`x\`                                                |"
    `)
  })
})
