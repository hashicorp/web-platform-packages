import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  Column,
  TableOptions,
} from 'react-table'
import { useDeepCompareMemo } from 'use-deep-compare'
import { Actions, Row, Value } from '../../types'
import EditableCell from '../EditableCell'
import omit from 'lodash-es/omit'
import EditableHeader from '../EditableHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faCaretUp,
  faCaretDown,
  faExpand,
  faPlus,
  faTrash,
  faPencil,
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

type Props = {
  value: Value
  onChange: (value: Value | null) => void
  onOpenInFullScreen?: () => void
}

export default function TableEditor({
  value,
  onChange,
  onOpenInFullScreen,
}: Props) {
  const { collapsibleRows, hasColumnHeaders, table } = value
  const [collapsedRows, setCollapsedRows] = useState<Array<number>>([])

  function handleCollapseRow(idx: number) {
    if (collapsedRows.includes(idx)) {
      const updatedCollapsedRows = [...collapsedRows]
      const currentCollapsibleRowIdx = updatedCollapsedRows.indexOf(idx)
      updatedCollapsedRows.splice(currentCollapsibleRowIdx, 1)
      setCollapsedRows(updatedCollapsedRows)
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
    [table.columns]
  )

  const onCellUpdate: Actions['onCellUpdate'] = (index, column, cellValue) => {
    onChange({
      ...value,
      table: {
        ...table,
        data: table.data.map((row, i) =>
          i !== index
            ? row
            : {
                ...row,
                [column === 'BLANK_COLUMN_HEADER' ? '' : column]: cellValue,
              }
        ),
      },
    })
  }

  const onColumnRename: Actions['onColumnRename'] = (oldColumn, newColumn) => {
    onChange({
      ...value,
      table: {
        columns: table.columns.map((c) => (c === oldColumn ? newColumn : c)),
        data: table.data.map((row, i) => ({
          ...omit(row, [oldColumn]),
          [newColumn]: row[oldColumn],
        })),
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
      table.columns.indexOf(column) + (toTheLeft ? 0 : 1),
      0,
      columnName
    )

    onChange({
      ...value,
      table: {
        columns: newColumns,
        data: table.data.map((row, i) => {
          const isBooleanRow = Object.values(row).some(
            (val) => typeof val === 'boolean'
          )
          return {
            ...row,
            [columnName]: isBooleanRow ? false : '',
          }
        }),
      },
    })
  }

  const onAddRow: Actions['onAddRow'] = (row, toTheBottom) => {
    const newRow = table.columns.reduce<Row>(
      (acc, column) => ({ ...acc, [column]: '' }),
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

  const onChangeRowType: Actions['onChangeRowType'] = (row, type) => {
    const newData = [...table.data]
    const rowData = newData[row]
    Object.keys(rowData).forEach((key, i) => {
      if (key !== 'BLANK_COLUMN_HEADER' && key !== '') {
        rowData[key] = type === 'checkbox' ? false : ''
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

  function checkRowType(row: Row, type: 'boolean' | 'string') {
    if (Array.isArray(row.cells)) {
      return row.cells
        .filter(({ column }) => column.id !== 'BLANK_COLUMN_HEADER')
        .every(({ value }) => typeof value === type)
    }
  }

  const rowIsCollapsible = (rowIndex: number) =>
    collapsibleRows.includes(rowIndex)

  function changeHasColumnHeaders() {
    onChange({
      ...value,
      hasColumnHeaders: !hasColumnHeaders,
    })
  }

  return (
    <div className={s.container}>
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
                          color="white"
                          className={s.handleIcon}
                        />
                      </button>
                    )}
                  >
                    <DropdownMenu>
                      {!checkRowType(row, 'boolean') && (
                        <DropdownOption
                          onClick={onChangeRowType.bind(null, i, 'checkbox')}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} /> Make all
                          cells checkbox type
                        </DropdownOption>
                      )}
                      {!checkRowType(row, 'string') && (
                        <DropdownOption
                          onClick={onChangeRowType.bind(null, i, 'rich text')}
                        >
                          <FontAwesomeIcon icon={faPencil} /> Make all cells
                          rich text type
                        </DropdownOption>
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
                        <FontAwesomeIcon icon={faCaretUp} color="white" />
                      ) : (
                        <FontAwesomeIcon icon={faCaretDown} color="white" />
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

      <div className={s.actions}>
        {/* <Button
          onClick={onAddRow.bind(null, table.data.length, true)}
          buttonSize="s"
          leftIcon={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}
        >
          Add new row
        </Button> */}

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
    </div>
  )
}
