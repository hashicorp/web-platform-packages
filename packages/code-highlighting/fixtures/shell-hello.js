import readFile from './_read-file'

// Note: fixture input and output are in
// separate files to make them easier to edit
const fixture = {
  input: readFile('shell-hello_input.txt'),
  output: readFile('shell-hello_output.txt'),
}

export default fixture
