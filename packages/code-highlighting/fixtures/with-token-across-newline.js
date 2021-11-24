import readFile from './_read-file'

// Note: fixture input and output are in
// separate files to make them easier to edit
const fixture = {
  input: readFile('with-token-across-newline_input.txt'),
  output: readFile('with-token-across-newline_output.txt'),
}

export default fixture
