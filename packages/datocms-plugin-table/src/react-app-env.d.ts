/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/// <reference types="react-scripts" />

import { UseResizeColumnsColumnProps } from 'react-table'

declare module 'react-table' {
  export interface ColumnInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseResizeColumnsColumnProps<D> {}
}
