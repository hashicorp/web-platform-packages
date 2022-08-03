import tinymce from 'tinymce/tinymce'
import { Editor as ReactEditor } from '@tinymce/tinymce-react'
import { useRef } from 'react'
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
require('tinymce/plugins/emoticons/js/emojis')
require('tinymce/plugins/link')
require('tinymce/plugins/lists')
require('tinymce/plugins/paste')
require('tinymce/plugins/table')
require('tinymce/plugins/autoresize')

interface TextEditorProps {
  index: number
  onChange: (x: RichTextProps) => void
  value: RichTextProps
}

export default function TextEditor({
  index,
  onChange,
  value,
}: TextEditorProps) {
  const headingEditorRef = useRef<any>(null)
  const contentEditorRef = useRef<any>(null)
  console.log(headingEditorRef)
  // console.log(editorRef)
  // const log = () => {
  //   if (editorRef !== null && editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };

  function handleChange(key: 'heading' | 'content', data: string) {
    const updatedVal = { ...value }
    updatedVal[key] = data
    onChange(updatedVal)
  }

  return (
    <div className={s.textEditor}>
      <div className={s.editor}>
        <div className={s.editorHeading}>
          <span>Heading</span>
        </div>
        <ReactEditor
          onInit={(evt, editor) => (headingEditorRef.current = editor)}
          initialValue={'<p />'}
          value={value.heading ? value.heading : '<p />'}
          init={{
            height: 150,
            menubar: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'code',
              'help',
              'wordcount',
            ],
            toolbar:
              'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
          onEditorChange={(newVal) => handleChange('heading', newVal)}
        />
      </div>
      <div className={s.editor}>
        <div className={s.editorHeadingContent}>
          <span>Content</span>
        </div>
        <ReactEditor
          onInit={(evt, editor) => (contentEditorRef.current = editor)}
          initialValue={'<p />'}
          value={value.content ? value.content : '<p />'}
          init={{
            height: 150,
            menubar: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'code',
              'help',
              'wordcount',
            ],
            toolbar:
              'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
          onEditorChange={(newVal) => handleChange('content', newVal)}
        />
      </div>
    </div>
  )
}

// import { useEffect, useState } from 'react'
// import { CKEditor } from '@ckeditor/ckeditor5-react'
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import { Button, Form, FieldGroup, TextField } from 'datocms-react-ui'
// import s from './style.module.css'
// import './style.css'

// // @TODO: change this to use dato's structured text editor if possible

// export default function TextEditor({ id, index, onChange, value }) {
//   const [isFocusedHeading, setIsFocusedHeading] = useState(false)
//   const [isFocusedContent, setIsFocusedContent] = useState(false)

//   const elementId = `${id}-${index}`.replace(/ /g, '-')

//   function handleChange(key, data) {
//     const updatedVal = { ...value }
//     updatedVal[key] = data
//     onChange(updatedVal)
//   }

//   return (
//     <div className={s.textEditor} id={elementId}>
//       <div className={s.editor}>
//         <div className={s.editorHeading}>
//           <span>Heading</span>
//         </div>
//         <CKEditor
//           editor={ClassicEditor}
//           data={value.heading ? value.heading : '<p />'}
//           config={{
//             toolbar: ['link'],
//           }}
//           onChange={(event, editor) => {
//             const data = editor.getData()
//             if (isFocusedHeading) {
//               handleChange('heading', data)
//             }
//           }}
//           onBlur={() => {
//             setIsFocusedHeading(false)
//           }}
//           onFocus={() => {
//             setIsFocusedHeading(true)
//           }}
//         />
//       </div>
//       <div className={s.editor}>
//         <div className={s.editorHeadingContent}>
//           <span>Content</span>
//         </div>
//         <CKEditor
//           editor={ClassicEditor}
//           data={value.content ? value.content : '<p />'}
//           config={{
//             toolbar: ['bold', 'italic', 'link'],
//           }}
//           onChange={(event, editor) => {
//             const data = editor.getData()
//             if (isFocusedContent) {
//               handleChange('content', data)
//             }
//           }}
//           onBlur={() => {
//             setIsFocusedContent(false)
//           }}
//           onFocus={() => {
//             setIsFocusedContent(true)
//           }}
//         />
//       </div>
//       {/* <Form onSubmit={() => console.log('onSubmit')}>
//     <FieldGroup>
//       <TextField
//         required
//         name="name"
//         id="name"
//         label="Name"
//         onChange={(newValue) => console.log(newValue)}
//       />
//       <Button fullWidth buttonType="primary">
//         Submit
//       </Button>
//     </FieldGroup>
//   </Form> */}
//     </div>
//   )
// }
