import Editor, { loader, type Monaco } from '@monaco-editor/react'
import * as monacoInstance from 'monaco-editor/esm/vs/editor/editor.api.js'
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution.js'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import type { editor, Position } from 'monaco-editor'

type MonacoWorkerEnvironment = typeof globalThis & {
  MonacoEnvironment?: {
    getWorker: () => Worker
  }
}

;(globalThis as MonacoWorkerEnvironment).MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
}

loader.config({ monaco: monacoInstance })

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

const pandasCompletions: CompletionTemplate[] = [
  { label: 'DataFrame', insertText: 'DataFrame(${1:data})', detail: 'pd.DataFrame(data)', documentation: 'Создаёт табличный объект DataFrame.', kind: 'function' },
  { label: 'Series', insertText: 'Series(${1:data})', detail: 'pd.Series(data)', documentation: 'Создаёт одномерный объект Series.', kind: 'function' },
  { label: 'read_csv', insertText: 'read_csv(${1:path})', detail: 'pd.read_csv(path, ...)', documentation: 'Читает CSV-файл в DataFrame.', kind: 'function' },
  { label: 'get_dummies', insertText: 'get_dummies(${1:data}, columns=${2:columns}, dtype=int)', detail: 'pd.get_dummies(data, columns=...)', documentation: 'Выполняет one-hot кодирование категорий.', kind: 'function' },
  { label: 'crosstab', insertText: 'crosstab(${1:index}, ${2:columns})', detail: 'pd.crosstab(index, columns)', documentation: 'Строит таблицу сопряжённости.', kind: 'function' },
]

const dataFrameCompletions: CompletionTemplate[] = [
  { label: 'head', insertText: 'head(${1:5})', detail: 'df.head(n=5)', documentation: 'Показывает первые строки.', kind: 'function' },
  { label: 'tail', insertText: 'tail(${1:5})', detail: 'df.tail(n=5)', documentation: 'Показывает последние строки.', kind: 'function' },
  { label: 'info', insertText: 'info()', detail: 'df.info()', documentation: 'Печатает типы, непустые значения и память.', kind: 'function' },
  { label: 'describe', insertText: 'describe()', detail: 'df.describe()', documentation: 'Возвращает описательные статистики.', kind: 'function' },
  { label: 'corr', insertText: 'corr(numeric_only=True)', detail: 'df.corr(method="pearson", numeric_only=False)', documentation: 'Строит матрицу попарных корреляций.', kind: 'function' },
  { label: 'isna', insertText: 'isna()', detail: 'df.isna()', documentation: 'Возвращает маску пропусков.', kind: 'function' },
  { label: 'fillna', insertText: 'fillna(${1:value})', detail: 'df.fillna(value)', documentation: 'Заполняет пропуски.', kind: 'function' },
  { label: 'dropna', insertText: 'dropna()', detail: 'df.dropna()', documentation: 'Удаляет строки или столбцы с пропусками.', kind: 'function' },
  { label: 'groupby', insertText: 'groupby(${1:by})', detail: 'df.groupby(by)', documentation: 'Группирует строки по ключу.', kind: 'function' },
  { label: 'sort_values', insertText: 'sort_values(${1:by}, ascending=${2:True})', detail: 'df.sort_values(by, ascending=True)', documentation: 'Сортирует строки по значениям.', kind: 'function' },
  { label: 'value_counts', insertText: 'value_counts()', detail: 'series.value_counts()', documentation: 'Считает частоты значений.', kind: 'function' },
  { label: 'loc', insertText: 'loc[${1:rows}, ${2:columns}]', detail: 'df.loc[rows, columns]', documentation: 'Выбирает данные по меткам.', kind: 'variable' },
  { label: 'iloc', insertText: 'iloc[${1:rows}, ${2:columns}]', detail: 'df.iloc[rows, columns]', documentation: 'Выбирает данные по позициям.', kind: 'variable' },
  { label: 'shape', insertText: 'shape', detail: 'df.shape', documentation: 'Число строк и столбцов.', kind: 'variable' },
  { label: 'columns', insertText: 'columns', detail: 'df.columns', documentation: 'Индекс названий столбцов.', kind: 'variable' },
  { label: 'dtypes', insertText: 'dtypes', detail: 'df.dtypes', documentation: 'Типы столбцов.', kind: 'variable' },
]

const pyplotCompletions: CompletionTemplate[] = [
  { label: 'subplots', insertText: 'subplots(${1:1}, ${2:1}, figsize=(${3:8}, ${4:5}))', detail: 'plt.subplots(nrows=1, ncols=1, figsize=...)', documentation: 'Создаёт Figure и Axes.', kind: 'function' },
  { label: 'plot', insertText: 'plot(${1:x}, ${2:y})', detail: 'plt.plot(x, y)', documentation: 'Строит линейный график.', kind: 'function' },
  { label: 'scatter', insertText: 'scatter(${1:x}, ${2:y}, alpha=${3:0.7})', detail: 'plt.scatter(x, y)', documentation: 'Строит диаграмму рассеяния.', kind: 'function' },
  { label: 'hist', insertText: 'hist(${1:x}, bins=${2:20})', detail: 'plt.hist(x, bins=10)', documentation: 'Строит гистограмму.', kind: 'function' },
  { label: 'show', insertText: 'show()', detail: 'plt.show()', documentation: 'Показывает фигуру.', kind: 'function' },
  { label: 'tight_layout', insertText: 'tight_layout()', detail: 'plt.tight_layout()', documentation: 'Исправляет пересечения подписей.', kind: 'function' },
]

const modelCompletions: CompletionTemplate[] = [
  { label: 'fit', insertText: 'fit(${1:X_train}, ${2:y_train})', detail: 'model.fit(X, y)', documentation: 'Обучает estimator.', kind: 'function' },
  { label: 'predict', insertText: 'predict(${1:X_test})', detail: 'model.predict(X)', documentation: 'Возвращает прогнозы.', kind: 'function' },
  { label: 'predict_proba', insertText: 'predict_proba(${1:X_test})', detail: 'model.predict_proba(X)', documentation: 'Возвращает вероятности классов, если estimator поддерживает метод.', kind: 'function' },
  { label: 'decision_function', insertText: 'decision_function(${1:X_test})', detail: 'model.decision_function(X)', documentation: 'Возвращает score до порога.', kind: 'function' },
  { label: 'score', insertText: 'score(${1:X_test}, ${2:y_test})', detail: 'model.score(X, y)', documentation: 'Считает стандартную метрику estimator.', kind: 'function' },
  { label: 'get_params', insertText: 'get_params()', detail: 'model.get_params()', documentation: 'Возвращает параметры estimator.', kind: 'function' },
  { label: 'set_params', insertText: 'set_params(${1:param}=${2:value})', detail: 'model.set_params(**params)', documentation: 'Изменяет параметры estimator.', kind: 'function' },
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

function getImportedAliases(source: string, moduleName: string) {
  const aliases = new Set<string>()
  const escapedModule = moduleName.replace('.', '\\.')
  const directImport = new RegExp(`\\bimport\\s+${escapedModule}\\b`)
  if (directImport.test(source)) aliases.add(moduleName.split('.').at(-1) ?? moduleName)

  const aliasImport = new RegExp(`\\bimport\\s+${escapedModule}\\s+as\\s+([A-Za-z_]\\w*)`, 'g')
  for (const match of source.matchAll(aliasImport)) {
    aliases.add(match[1])
  }

  return aliases
}

function inferVariableKind(source: string, variable: string) {
  const escaped = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const assignment = new RegExp(`\\b${escaped}\\s*=\\s*([^\\n]+)`).exec(source)?.[1] ?? ''
  if (/\b(pd\.)?(DataFrame|read_csv)|\.copy\(|\.drop\(|\.fillna\(|\.groupby\(/.test(assignment)) return 'dataframe'
  if (/\b(np\.)?(array|zeros|ones|full|arange|linspace)|\.to_numpy\(/.test(assignment)) return 'ndarray'
  if (/\b(LogisticRegression|LinearRegression|Ridge|Lasso|ElasticNet|DecisionTree|RandomForest|Bagging|GradientBoosting|HistGradientBoosting|SVC|SVR|KMeans|Pipeline|GridSearchCV|RandomizedSearchCV)\s*\(/.test(assignment)) return 'model'
  if (/\.fit\(/.test(source) && new RegExp(`\\b${escaped}\\.fit\\(`).test(source)) return 'model'
  if (/\brng\s*=/.test(`${variable}=${assignment}`)) return 'rng'
  if (/^(df|data|frame|table)$/i.test(variable)) return 'dataframe'
  if (/^(arr|array|x|y|values)$/i.test(variable)) return 'ndarray'
  if (/^(model|clf|regressor|classifier|pipeline|search)$/i.test(variable)) return 'model'
  return null
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
      const numpyAliases = getImportedAliases(source, 'numpy')
      const pandasAliases = getImportedAliases(source, 'pandas')
      const pyplotAliases = getImportedAliases(source, 'matplotlib.pyplot')
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

      if (memberTarget && numpyAliases.has(memberTarget)) {
        return { suggestions: numpyCompletions.map((item) => toSuggestion(item, memberTarget)) }
      }

      if (memberTarget && pandasAliases.has(memberTarget)) {
        return { suggestions: pandasCompletions.map((item) => toSuggestion(item, memberTarget)) }
      }

      if (memberTarget && pyplotAliases.has(memberTarget)) {
        return { suggestions: pyplotCompletions.map((item) => toSuggestion(item, memberTarget)) }
      }

      if (memberTarget === 'rng') {
        return { suggestions: rngCompletions.map((item) => toSuggestion(item, 'rng')) }
      }

      if (memberTarget) {
        const variableKind = inferVariableKind(source, memberTarget)
        if (variableKind === 'dataframe') return { suggestions: dataFrameCompletions.map((item) => toSuggestion(item, memberTarget)) }
        if (variableKind === 'ndarray') return { suggestions: ndarrayCompletions.map((item) => toSuggestion(item, memberTarget)) }
        if (variableKind === 'model') return { suggestions: modelCompletions.map((item) => toSuggestion(item, memberTarget)) }
        return { suggestions: [] }
      }

      const importedAliasSuggestions = [...numpyAliases, ...pandasAliases, ...pyplotAliases].map((alias) => ({
        label: alias,
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: alias,
        detail: `Импортированный модуль ${alias}`,
        documentation: 'Alias найден в текущем файле; подсказка не добавляет неимпортированные библиотеки.',
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
    <div className="overflow-hidden border border-[#bcc3ca] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex h-9 items-center justify-between border-b border-[#d9dde1] bg-[#f4f5f6] px-3 text-[12px] text-[#626a72]">
        <span className="font-semibold text-[#3b4147]">main.py</span>
        <span>Python 3 · Ctrl+Space — дополнение кода</span>
      </div>
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
          inlineSuggest: { enabled: false },
          renderLineHighlight: 'line',
          scrollBeyondLastLine: false,
          snippetSuggestions: 'top',
          suggestOnTriggerCharacters: true,
          suggest: { showWords: false, preview: true, showInlineDetails: true },
          tabCompletion: 'on',
          tabSize: 4,
          insertSpaces: true,
          formatOnType: true,
          wordBasedSuggestions: 'off',
        }}
      />
    </div>
  )
}
