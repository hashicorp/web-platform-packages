/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

const highlightString = require('./').default
// Fixtures
const JS_FIXTURE = require('../fixtures/hello-world')
const JS_MULTILINE_FIXTURE = require('../fixtures/js-multiline')
const SHELL_FIXTURE = require('../fixtures/shell-hello')
const GO_FIXTURE = require('../fixtures/go-multiline')
const HCL_FIXTURE = require('../fixtures/hcl-config')
const WITH_HTML_ENTITIES_FIXTURE = require('../fixtures/with-html-entities')
const WITH_TOKEN_ACROSS_NEWLINE = require('../fixtures/with-token-across-newline')

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
