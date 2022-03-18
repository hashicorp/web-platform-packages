import path from 'path'
import fs from 'fs'

const templatePath = path.join(__dirname, 'script.template.txt')
const destinationPath = path.join(process.cwd(), 'scripts', 'website-build.sh')

export default async function main(product: string) {
  const template = String(await fs.promises.readFile(templatePath))
  const script = template.replace('{PRODUCT}', product)

  console.log('writing script to:', destinationPath)
  await fs.promises.writeFile(destinationPath, script, { encoding: 'utf-8' })
  // ensure the script file is executable after write
  await fs.promises.chmod(destinationPath, '755')
}
