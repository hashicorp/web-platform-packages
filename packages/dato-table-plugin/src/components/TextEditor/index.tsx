import tinymce from 'tinymce/tinymce'
import { Editor as ReactEditor } from '@tinymce/tinymce-react'
import { useState } from 'react'
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
require('tinymce/plugins/autoresize')

interface TextEditorProps {
  onChange: (x: RichTextProps) => void
  value: RichTextProps
}

export default function TextEditor({ onChange, value }: TextEditorProps) {
  const [currentValue, setCurrentValue] = useState(value)

  function handleChange(key: 'heading' | 'content', data: string) {
    const updatedVal = { ...currentValue }
    updatedVal[key] = data
    setCurrentValue(updatedVal)
  }

  function saveChange() {
    onChange(currentValue)
  }

  const editorProps = {
    initialValue: '<p />',
    onFocusOut: saveChange,
  }

  const editorInitProps = {
    menubar: false,
    plugins: ['link'],
    branding: false,
    width: '100%',
    elementpath: false,
  }

  return (
    <div className={s.textEditor}>
      <div className={s.editor}>
        <div className={s.editorType}>
          <span>Heading</span>
        </div>
        <ReactEditor
          {...editorProps}
          value={currentValue.heading ? currentValue.heading : '<p />'}
          init={{
            ...editorInitProps,
            toolbar: 'link',
          }}
          onEditorChange={(newVal) => handleChange('heading', newVal)}
        />
      </div>
      <div className={s.editor}>
        <div className={s.editorType}>
          <span>Content</span>
        </div>
        <ReactEditor
          {...editorProps}
          value={currentValue.content ? currentValue.content : '<p />'}
          init={{
            ...editorInitProps,
            toolbar: 'bold italic | link',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
          onEditorChange={(newVal) => handleChange('content', newVal)}
          onFocusOut={saveChange}
        />
      </div>
    </div>
  )
}
