import { useMemo, useState } from 'react'

function normalizeText(value: string): string {
  return value.replace(/\r\n/g, '\n').trim()
}

export default function CodePracticePage() {
  const [functionCode, setFunctionCode] = useState(`def binary_f1(tp, fp, fn):\n    # your code\n    pass`)
  const [stdinOutput, setStdinOutput] = useState('')
  const [pytorchCode, setPytorchCode] = useState(`import torch\nimport torch.nn as nn\n\nclass MyNet(nn.Module):\n    ...`)

  const functionChecks = useMemo(() => {
    const code = functionCode.toLowerCase()
    return [
      { label: 'Есть функция binary_f1', ok: /def\s+binary_f1\s*\(/.test(code) },
      { label: 'Используются tp/fp/fn', ok: code.includes('tp') && code.includes('fp') && code.includes('fn') },
      { label: 'Есть вычисление precision', ok: /tp\s*\/\s*\(?\s*tp\s*\+\s*fp\s*\)?/.test(code) },
      { label: 'Есть вычисление recall', ok: /tp\s*\/\s*\(?\s*tp\s*\+\s*fn\s*\)?/.test(code) },
      { label: 'Есть возврат значения', ok: /\breturn\b/.test(code) },
    ]
  }, [functionCode])

  const expectedOutput = `3\n12\n4\n10\n4`
  const stdinPassed = normalizeText(stdinOutput) === expectedOutput

  const pytorchChecks = useMemo(() => {
    const code = pytorchCode.toLowerCase()
    const linearMatches = code.match(/nn\.linear\s*\(/g) ?? []
    return [
      { label: 'Есть класс, наследующий nn.Module', ok: /class\s+\w+\s*\(\s*nn\.module\s*\)/.test(code) },
      { label: 'Определен метод forward', ok: /def\s+forward\s*\(/.test(code) },
      { label: 'Есть минимум 2 hidden-layer (nn.Linear)', ok: linearMatches.length >= 3 },
      { label: 'Есть нелинейность (ReLU/GELU/SiLU)', ok: /(nn\.relu|nn\.gelu|nn\.silu|f\.relu|torch\.relu)/.test(code) },
      { label: 'В train-loop есть zero_grad/backward/step', ok: /zero_grad\s*\(/.test(code) && /backward\s*\(/.test(code) && /step\s*\(/.test(code) },
      { label: 'Для инференса указан eval + no_grad', ok: /\.eval\s*\(/.test(code) && /torch\.no_grad\s*\(/.test(code) },
    ]
  }, [pytorchCode])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Code Practice Hub</h1>
        <p className="text-gray-600 max-w-3xl">
          Локальная проверка работает детерминированно и не зависит от внешнего API. Для задач ниже используются
          rule-based чекеры: function-based, stdin/stdout и PyTorch structural checks.
        </p>
      </div>

      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">1) Function-based задача</h2>
        <p className="text-sm text-gray-600 mb-3">
          Реализуйте функцию <code className="font-mono">binary_f1(tp, fp, fn)</code>, которая возвращает F1-score.
        </p>
        <textarea
          value={functionCode}
          onChange={(e) => setFunctionCode(e.target.value)}
          className="w-full h-52 border border-gray-300 rounded-lg p-3 font-mono text-sm mb-4"
        />
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          {functionChecks.map((check) => (
            <div
              key={check.label}
              className={`rounded-lg border px-3 py-2 ${check.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
            >
              {check.ok ? '✅' : '❌'} {check.label}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">2) stdin → stdout задача</h2>
        <p className="text-sm text-gray-600 mb-3">
          Условие: по первой строке <code className="font-mono">n</code>, далее <code className="font-mono">n</code> пар чисел.
          Выведите сумму каждой пары в отдельной строке.
        </p>
        <div className="grid lg:grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Sample input</div>
            <pre className="text-sm font-mono text-gray-700">5{'\n'}1 2{'\n'}4 8{'\n'}-3 7{'\n'}10 0{'\n'}2 2</pre>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Expected output</div>
            <pre className="text-sm font-mono text-gray-700">{expectedOutput}</pre>
          </div>
        </div>
        <textarea
          value={stdinOutput}
          onChange={(e) => setStdinOutput(e.target.value)}
          placeholder="Вставьте ваш stdout для sample input..."
          className="w-full h-28 border border-gray-300 rounded-lg p-3 font-mono text-sm mb-3"
        />
        <div
          className={`text-sm rounded-lg border px-3 py-2 ${stdinPassed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
        >
          {stdinPassed ? '✅ Sample tests пройдены' : '❌ Sample tests не пройдены: проверьте формат вывода'}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-2">3) PyTorch structural checker</h2>
        <p className="text-sm text-gray-600 mb-3">
          Вставьте скелет решения. Чекер проверяет структуру: класс <code className="font-mono">nn.Module</code>, слои,
          <code className="font-mono">forward</code>, train-loop и inference-паттерн.
        </p>
        <textarea
          value={pytorchCode}
          onChange={(e) => setPytorchCode(e.target.value)}
          className="w-full h-56 border border-gray-300 rounded-lg p-3 font-mono text-sm mb-4"
        />
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          {pytorchChecks.map((check) => (
            <div
              key={check.label}
              className={`rounded-lg border px-3 py-2 ${check.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
            >
              {check.ok ? '✅' : '❌'} {check.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
