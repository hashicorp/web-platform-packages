import { Column as TableColumn, Row as TableRow } from 'react-table'
import { Actions, CellValue, Row } from '../../types'
import TextEditor from '../TextEditor'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCog,
  faCheckCircle,
  faCheckSquare,
  faPencil,
  faBook,
  faLongArrowAltRight,
  faPen,
  faTimes,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import s from './style.module.css'
import { Dropdown, DropdownMenu, DropdownOption } from 'datocms-react-ui'

type Props = Actions & {
  value: string | boolean
  row: TableRow<Row>
  rows: TableRow<Row>[]
  columns: TableColumn<Row>[]
  column: TableColumn<Row>
  onCellUpdate: (index: number, column: string, value: string | boolean) => void
}

function toTable(transfer: DataTransfer) {
  const html = transfer.getData('text/html')
  if (html) {
    const document = new DOMParser().parseFromString(html, 'text/html')
    const tableEl = document.querySelector('table')

    if (tableEl) {
      return Array.from(tableEl.rows).reduce((acc, row) => {
        const columns = Array.from(row.children).map(
          (column) =>
            column.textContent
              ?.replace(/\n/g, ' ')
              .replace(/\s+/, ' ')
              .trim() || ''
        )

        return [...acc, columns]
      }, [] as string[][])
    }
  }

  const data = transfer.getData('text/plain')

  return data
    .trim()
    .split(/\r\n|\n|\r/)
    .map((row) => row.split('\t'))
}

export default function EditableCell({
  value,
  columns,
  row: { index },
  column: { id },
  onCellUpdate,
}: Props) {
  const isCheckboxCell = typeof value === 'boolean'
  function handleCellTypeChange() {
    onCellUpdate(index, id as string, isCheckboxCell ? '' : false)
  }

  return (
    <div className={classNames(s.cell, isCheckboxCell && s.checkboxCell)}>
      <Dropdown
        renderTrigger={({ onClick }) => (
          <button onClick={onClick} className={s.settingsButton}>
            <FontAwesomeIcon icon={faCog} />
          </button>
        )}
      >
        <DropdownMenu>
          <DropdownOption onClick={handleCellTypeChange}>
            <span className={s.dropdownOption}>
              {`Make cell ${isCheckboxCell ? 'text editor' : 'checkbox'} type`}
            </span>
            <FontAwesomeIcon icon={isCheckboxCell ? faBook : faCheckSquare} />
          </DropdownOption>
        </DropdownMenu>
      </Dropdown>
      {isCheckboxCell ? (
        <input
          type="checkbox"
          onChange={(e) => {
            onCellUpdate(
              index,
              id as string,
              e.target.value === 'on' ? true : false
            )
          }}
          defaultChecked={!!value}
          className={s.checkboxInput}
        />
      ) : (
        <TextEditor
          onChange={(val: any) => {
            onCellUpdate(index, id as string, val as CellValue | boolean)
          }}
          value={value}
          id={id}
          index={index}
        />
      )}
    </div>
  )
}
