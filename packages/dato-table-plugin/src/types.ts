import { dequal } from 'dequal'
import { Row as TableRow } from 'react-table'
// TypeScript users only add this code
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

export type TableProps = {
  columns: string[]
  data: Row[]
}

export type Value = {
  collapsibleRows: Array<number>
  hasColumnHeaders: boolean
  table: TableProps
}

export type Row = Record<string, any>

export type Data = Row[]

export type CellValue = {
  heading: string
  content?: string
}

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

const isRow = (data: unknown): data is Row => {
  return (
    isObject(data) &&
    Object.values(data).every(
      (v) => typeof v === 'string' || typeof v === 'boolean'
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

export const isValue = (data: unknown): data is TableProps => {
  return (
    isObject(data) &&
    'columns' in data &&
    isColumns((data as any).columns) &&
    'data' in data
    // &&
    // isData((data as any).data, (data as any).columns as string[])
  )
}
