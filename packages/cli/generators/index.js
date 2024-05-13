/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const component = require('./component')
const website = require('./website')
const page = require('./page')
const glossaryTerm = require('./glossary-term')
const ignoreBuildStep = require('./ignore-build-step')

module.exports = {
  component,
  website,
  page,
  'glossary-term': glossaryTerm,
  'ignore-build-step': ignoreBuildStep,
}
