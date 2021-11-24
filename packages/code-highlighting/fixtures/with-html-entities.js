import readFile from './_read-file'

// Note: fixture input and output are in
// separate files to make them easier to edit
const fixture = {
  input: readFile('with-html-entities_input.txt'),
  output: readFile('with-html-entities_output.txt'),
}

export default fixture
