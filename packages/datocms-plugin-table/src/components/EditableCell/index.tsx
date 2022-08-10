import { Column as TableColumn, Row as TableRow } from 'react-table'
import { Actions, CellValue, cellTypes, RichTextProps, Row } from '../../types'
import { isBlankColumnHeader } from '../../utils/constants'
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
  function handleCellTypeChange(type: string) {
    const updatedCellType =
      cellTypes.find(({ name }) => name === type) || cellTypes[0]
    onCellUpdate(index, id as string, updatedCellType.defaultVal)
  }

  const currentCellType =
    cellTypes.find(({ isOfType }) => isOfType(value)) || cellTypes[0]

  function getCellInput() {
    switch (currentCellType.name) {
      case 'checkbox':
        return (
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
        )
      case 'rich text':
        return (
          <TextEditor
            onChange={(val: any) => {
              onCellUpdate(index, id as string, val as CellValue)
            }}
            value={value as RichTextProps}
          />
        )
      default:
        return <></>
    }
  }

  return (
    <div className={s.cell}>
      <div className={s.cellOptionContainer}>
        {!isBlankColumnHeader(id!) && (
          <>
            <span className={s.cellOptionsText}>Convert to:</span>
            {cellTypes.map(
              ({ name }) =>
                name !== currentCellType.name && (
                  <div className={s.cellOptions}>
                    <button
                      onClick={() => handleCellTypeChange(name)}
                      className={s.settingsButton}
                    >
                      <span>{name}</span>
                    </button>
                  </div>
                )
            )}
          </>
        )}
      </div>
      {getCellInput()}
    </div>
  )
}
