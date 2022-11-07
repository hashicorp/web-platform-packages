import path from 'path'
import { loadRule } from '../rules.js'
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
