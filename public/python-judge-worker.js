/* global loadPyodide */

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'
const localIndexURL = new URL('pyodide/', self.location.href).href

let pyodidePromise = null

async function getPyodide() {
  if (!pyodidePromise) {
    importScripts(new URL('pyodide/pyodide.js', self.location.href).href)
    pyodidePromise = loadPyodide({
      indexURL: localIndexURL,
    })
  }
  return pyodidePromise
}

self.onmessage = async (event) => {
  const { id, code, cases, packages } = event.data

  try {
    const pyodide = await getPyodide()
    if (packages.length > 0) {
      pyodide._api.setCdnUrl(PYODIDE_CDN)
      await pyodide.loadPackage(packages)
    }

    self.postMessage({ id, status: 'running' })

    pyodide.globals.set('__user_code__', code)
    const outputs = []

    for (const testCase of cases) {
      pyodide.globals.set('__judge_input__', testCase.input || '')
      const output = await pyodide.runPythonAsync(`
import io
import sys

stdin_backup = sys.stdin
stdout_backup = sys.stdout
sys.stdin = io.StringIO(__judge_input__)
sys.stdout = io.StringIO()
namespace = {"__name__": "__main__"}

try:
    exec(compile(__user_code__, "main.py", "exec"), namespace)
    __judge_output__ = sys.stdout.getvalue()
finally:
    sys.stdin = stdin_backup
    sys.stdout = stdout_backup

__judge_output__
      `)
      outputs.push(String(output ?? ''))
    }

    self.postMessage({ id, ok: true, outputs })
  } catch (error) {
    self.postMessage({
      id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
