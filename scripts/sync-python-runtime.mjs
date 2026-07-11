import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'node_modules', 'pyodide')
const target = join(root, 'public', 'pyodide')
const runtimeFiles = [
  'pyodide.js',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'pyodide-lock.json',
  'python_stdlib.zip',
]

await mkdir(target, { recursive: true })
await Promise.all(runtimeFiles.map((file) => copyFile(join(source, file), join(target, file))))

console.log(`Python runtime synced: ${runtimeFiles.length} files`)
