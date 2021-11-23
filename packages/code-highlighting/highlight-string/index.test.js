import highlightString from './'
// Fixtures
import JS_FIXTURE from '../fixtures/hello-world'
import JS_MULTILINE_FIXTURE from '../fixtures/js-multiline'
import SHELL_FIXTURE from '../fixtures/shell-hello'
import GO_FIXTURE from '../fixtures/go-multiline'
import HCL_FIXTURE from '../fixtures/hcl-config'
import WITH_HTML_ENTITIES_FIXTURE from '../fixtures/with-html-entities'
import WITH_TOKEN_ACROSS_NEWLINE from '../fixtures/with-token-across-newline'

test('returns an unmodified string if language is undefined', () => {
  const code = JS_FIXTURE.input
  const language = undefined
  return highlightString(code, language).then((result) => {
    expect(result).toBe(code)
  })
})

test('highlights a single-line shell-session example', () => {
  const code = SHELL_FIXTURE.input
  const language = 'shell-session'
  const expectedResult = SHELL_FIXTURE.output
  return highlightString(code, language).then((result) => {
    expect(result).toBe(expectedResult)
  })
})

test('highlights a single-line Javascript example', () => {
  const code = JS_FIXTURE.input
  const language = 'javascript'
  const expectedResult = JS_FIXTURE.output
  return highlightString(code, language).then((result) => {
    expect(result).toBe(expectedResult)
  })
})

test('highlights a multi-line Javascript example', () => {
  const code = JS_MULTILINE_FIXTURE.input
  const language = 'javascript'
  const expectedResult = JS_MULTILINE_FIXTURE.output
  return highlightString(code, language).then((result) => {
    expect(result).toBe(expectedResult)
  })
})

test('highlights a multi-line Go example', () => {
  const code = GO_FIXTURE.input
  const language = 'go'
  const expectedResult = GO_FIXTURE.output
  return highlightString(code, language).then((result) => {
    expect(result).toBe(expectedResult)
  })
})

test('highlights a multi-line HCL example', () => {
  const code = HCL_FIXTURE.input
  const language = 'hcl'
  const expectedResult = HCL_FIXTURE.output
  return highlightString(code, language).then((result) => {
    expect(result).toBe(expectedResult)
  })
})

test('escapes <, >, and & to avoid issues when rendering tokens as HTML', () => {
  const code = WITH_HTML_ENTITIES_FIXTURE.input
  const language = 'shell-session'
  const expectedResult = WITH_HTML_ENTITIES_FIXTURE.output
  return highlightString(code, language).then((result) => {
    expect(result).toBe(expectedResult)
  })
})

test('surfaces newlines such that token spans  do not span multiple lines', () => {
  const code = WITH_TOKEN_ACROSS_NEWLINE.input
  const language = 'javascript'
  const expectedResult = WITH_TOKEN_ACROSS_NEWLINE.output
  return highlightString(code, language).then((result) => {
    expect(result).toBe(expectedResult)
  })
})
