import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function readFile(file) {
  return fs.readFileSync(path.join(__dirname, `./${file}`), 'utf-8')
}
