import { Button } from 'datocms-react-ui'
import { Value } from '../../types'
import s from './style.module.css'

type Props = {
  onChange: (newValue: Value | null) => void
}

export const Empty = ({ onChange }: Props) => {
  console.log('empty')
  return (
    <div className={s.noValue}>
      <div className={s.noValue_label}>No table present!</div>
      <Button
        buttonSize="s"
        onClick={() => {
          onChange({
            collapsibleRows: [],
            hasColumnHeaders: true,
            table: {
              columns: ['', 'Column A', 'Column B'],
              data: [
                {
                  '': { heading: '', content: '' },
                  'Column A': { heading: '', content: '' },
                  'Column B': { heading: '', content: '' },
                },
              ],
            },
          })
        }}
      >
        Insert new table
      </Button>
    </div>
  )
}
