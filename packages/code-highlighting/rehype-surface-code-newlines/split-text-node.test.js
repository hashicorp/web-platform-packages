/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

const splitTextNode = require('./split-text-node')

it('returns a string without newlines as a single-element array', () => {
  expect(splitTextNode('hello')).toMatchObject(['hello'])
})

it('returns a single newline as a single-element array', () => {
  expect(splitTextNode('\n')).toMatchObject(['\n'])
})

it('returns a basic example', () => {
  expect(splitTextNode('hello\nworld')).toMatchObject(['hello', '\n', 'world'])
})

it('handles cases that start with newlines', () => {
  expect(splitTextNode('\nhello\nworld')).toMatchObject([
    '\n',
    'hello',
    '\n',
    'world',
  ])
})

it('handles cases that end with newlines', () => {
  expect(splitTextNode('hello\nworld\n')).toMatchObject([
    'hello',
    '\n',
    'world',
    '\n',
  ])
})

it('handles cases with consecutive newlines', () => {
  expect(splitTextNode('\n\nhello\n\nworld\n\n')).toMatchObject([
    '\n',
    '\n',
    'hello',
    '\n',
    '\n',
    'world',
    '\n',
    '\n',
  ])
})
