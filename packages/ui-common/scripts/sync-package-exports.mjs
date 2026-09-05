import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageJsonPath = resolve(packageRoot, 'package.json')
const exportsPath = resolve(packageRoot, 'package.exports.json')

const [packageJson, packageExports] = await Promise.all([
  readJson(packageJsonPath),
  readJson(exportsPath),
])

packageJson.exports = packageExports

await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8')

async function readJson(path) {
  const content = await readFile(path, 'utf8')

  return JSON.parse(content)
}
