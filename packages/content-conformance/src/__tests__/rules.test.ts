import { jest } from '@jest/globals'
import path from 'path'
import { lintRule } from 'unified-lint-rule'
import { visit } from 'unist-util-visit'
import { convertRemarkLintRule, loadRule, loadRules } from '../rules.js'
import { getFixturePath } from '../test/utils.js'

describe('loadRule', () => {
  test('loads local rules from a relative path', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const rule = await loadRule('./rules/local-no-h1.js', {
      level: 'error',
      cwd: fixturePath,
    })

    expect(rule!.id).toBe('local-no-h1')
  })

  test('loads local rules from a fully qualified path', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const rule = await loadRule(
      path.join(fixturePath, './rules/local-no-h1.js'),
      {
        level: 'error',
      }
    )

    expect(rule!.id).toBe('local-no-h1')
  })

  test('loads internal rules from name', async () => {
    const rule = await loadRule('content-no-h1', {
      level: 'error',
    })

    expect(rule!.id).toBe('no-h1')
  })

  test('loads remark-lint rules', async () => {
    const rule = await loadRule('remark-lint-no-inline-padding', {
      level: 'error',
    })

    expect(rule!.id).toBe('remark-lint:no-inline-padding')
  })

  test('errors when remark-lint rule cannot be found', async () => {
    const consoleSpy = jest.spyOn(console, 'error')

    await loadRule('remark-lint-does-not-exist', {
      level: 'error',
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /error loading remark-lint rule: remark-lint-does-not-exist/
      )
    )
  })
})

describe('loadRules', () => {
  test('loads internal rules', async () => {
    const rules = await loadRules({ ['content-no-h1' as string]: 'error' })

    expect(rules).toMatchInlineSnapshot(`
      [
        {
          "description": "Do not allow use of level 1 headings",
          "executor": {
            "contentFile": [Function],
            "dataFile": [Function],
          },
          "id": "no-h1",
          "level": "error",
          "type": "content",
        },
      ]
    `)
  })

  test('does not load rules if level is set to "off"', async () => {
    const rules = await loadRules({ ['content-no-h1' as string]: 'off' })

    expect(rules).toHaveLength(0)
  })

  test('sets rule severity from config', async () => {
    const rules = await loadRules({ ['content-no-h1' as string]: 'warn' })

    expect(rules[0].level).toEqual('warn')
  })

  test('loads local rules', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const rules = await loadRules(
      { ['./rules/local-no-h1' as string]: 'error' },
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
          "level": "error",
          "type": "content",
        },
      ]
    `)
  })
})

describe('convertRemarkLintRule', () => {
  test('converts a remark-lint style rule into a valid conformance rule object', () => {
    const rule = lintRule(
      {
        origin: 'remark-lint:no-h1',
        url: 'https://github.com/hashicorp/web-platform-packages',
      },
      (tree, file) => {
        visit(tree, ['heading'], (node) => {
          if (node.depth === 1) {
            file.fail('Level 1 headings are not allowed', node)
          }
        })
      }
    )

    const convertedRule = convertRemarkLintRule(rule, 'error')

    expect(convertedRule).toMatchInlineSnapshot(`
      {
        "description": "",
        "executor": {
          "contentFile": [Function],
        },
        "id": "remark-lint:no-h1",
        "level": "error",
        "type": "content",
      }
    `)
  })
})
