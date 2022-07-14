import { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import s from './style.module.css'
import './style.css'

// @TODO: change this to use dato's structured text editor if possible

export default function TextEditor({ id, index, handleChange, value }) {
  const [isFocused, setIsFocused] = useState(false)

  const elementId = (`${id}-${index}`).replace(/ /g, '-')

  return (
    <div className={s.textEditor} id={elementId}>
      <CKEditor
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
      />
    </div>
  );
}
