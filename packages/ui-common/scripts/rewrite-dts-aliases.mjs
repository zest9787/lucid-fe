import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = resolve(packageRoot, 'dist')

const aliasMap = {
  '@entities': 'entities',
  '@features': 'features',
  '@shared': 'shared',
  '@widgets': 'widgets',
}

const declarationFiles = await findDeclarationFiles(distRoot)

await Promise.all(
  declarationFiles.map(async (filePath) => {
    const content = await readFile(filePath, 'utf8')
    const nextContent = content.replace(
      /(from\s+['"])(@(?:entities|features|shared|widgets)(?:\/[^'"]*)?)(['"])/g,
      (_, start, importPath, end) =>
        `${start}${toRelativeDeclarationImport(filePath, importPath)}${end}`,
    )

    if (nextContent !== content) {
      await writeFile(filePath, nextContent, 'utf8')
    }
  }),
)

async function findDeclarationFiles(directory) {
  const entries = await readdir(directory)
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(directory, entry)
      const entryStat = await stat(entryPath)

      if (entryStat.isDirectory()) {
        return findDeclarationFiles(entryPath)
      }

      return entryPath.endsWith('.d.ts') ? [entryPath] : []
    }),
  )

  return files.flat()
}

function toRelativeDeclarationImport(fromFilePath, importPath) {
  const [alias, ...segments] = importPath.split('/')
  const targetPath = resolve(distRoot, aliasMap[alias], ...segments)
  const fromDirectory = dirname(fromFilePath)
  const relativePath = relative(fromDirectory, targetPath).split(sep).join('/')

  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
}
