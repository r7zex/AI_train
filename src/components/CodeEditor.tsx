import Editor, { type Monaco } from '@monaco-editor/react'
import type { editor, Position } from 'monaco-editor'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
}

type CompletionTemplate = {
  label: string
  insertText: string
  detail: string
  documentation: string
  kind: 'function' | 'variable' | 'keyword'
}

const numpyCompletions: CompletionTemplate[] = [
  { label: 'array', insertText: 'array(${1:object})', detail: 'np.array(object, dtype=None)', documentation: 'Создаёт ndarray из готовых данных.', kind: 'function' },
  { label: 'zeros', insertText: 'zeros(${1:shape})', detail: 'np.zeros(shape)', documentation: 'Создаёт массив нулей заданной формы.', kind: 'function' },
  { label: 'ones', insertText: 'ones(${1:shape})', detail: 'np.ones(shape)', documentation: 'Создаёт массив единиц заданной формы.', kind: 'function' },
  { label: 'full', insertText: 'full(${1:shape}, ${2:fill_value})', detail: 'np.full(shape, fill_value)', documentation: 'Создаёт массив, заполненный одним значением.', kind: 'function' },
  { label: 'arange', insertText: 'arange(${1:start}, ${2:stop}, ${3:step})', detail: 'np.arange(start, stop, step)', documentation: 'Создаёт диапазон с заданным шагом.', kind: 'function' },
  { label: 'linspace', insertText: 'linspace(${1:start}, ${2:stop}, ${3:num})', detail: 'np.linspace(start, stop, num)', documentation: 'Создаёт num равномерных точек между start и stop.', kind: 'function' },
  { label: 'sum', insertText: 'sum(${1:x})', detail: 'np.sum(x, axis=None)', documentation: 'Считает сумму элементов.', kind: 'function' },
  { label: 'mean', insertText: 'mean(${1:x})', detail: 'np.mean(x, axis=None)', documentation: 'Считает среднее значение.', kind: 'function' },
  { label: 'min', insertText: 'min(${1:x})', detail: 'np.min(x, axis=None)', documentation: 'Находит минимум.', kind: 'function' },
  { label: 'max', insertText: 'max(${1:x})', detail: 'np.max(x, axis=None)', documentation: 'Находит максимум.', kind: 'function' },
  { label: 'median', insertText: 'median(${1:x})', detail: 'np.median(x, axis=None)', documentation: 'Считает медиану.', kind: 'function' },
  { label: 'var', insertText: 'var(${1:x})', detail: 'np.var(x, axis=None)', documentation: 'Считает дисперсию.', kind: 'function' },
  { label: 'std', insertText: 'std(${1:x})', detail: 'np.std(x, axis=None)', documentation: 'Считает стандартное отклонение.', kind: 'function' },
  { label: 'quantile', insertText: 'quantile(${1:x}, ${2:q})', detail: 'np.quantile(x, q)', documentation: 'Считает квантиль, q задаётся от 0 до 1.', kind: 'function' },
  { label: 'percentile', insertText: 'percentile(${1:x}, ${2:q})', detail: 'np.percentile(x, q)', documentation: 'Считает процентиль, q задаётся от 0 до 100.', kind: 'function' },
  { label: 'where', insertText: 'where(${1:condition}, ${2:x}, ${3:y})', detail: 'np.where(condition, x, y)', documentation: 'Выбирает значения по условию.', kind: 'function' },
  { label: 'any', insertText: 'any(${1:mask})', detail: 'np.any(mask)', documentation: 'Проверяет, есть ли хотя бы одно True.', kind: 'function' },
  { label: 'all', insertText: 'all(${1:mask})', detail: 'np.all(mask)', documentation: 'Проверяет, все ли значения True.', kind: 'function' },
  { label: 'sort', insertText: 'sort(${1:x})', detail: 'np.sort(x)', documentation: 'Возвращает отсортированный массив.', kind: 'function' },
  { label: 'argsort', insertText: 'argsort(${1:x})', detail: 'np.argsort(x)', documentation: 'Возвращает индексы, которые отсортируют массив.', kind: 'function' },
  { label: 'unique', insertText: 'unique(${1:x})', detail: 'np.unique(x)', documentation: 'Возвращает уникальные значения.', kind: 'function' },
  { label: 'argmax', insertText: 'argmax(${1:x})', detail: 'np.argmax(x)', documentation: 'Возвращает индекс максимума.', kind: 'function' },
  { label: 'argmin', insertText: 'argmin(${1:x})', detail: 'np.argmin(x)', documentation: 'Возвращает индекс минимума.', kind: 'function' },
  { label: 'random.default_rng', insertText: 'random.default_rng(${1:seed})', detail: 'np.random.default_rng(seed)', documentation: 'Создаёт современный генератор случайных чисел.', kind: 'function' },
]

const rngCompletions: CompletionTemplate[] = [
  { label: 'integers', insertText: 'integers(${1:low}, ${2:high}, size=${3:n})', detail: 'rng.integers(low, high, size)', documentation: 'Случайные целые числа.', kind: 'function' },
  { label: 'normal', insertText: 'normal(${1:loc}, ${2:scale}, size=${3:n})', detail: 'rng.normal(loc, scale, size)', documentation: 'Случайные значения из нормального распределения.', kind: 'function' },
  { label: 'uniform', insertText: 'uniform(${1:low}, ${2:high}, size=${3:n})', detail: 'rng.uniform(low, high, size)', documentation: 'Случайные значения из равномерного распределения.', kind: 'function' },
  { label: 'permutation', insertText: 'permutation(${1:x})', detail: 'rng.permutation(x)', documentation: 'Перемешивает копию массива или диапазона.', kind: 'function' },
  { label: 'choice', insertText: 'choice(${1:x}, size=${2:n})', detail: 'rng.choice(x, size)', documentation: 'Выбирает случайные элементы.', kind: 'function' },
]

const ndarrayCompletions: CompletionTemplate[] = [
  { label: 'shape', insertText: 'shape', detail: 'arr.shape', documentation: 'Форма массива.', kind: 'variable' },
  { label: 'ndim', insertText: 'ndim', detail: 'arr.ndim', documentation: 'Число измерений массива.', kind: 'variable' },
  { label: 'size', insertText: 'size', detail: 'arr.size', documentation: 'Общее число элементов.', kind: 'variable' },
  { label: 'dtype', insertText: 'dtype', detail: 'arr.dtype', documentation: 'Тип элементов массива.', kind: 'variable' },
  { label: 'T', insertText: 'T', detail: 'arr.T', documentation: 'Транспонирование массива.', kind: 'variable' },
  { label: 'astype', insertText: 'astype(${1:dtype})', detail: 'arr.astype(dtype)', documentation: 'Преобразовать тип элементов.', kind: 'function' },
  { label: 'reshape', insertText: 'reshape(${1:new_shape})', detail: 'arr.reshape(new_shape)', documentation: 'Изменить форму массива.', kind: 'function' },
  { label: 'flatten', insertText: 'flatten()', detail: 'arr.flatten()', documentation: 'Вернуть плоскую копию массива.', kind: 'function' },
  { label: 'ravel', insertText: 'ravel()', detail: 'arr.ravel()', documentation: 'Вернуть плоское представление массива, когда это возможно.', kind: 'function' },
  { label: 'mean', insertText: 'mean(axis=${1:None})', detail: 'arr.mean(axis=None)', documentation: 'Среднее по массиву или оси.', kind: 'function' },
  { label: 'sum', insertText: 'sum(axis=${1:None})', detail: 'arr.sum(axis=None)', documentation: 'Сумма по массиву или оси.', kind: 'function' },
]

const pythonCompletions: CompletionTemplate[] = [
  { label: 'input', insertText: 'input()', detail: 'input()', documentation: 'Считать строку из stdin.', kind: 'function' },
  { label: 'print', insertText: 'print(${1:value})', detail: 'print(value)', documentation: 'Вывести значение.', kind: 'function' },
  { label: 'map', insertText: 'map(${1:int}, ${2:items})', detail: 'map(function, iterable)', documentation: 'Применить функцию к элементам.', kind: 'function' },
  { label: 'list', insertText: 'list(${1:items})', detail: 'list(iterable)', documentation: 'Создать список.', kind: 'function' },
  { label: 'int', insertText: 'int(${1:value})', detail: 'int(value)', documentation: 'Преобразовать значение в int.', kind: 'function' },
  { label: 'float', insertText: 'float(${1:value})', detail: 'float(value)', documentation: 'Преобразовать значение в float.', kind: 'function' },
  { label: 'if', insertText: 'if ${1:condition}:\n  ${2:pass}', detail: 'if condition:', documentation: 'Условие.', kind: 'keyword' },
  { label: 'for', insertText: 'for ${1:item} in ${2:items}:\n  ${3:pass}', detail: 'for item in items:', documentation: 'Цикл по элементам.', kind: 'keyword' },
]

let pythonCompletionRegistered = false

function getImportedNumpyAliases(source: string) {
  const aliases = new Set<string>()
  if (/\bimport\s+numpy\b/.test(source)) aliases.add('numpy')

  for (const match of source.matchAll(/\bimport\s+numpy\s+as\s+([A-Za-z_]\w*)/g)) {
    aliases.add(match[1])
  }

  return aliases
}

function hasRngVariable(source: string) {
  return /\brng\s*=\s*[A-Za-z_]\w*\.random\.default_rng\s*\(/.test(source)
}

function completionKind(monaco: Monaco, kind: CompletionTemplate['kind']) {
  if (kind === 'variable') return monaco.languages.CompletionItemKind.Variable
  if (kind === 'keyword') return monaco.languages.CompletionItemKind.Keyword
  return monaco.languages.CompletionItemKind.Function
}

function registerPythonCompletions(monaco: Monaco) {
  if (pythonCompletionRegistered) return
  pythonCompletionRegistered = true

  monaco.languages.registerCompletionItemProvider('python', {
    triggerCharacters: ['.'],
    provideCompletionItems(model: editor.ITextModel, position: Position) {
      const source = model.getValue()
      const aliases = getImportedNumpyAliases(source)
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }
      const lineStart = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      })
      const memberTarget = lineStart.match(/([A-Za-z_]\w*)\.$/)?.[1]
      const toSuggestion = (item: CompletionTemplate, prefix = '') => ({
        label: item.label,
        kind: completionKind(monaco, item.kind),
        insertText: item.insertText,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: prefix ? item.detail.replace(/^(np|arr)\./, `${prefix}.`) : item.detail,
        documentation: item.documentation,
        range,
      })

      if (memberTarget && aliases.has(memberTarget)) {
        return { suggestions: numpyCompletions.map((item) => toSuggestion(item, memberTarget)) }
      }

      if (memberTarget === 'rng') {
        return { suggestions: rngCompletions.map((item) => toSuggestion(item, 'rng')) }
      }

      if (memberTarget) {
        return { suggestions: ndarrayCompletions.map((item) => toSuggestion(item, memberTarget)) }
      }

      const importedAliasSuggestions = [...aliases].map((alias) => ({
        label: alias,
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: alias,
        detail: alias === 'np' ? 'import numpy as np' : 'import numpy',
        documentation: 'Импортированный alias библиотеки NumPy из starter code.',
        range,
      }))

      const baseSuggestions = [
        ...importedAliasSuggestions,
        ...pythonCompletions.map((item) => toSuggestion(item)),
      ]

      if (hasRngVariable(source)) {
        baseSuggestions.push({
          label: 'rng',
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: 'rng',
          detail: 'rng = np.random.default_rng(seed)',
          documentation: 'Генератор случайных чисел, созданный в текущем коде.',
          range,
        })
      }

      return { suggestions: baseSuggestions }
    },
  })
}

function configureMonaco(monaco: Monaco) {
  registerPythonCompletions(monaco)
  monaco.editor.defineTheme('ai-train-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
      { token: 'keyword', foreground: '7c3aed', fontStyle: 'bold' },
      { token: 'number', foreground: 'b45309' },
      { token: 'string', foreground: '047857' },
      { token: 'identifier', foreground: '111827' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#1f252d',
      'editorLineNumber.foreground': '#8b95a1',
      'editorLineNumber.activeForeground': '#111827',
      'editor.selectionBackground': '#dbeafe',
      'editorCursor.foreground': '#111827',
    },
  })
}

export default function CodeEditor({ value, onChange, height = 260 }: CodeEditorProps) {
  return (
    <div className="overflow-hidden border border-[#cfd5dc] bg-white">
      <Editor
        value={value}
        language="python"
        theme="ai-train-light"
        height={`${height}px`}
        beforeMount={configureMonaco}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        loading={<div className="px-3 py-2 font-mono text-[13px] text-[#6b7280]">Загружаем редактор...</div>}
        options={{
          automaticLayout: true,
          fontFamily: 'Consolas, "SFMono-Regular", Menlo, Monaco, monospace',
          fontSize: 13,
          lineHeight: 22,
          minimap: { enabled: false },
          padding: { top: 8, bottom: 8 },
          quickSuggestions: { other: true, comments: false, strings: false },
          renderLineHighlight: 'line',
          scrollBeyondLastLine: false,
          snippetSuggestions: 'inline',
          suggestOnTriggerCharacters: true,
          tabSize: 2,
          wordBasedSuggestions: 'off',
        }}
      />
    </div>
  )
}
