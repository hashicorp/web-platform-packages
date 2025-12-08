/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'

export function render(component: React.ReactNode): void {
  ReactDOM.render(
    <StrictMode>{component}</StrictMode>,
    document.getElementById('root')
  )
}
