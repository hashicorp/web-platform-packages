/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { dequal } from 'dequal'

export type Value = {
  collapsibleRows: Array<number>
  hasColumnHeaders: boolean
  table: TableProps
}

export type TableProps = {
  columns: string[]
  data: Data
}

export type RichTextProps = {
  heading: string
  content?: string
}

export type CellValue = boolean | RichTextProps

export type Row = Record<string, CellValue>

export type Data = Row[]

export type Actions = {
  onCellUpdate: (index: number, column: string, value: CellValue) => void
  onAddColumn: (column: string, toTheLeft: boolean) => void
  onMoveColumn: (column: string, toTheLeft: boolean) => void
  onRemoveColumn: (column: string) => void
  onColumnRename: (column: string, newColumn: string) => void
  onAddRow: (row: number, toTheBottom: boolean) => void
  onRemoveRow: (row: number) => void
  onChangeRowType: (row: number, cellType: CellTypeInfo) => void
  onChangeRowCollapse: (row: number) => void
}

const isObject = (data: unknown): data is Record<string, unknown> => {
  return typeof data === 'object' && !Array.isArray(data) && data !== null
}

export const isRow = (data: unknown): data is Row => {
  return (
    isObject(data) &&
    Object.values(data).every((v) =>
      cellTypes.some(({ isOfType }) => isOfType(v))
    )
  )
}

const isColumns = (data: unknown): data is string[] => {
  if (!Array.isArray(data)) {
    return false
  }

  if (data.length === 0) {
    return false
  }

  return data.every((column) => typeof column === 'string')
}

const isData = (data: unknown, columns: string[]): data is Data => {
  if (!Array.isArray(data)) {
    return false
  }
  const sortedColumns = [...columns].sort()

  return data.every(
    (row) => isRow(row) && dequal(sortedColumns, Object.keys(row).sort())
  )
}

export const isValue = (data: unknown): data is Value => {
  return (
    isObject(data) &&
    'columns' in data &&
    isColumns((data as any).columns) &&
    'data' in data &&
    isData((data as any).data, (data as any).columns as string[])
  )
}

export interface CellTypeInfo {
  name: string
  defaultVal: CellValue
  isOfType: (val: unknown) => boolean
}

export const cellTypes: Array<CellTypeInfo> = [
  {
    name: 'rich text',
    defaultVal: { heading: '', content: '' },
    isOfType: (val) =>
      !!val &&
      typeof val === 'object' &&
      Object.keys(val).every((k) => k === 'heading' || k === 'content'),
  },
  {
    name: 'checkbox',
    defaultVal: false,
    isOfType: (val) => typeof val === 'boolean',
  },
]
