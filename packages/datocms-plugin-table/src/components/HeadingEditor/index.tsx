import tinymce from 'tinymce'
import { Editor as ReactEditor } from '@tinymce/tinymce-react'
import { useState, useRef } from 'react'
import { RichTextProps } from '../../types'
import s from './style.module.css'
;(global as any).tinymce = tinymce

require('tinymce/icons/default')
require('tinymce/themes/silver')
require('tinymce/skins/ui/oxide/skin.css')
require('tinymce/plugins/image')
require('tinymce/plugins/advlist')
require('tinymce/plugins/code')
require('tinymce/plugins/emoticons')
require('tinymce/plugins/link')
require('tinymce/plugins/lists')
require('tinymce/plugins/paste')
// require('tinymce/plugins/autoresize')

interface TextEditorProps {
  id: string
  onChange: (x: RichTextProps) => void
  value: RichTextProps
}

export default function TextEditor({ id, onChange, value }: TextEditorProps) {
  const [currentValue, setCurrentValue] = useState(value)
  const headingEditorRef = useRef<{} | null>(null)

  function handleChange(data: string) {
    const updatedVal = { ...currentValue }
    updatedVal.heading = data
    setCurrentValue(updatedVal)
  }

  function saveChange() {
    onChange(currentValue)
  }

  return (
    <div className={s.editor}>
      <div className={s.editorType}>
        <span>Heading</span>
      </div>
      <ReactEditor
        onInit={(evt, editor) => (headingEditorRef.current = editor)}
        id={id}
        onFocusOut={saveChange}
        initialValue={value.heading ? value.heading : '<p />'}
        value={currentValue.heading ? currentValue.heading : '<p />'}
        init={{
          menubar: false,
          plugins: ['link'],
          branding: false,
          width: '100%',
          elementpath: false,
          resize: false,
          statusbar: false,
          toolbar: 'link',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
        }}
        onEditorChange={(newVal) => handleChange(newVal)}
      />
    </div>
  )
}
