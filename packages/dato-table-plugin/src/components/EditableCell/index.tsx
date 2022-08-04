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
  column: TableColumn<Row>
  onCellUpdate: (index: number, column: string, value: CellValue) => void
}

export default function EditableCell({
  value,
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
    <div className={s.cell}>
      <div className={s.cellOptionContainer}>
        <button onClick={handleCellTypeChange} className={s.settingsButton}>
          <span className={s.cellOption}>
            {`Convert cell to ${isCheckbox ? 'text editor' : 'checkbox'}`}
          </span>
        </button>
      </div>
      {isCheckbox ? (
        <div className={s.checkboxCell}>
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
        </div>
      ) : (
        <TextEditor
          onChange={(val: any) => {
            onCellUpdate(index, id as string, val as CellValue)
          }}
          value={value}
        />
      )}
    </div>
  )
}
