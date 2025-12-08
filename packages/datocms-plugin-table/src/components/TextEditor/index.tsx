/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import tinymce from 'tinymce'
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
// require('tinymce/plugins/autoresize')

interface TextEditorProps {
  id: string
  onChange: (x: RichTextProps) => void
  value: RichTextProps
}

export default function TextEditor({ onChange, value, id }: TextEditorProps) {
  const [currentValue, setCurrentValue] = useState(value)

  function handleChange(key: 'heading' | 'content', data: string) {
    const updatedVal = { ...currentValue }
    updatedVal[key] = data
    setCurrentValue(updatedVal)
  }

  function saveChange() {
    onChange(currentValue)
  }

  const editorInitProps = {
    menubar: false,
    plugins: ['link'],
    branding: false,
    width: '100%',
    elementpath: false,
    resize: false,
    statusbar: false,
  }

  return (
    <div className={s.textEditor}>
      <div className={s.editor}>
        <div className={s.editorType}>
          <span>Heading</span>
        </div>
        <ReactEditor
          id={`${id}Heading`}
          onFocusOut={saveChange}
          initialValue={value.heading ? value.heading : '<p />'}
          value={currentValue.heading ? currentValue.heading : '<p />'}
          init={{
            ...editorInitProps,
            toolbar: 'link',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
          }}
          onEditorChange={(newVal) => handleChange('heading', newVal)}
        />
      </div>
      <div className={s.editor} id="contentEditor">
        <div className={s.editorType}>
          <span>Content</span>
        </div>
        <ReactEditor
          onFocusOut={saveChange}
          id={`${id}Content`}
          initialValue={value.content ? value.content : '<p />'}
          value={currentValue.content ? currentValue.content : '<p />'}
          init={{
            ...editorInitProps,
            toolbar: 'bold italic | link',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
          onEditorChange={(newVal) => handleChange('content', newVal)}
        />
      </div>
    </div>
  )
}
