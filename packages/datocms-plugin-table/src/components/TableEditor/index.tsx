/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  Column,
  TableOptions,
} from 'react-table'
import { useDeepCompareMemo } from 'use-deep-compare'
import { Actions, cellTypes, Row, Value } from '../../types'
import EditableCell from '../EditableCell'
import omit from 'lodash-es/omit'
import EditableHeader from '../EditableHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCaretUp,
  faCaretDown,
  faExpand,
  faPlus,
  faTrash,
  faLongArrowAltDown,
  faLongArrowAltUp,
  faTrashAlt,
  faCog,
  faMinus,
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownOption,
  DropdownSeparator,
} from 'datocms-react-ui'
import classNames from 'classnames'
import s from './styles.module.css'
import { isBlankColumnHeader } from '../../utils/constants'

type Props = {
  value: Value
  onChange: (value: Value | null) => void
  onOpenInFullScreen?: () => void
}

function orderedKeys<T extends { [k: string]: unknown }>(
  object: T,
  columns: string[]
): T {
  return Object.fromEntries(
    Object.entries(object).sort(
      ([key1], [key2]) => columns.indexOf(key1) - columns.indexOf(key2)
    )
  ) as T
}

function moveItemInArray<T>(
  arr: T[],
  fromIndex: number,
  toTheLeft: boolean
): T[] {
  const newArray = [...arr]
  const toIndex = toTheLeft ? fromIndex - 1 : fromIndex + 1

  var element = newArray[fromIndex]
  newArray.splice(fromIndex, 1)
  newArray.splice(toIndex, 0, element)

  return newArray
}

export default function TableEditor({
  value,
  onChange,
  onOpenInFullScreen,
}: Props) {
  const { collapsibleRows, hasColumnHeaders, table } = value
  const [collapsedRows, setCollapsedRows] = useState<Array<number>>([])

  function removeCollapsedRow(idx: number) {
    const updatedCollapsedRows = [...collapsedRows]
    const currentCollapsibleRowIdx = updatedCollapsedRows.indexOf(idx)
    updatedCollapsedRows.splice(currentCollapsibleRowIdx, 1)
    setCollapsedRows(updatedCollapsedRows)
  }

  function handleCollapseRow(idx: number) {
    if (collapsedRows.includes(idx)) {
      removeCollapsedRow(idx)
    } else {
      setCollapsedRows([...collapsedRows, idx])
    }
  }

  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  )

  const tableColumns = useDeepCompareMemo<Column<Row>[]>(
    () =>
      table.columns.map((column) => ({
        Header: EditableHeader,
        Cell: EditableCell,
        id: !column.length ? 'BLANK_COLUMN_HEADER' : column,
        accessor: (row: Row) => row[column],
      })),
    [{}, table.columns]
  )

  const onCellUpdate: Actions['onCellUpdate'] = (index, column, cellValue) => {
    onChange({
      ...value,
      table: {
        ...table,
        data: table.data.map((row, i) =>
          i !== index
            ? row
            : orderedKeys(
                {
                  ...row,
                  [isBlankColumnHeader(column) ? '' : column]: cellValue,
                },
                table.columns
              )
        ),
      },
    })
  }

  const onColumnRename: Actions['onColumnRename'] = (oldColumn, newColumn) => {
    const updatedColumn = isBlankColumnHeader(newColumn) ? '' : newColumn
    const newColumns = table.columns.map((c) =>
      c === oldColumn ? updatedColumn : c
    )
    onChange({
      ...value,
      table: {
        columns: newColumns,
        data: table.data.map((row, i) =>
          orderedKeys(
            {
              ...omit(row, [oldColumn]),
              [updatedColumn]:
                newColumn === ''
                  ? { heading: '', content: '' }
                  : row[oldColumn],
            },
            newColumns
          )
        ),
      },
    })
  }

  const onRemoveColumn: Actions['onRemoveColumn'] = (column) => {
    onChange({
      ...value,
      table: {
        columns: table.columns.filter((c) => c !== column),
        data: table.data.map((row, i) => omit(row, [column])),
      },
    })
  }

  const findNewColumnName = () => {
    let columnName = 'New Column'
    let i = 1

    while (table.columns.indexOf(columnName) !== -1) {
      columnName = `New Column ${i}`
      i += 1
    }

    return columnName
  }

  const onAddColumn: Actions['onAddColumn'] = (column, toTheLeft) => {
    const columnName = findNewColumnName()

    const newColumns = [...table.columns]
    newColumns.splice(
      table.columns.indexOf(isBlankColumnHeader(column) ? '' : column) +
        (toTheLeft ? 0 : 1),
      0,
      columnName
    )

    onChange({
      ...value,
      table: {
        columns: newColumns,
        data: table.data.map((row) => {
          const rowType =
            cellTypes.find(({ isOfType }) =>
              Object.values(row).some((val) => isOfType(val))
            ) || cellTypes[0]

          return orderedKeys(
            {
              ...row,
              [columnName]: rowType.defaultVal,
            },
            newColumns
          )
        }),
      },
    })
  }

  const onMoveColumn: Actions['onMoveColumn'] = (column, toTheLeft) => {
    const newColumns = moveItemInArray(
      table.columns,
      table.columns.indexOf(column),
      toTheLeft
    )

    onChange({
      ...value,
      table: {
        columns: newColumns,
        data: table.data.map((row, i) => orderedKeys(row, newColumns)),
      },
    })
  }

  const onAddRow: Actions['onAddRow'] = (row, toTheBottom) => {
    const newRow = table.columns.reduce<Row>(
      (acc, column) => ({ ...acc, [column]: { heading: '', content: '' } }),
      {}
    )

    const newData = [...table.data]
    newData.splice(row + (toTheBottom ? 1 : 0), 0, newRow)
    onChange({
      ...value,
      table: {
        ...table,
        data: newData,
      },
    })
  }

  const onRemoveRow: Actions['onRemoveRow'] = (row) => {
    const newData = [...table.data]
    newData.splice(row, 1)

    onChange({
      ...value,
      table: {
        ...table,
        data: newData,
      },
    })
  }

  const onChangeRowType: Actions['onChangeRowType'] = (row, cellType) => {
    const newData = [...table.data]
    const rowData = newData[row]
    Object.keys(rowData).forEach((key, i) => {
      if (
        !isBlankColumnHeader(key) &&
        key !== '' &&
        !cellType.isOfType(rowData[key])
      ) {
        rowData[key] = cellType.defaultVal
      }
    })

    newData[row] = rowData

    onChange({
      ...value,
      table: {
        ...table,
        data: newData,
      },
    })
  }

  const onChangeRowCollapse: Actions['onChangeRowCollapse'] = (row) => {
    let newCollapsibleRows = [...collapsibleRows]
    if (newCollapsibleRows.includes(row)) {
      const currentCollapsibleRowIdx = newCollapsibleRows.indexOf(row)
      newCollapsibleRows.splice(currentCollapsibleRowIdx, 1)
      removeCollapsedRow(row)
    } else {
      newCollapsibleRows = [...newCollapsibleRows, row]
    }

    onChange({
      ...value,
      collapsibleRows: newCollapsibleRows,
    })
  }

  const handleClear = () => {
    onChange(null)
  }

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns: tableColumns,
        data: table.data,
        defaultColumn,
        onCellUpdate,
        onColumnRename,
        onAddColumn,
        onAddRow,
        onMoveColumn,
        onRemoveColumn,
        onRemoveRow,
        onChangeRowType,
      } as TableOptions<Row>,
      useResizeColumns,
      useFlexLayout
    )

  const tbodyRef = useRef<HTMLDivElement>(null)
  const theadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!tbodyRef.current) {
      return
    }

    const tbody = tbodyRef.current

    const handler = (event: Event) => {
      if (!theadRef.current) {
        return
      }

      theadRef.current.scrollLeft = (event.target as any).scrollLeft
    }

    tbody.addEventListener('scroll', handler)

    return () => {
      tbody.removeEventListener('scroll', handler)
    }
  }, [])

  function checkRowType(row: Row, callback: (x: unknown) => boolean): boolean {
    return Object.keys(row)
      .filter((key) => key !== '')
      .every((key) => callback(row[key]))
  }

  const rowIsCollapsible = (rowIndex: number) =>
    collapsibleRows.includes(rowIndex)

  function changeHasColumnHeaders() {
    onChange({
      ...value,
      hasColumnHeaders: !hasColumnHeaders,
    })
  }

  function Actions({ className }: { className?: string }) {
    return (
      <div className={classNames(s.actions, className)}>
        <Button
          buttonSize="s"
          leftIcon={
            <FontAwesomeIcon
              icon={hasColumnHeaders ? faMinus : faPlus}
            ></FontAwesomeIcon>
          }
          onClick={changeHasColumnHeaders}
        >
          {hasColumnHeaders ? 'Remove column headers' : 'Add column headers'}
        </Button>

        <div className={s.actionsSpacer} />

        {onOpenInFullScreen && (
          <Button
            onClick={onOpenInFullScreen}
            buttonSize="s"
            leftIcon={<FontAwesomeIcon icon={faExpand}></FontAwesomeIcon>}
          >
            Edit in full-screen
          </Button>
        )}
        <Button
          onClick={handleClear}
          buttonSize="s"
          leftIcon={<FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>}
        >
          Clear
        </Button>
      </div>
    )
  }

  return (
    <div className={s.container}>
      <Actions className={s.actionsTop} />
      <div {...getTableProps()} className={s.table}>
        {hasColumnHeaders && (
          <div
            className={s.thead}
            ref={theadRef}
            style={{ overflowX: 'hidden' }}
          >
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className={s.tr}>
                {headerGroup.headers.map((column) => (
                  <div {...column.getHeaderProps()} className={s.th}>
                    {column.render('Header')}
                    <div
                      {...column.getResizerProps()}
                      className={classNames(s.resizer, {
                        [s.isResizing]: column.isResizing,
                      })}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div
          {...getTableBodyProps()}
          ref={tbodyRef}
          style={{ overflowX: 'auto' }}
        >
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <div
                {...row.getRowProps()}
                className={`${s.tr} ${
                  collapsedRows.includes(i) ? s.isCollapsed : ''
                }`}
              >
                <div className={s.dropdownWrapper}>
                  <Dropdown
                    renderTrigger={({ onClick }) => (
                      <button onClick={onClick} className={s.handle}>
                        <FontAwesomeIcon
                          icon={faCog}
                          color="rgba(var(--light-body-color-rgb-components), 0.6)"
                          className={s.handleIcon}
                        />
                      </button>
                    )}
                  >
                    <DropdownMenu>
                      {cellTypes.map(
                        (type) =>
                          !checkRowType(row.original, type.isOfType) && (
                            <DropdownOption
                              onClick={onChangeRowType.bind(null, i, type)}
                            >
                              &nbsp;Convert all cells in row to {type.name}
                            </DropdownOption>
                          )
                      )}

                      <DropdownOption
                        onClick={onChangeRowCollapse.bind(null, i)}
                      >
                        <FontAwesomeIcon icon={faCaretUp} />
                        Make row{' '}
                        {rowIsCollapsible(i)
                          ? 'not collapsible'
                          : 'collapsible'}
                      </DropdownOption>
                      <DropdownSeparator />
                      <DropdownOption onClick={onAddRow.bind(null, i, false)}>
                        <FontAwesomeIcon icon={faLongArrowAltUp} /> Add row
                        above
                      </DropdownOption>
                      <DropdownOption onClick={onAddRow.bind(null, i, true)}>
                        <FontAwesomeIcon icon={faLongArrowAltDown} /> Add row
                        below
                      </DropdownOption>
                      <DropdownSeparator />
                      <DropdownOption red onClick={onRemoveRow.bind(null, i)}>
                        <FontAwesomeIcon icon={faTrashAlt} /> Remove row
                      </DropdownOption>
                    </DropdownMenu>
                  </Dropdown>
                  {collapsibleRows.includes(i) && (
                    <button
                      className={s.collapsibleTrigger}
                      aria-label="toggle row content"
                      onClick={() => handleCollapseRow(i)}
                    >
                      {collapsedRows.includes(i) ? (
                        <FontAwesomeIcon icon={faCaretUp} color="#848484" />
                      ) : (
                        <FontAwesomeIcon icon={faCaretDown} color="#848484" />
                      )}
                    </button>
                  )}
                </div>
                {row.cells.map((cell) => {
                  return (
                    <div {...cell.getCellProps()} className={s.td}>
                      {cell.render('Cell')}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      <div className={s.branding}>
        <a
          href="https://www.tiny.cloud/?utm_campaign=editor_referral&amp;utm_medium=poweredby&amp;utm_source=tinymce&amp;utm_content=v5"
          rel="noopener noreferrer"
          target="_blank"
          aria-label="Powered by Tiny"
        >
          Powered by Tiny
        </a>
      </div>
      <Actions />
    </div>
  )
}
