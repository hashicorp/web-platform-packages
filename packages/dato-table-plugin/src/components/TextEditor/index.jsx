import { useEffect, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Button, Form, FieldGroup, TextField } from 'datocms-react-ui'
import s from './style.module.css'
import './style.css'

// @TODO: change this to use dato's structured text editor if possible

export default function TextEditor({ id, index, onChange, value }) {
  const [isFocusedHeading, setIsFocusedHeading] = useState(false)
  const [isFocusedContent, setIsFocusedContent] = useState(false)

  const elementId = `${id}-${index}`.replace(/ /g, '-')

  function handleChange(key, data) {
    const updatedVal = { ...value }
    updatedVal[key] = data
    onChange(updatedVal)
  }

  return (
    <div className={s.textEditor} id={elementId}>
      {/* <CKEditor
        editor={ClassicEditor}
        data={value ? value : '<p />'}
        config={{
          toolbar: [
            "heading",
            "bold",
            "italic",
            "link",
          ]
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          if (isFocused) {
            handleChange(data)
          }
        }}
        onBlur={() => {
          setIsFocused(false)
        }}
        onFocus={() => {
          setIsFocused(true)
        }}
      /> */}
      <div className={s.editor}>
        <div className={s.editorHeading}>
          <span>Heading</span>
        </div>
        <CKEditor
          editor={ClassicEditor}
          data={value.heading ? value.heading : '<p />'}
          config={{
            toolbar: ['link'],
          }}
          onChange={(event, editor) => {
            const data = editor.getData()
            if (isFocusedHeading) {
              handleChange('heading', data)
            }
          }}
          onBlur={() => {
            setIsFocusedHeading(false)
          }}
          onFocus={() => {
            setIsFocusedHeading(true)
          }}
        />
      </div>
      <div className={s.editor}>
        <div className={s.editorHeadingContent}>
          <span>Content</span>
        </div>
        <CKEditor
          editor={ClassicEditor}
          data={value.content ? value.content : '<p />'}
          config={{
            toolbar: ['bold', 'italic', 'link'],
          }}
          onChange={(event, editor) => {
            const data = editor.getData()
            if (isFocusedContent) {
              handleChange('content', data)
            }
          }}
          onBlur={() => {
            setIsFocusedContent(false)
          }}
          onFocus={() => {
            setIsFocusedContent(true)
          }}
        />
      </div>
      {/* <Form onSubmit={() => console.log('onSubmit')}>
    <FieldGroup>
      <TextField
        required
        name="name"
        id="name"
        label="Name"
        onChange={(newValue) => console.log(newValue)}
      />
      <Button fullWidth buttonType="primary">
        Submit
      </Button>
    </FieldGroup>
  </Form> */}
    </div>
  )
}
