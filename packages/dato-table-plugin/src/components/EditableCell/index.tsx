import { Column as TableColumn, Row as TableRow } from 'react-table'
import { faCog, faCheckSquare, faBook } from '@fortawesome/free-solid-svg-icons'
import { Actions, CellValue, isBoolean, Row } from '../../types'
import s from './style.module.css'
import classNames from 'classnames'
import { Dropdown, DropdownMenu, DropdownOption } from 'datocms-react-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TextEditor from '../TextEditor'

type Props = Actions & {
  value: CellValue
  row: TableRow<Row>
  rows: TableRow<Row>[]
  columns: TableColumn<Row>[]
  column: TableColumn<Row>
  onCellUpdate: (index: number, column: string, value: CellValue) => void
}

export default function EditableCell({
  value,
  columns,
  row: { index },
  column: { id },
  onCellUpdate,
}: Props) {
  const isCheckbox = isBoolean(value)
  function handleCellTypeChange() {
    onCellUpdate(
      index,
      id as string,
      isCheckbox ? { heading: '', content: '' } : false
    )
  }

  return (
    <div className={classNames(s.cell, isCheckbox && s.checkboxCell)}>
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
              {`Make cell ${isCheckbox ? 'text editor' : 'checkbox'} type`}
            </span>
            <FontAwesomeIcon icon={isCheckbox ? faBook : faCheckSquare} />
          </DropdownOption>
        </DropdownMenu>
      </Dropdown>
      {isCheckbox ? (
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
            onCellUpdate(index, id as string, val as CellValue)
          }}
          value={value}
          index={index}
        />
      )}
    </div>
  )
}
