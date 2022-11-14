import path from 'path'
import { loadRule, loadRules } from '../rules.js'
import { getFixturePath } from '../test/utils.js'

describe('loadRule', () => {
  test('loads local rules from a relative path', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const rule = await loadRule('./rules/local-no-h1.js', {
      cwd: fixturePath,
    })

    expect(rule.id).toBe('local-no-h1')
  })

  test('loads local rules from a fully qualified path', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const rule = await loadRule(
      path.join(fixturePath, './rules/local-no-h1.js')
    )

    expect(rule.id).toBe('local-no-h1')
  })

  test('loads internal rules from name', async () => {
    const rule = await loadRule('content-no-h1')

    expect(rule.id).toBe('no-h1')
  })
})

describe('loadRules', () => {
  test('loads internal rules', async () => {
    const rules = await loadRules({ 'content-no-h1': 'error' })

    expect(rules).toMatchInlineSnapshot(`
      [
        {
          "description": "Do not allow use of level 1 headings",
          "executor": {
            "contentFile": [Function],
            "dataFile": [Function],
          },
          "id": "no-h1",
          "type": "content",
        },
      ]
    `)
  })

  test('does not load rules if level is set to "off"', async () => {
    const rules = await loadRules({ 'content-no-h1': 'off' })

    expect(rules).toHaveLength(0)
  })

  test('loads local rules', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const rules = await loadRules(
      { './rules/local-no-h1': 'error' },
      fixturePath
    )

    expect(rules).toMatchInlineSnapshot(`
      [
        {
          "description": "Do not allow use of level 1 headings",
          "executor": {
            "contentFile": [Function],
            "dataFile": [Function],
          },
          "id": "local-no-h1",
          "type": "content",
        },
      ]
    `)
  })
})
