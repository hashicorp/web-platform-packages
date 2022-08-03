import { dequal } from 'dequal'
import { Row as TableRow } from 'react-table'
// TypeScript users only add this code
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

export type TableProps = {
  columns: string[]
  data: Data
}

export type Value = {
  collapsibleRows: Array<number>
  hasColumnHeaders: boolean
  table: TableProps
}

export type CellValue = {
  heading: string
  content?: string
}

export type Row = Record<string, boolean | CellValue>
// export interface Row { [x: string]: boolean | CellValue }

export type Data = Row[]

export type Actions = {
  onCellUpdate: (
    index: number,
    column: string,
    value: CellValue | boolean
  ) => void
  onAddColumn: (column: string, toTheLeft: boolean) => void
  onRemoveColumn: (column: string) => void
  onColumnRename: (column: string, newColumn: string) => void
  onAddRow: (row: number, toTheBottom: boolean) => void
  onRemoveRow: (row: number) => void
  onChangeRowType: (row: number, type: string) => void
  onChangeRowCollapse: (row: number) => void
}

const isObject = (data: unknown): data is Record<string, unknown> => {
  return typeof data === 'object' && !Array.isArray(data) && data !== null
}

export const isRow = (data: unknown): data is Row => {
  return (
    isObject(data) &&
    Object.values(data).every((v) => isCellValue(v) || isBoolean(v))
  )
}

export const isBoolean = (data: unknown): data is boolean =>
  typeof data === 'boolean'

export const isCellValue = (data: unknown): data is CellValue => {
  return (
    isObject(data) &&
    Object.keys(data).every(
      (k) => (k === 'heading' || k === 'content') && typeof data[k] === 'string'
    )
  )
}

const isColumns = (data: unknown): data is string[] => {
  if (!Array.isArray(data)) {
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
    'table' in data &&
    'columns' in (data as any).table &&
    isColumns((data as any).table.columns) &&
    'data' in (data as any).table &&
    isData((data as any).table.data, (data as any).table.columns as string[]) &&
    'hasColumnHeaders' in data &&
    isBoolean(data.hasColumnHeaders) &&
    'collapsibleRows' in data &&
    Array.isArray(data.collapsibleRows)
  )
}
