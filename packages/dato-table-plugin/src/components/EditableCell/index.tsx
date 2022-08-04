import { Column as TableColumn, Row as TableRow } from 'react-table'
import { Actions, CellValue, isBoolean, Row } from '../../types'
import TextEditor from '../TextEditor'
import s from './style.module.css'

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
