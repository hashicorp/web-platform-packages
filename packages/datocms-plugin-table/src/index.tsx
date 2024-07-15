/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { connect } from 'datocms-plugin-sdk'
import { render } from './utils/render'
import FieldExtension from './entrypoints/FieldExtension'
import Modal from './entrypoints/Modal'
import 'datocms-react-ui/styles.css'

connect({
  manualFieldExtensions() {
    return [
      {
        id: 'table',
        type: 'editor',
        name: 'Advanced Table Editor',
        fieldTypes: ['json'],
      },
    ]
  },
  renderFieldExtension(id, ctx) {
    render(<FieldExtension ctx={ctx} />)
  },
  renderModal(id, ctx) {
    render(<Modal ctx={ctx} />)
  },
})
