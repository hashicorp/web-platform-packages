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
  onMultipleCellUpdate: (
    index: number,
    column: string,
    value: string[][]
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
    Object.values(data).every((v) => isRichText(v) || isBoolean(v))
  )
}

export const isBoolean = (data: unknown): data is boolean =>
  typeof data === 'boolean'

export const isRichText = (data: unknown): data is CellValue => {
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
