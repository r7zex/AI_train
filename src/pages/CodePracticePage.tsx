import { useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'
import { useSearchParams } from 'react-router-dom'

// ─── Types ─────────────────────────────────────────────────────────────────

interface SampleTest {
  input: string
  expectedOutput: string
  description: string
}

interface HiddenTest {
  id: string
  description: string
}

interface TestResult {
  testId: string
  passed: boolean
  description: string
  actualOutput?: string
  expectedOutput?: string
  diff?: string
}

interface CheckResult {
  passed: boolean
  sampleResults: TestResult[]
  hiddenResults: TestResult[]
  score: number
  feedback?: string
}

interface CodeTask {
  id: string
  title: string
  type: 'function' | 'stdin-stdout' | 'pytorch-structural' | 'fill-in-code' | 'debugging'
  statement: string
  constraints: string[]
  starterCode: string
  sampleTests: SampleTest[]
  hiddenTests: HiddenTest[]
  checker: (code: string) => CheckResult
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function lineDiff(actual: string, expected: string): string {
  const a = actual.split('\n')
  const e = expected.split('\n')
  const maxLen = Math.max(a.length, e.length)
  const lines: string[] = []
  for (let i = 0; i < maxLen; i++) {
    const aLine = a[i] ?? '(missing)'
    const eLine = e[i] ?? '(missing)'
    if (aLine === eLine) lines.push(`  ${i + 1}: ${aLine}`)
    else lines.push(`- ${i + 1}: ${aLine}\n+ ${i + 1}: ${eLine}`)
  }
  return lines.join('\n')
}

// ─── Task definitions ──────────────────────────────────────────────────────

const codeTasks: CodeTask[] = [
  // ── Task 1: binary_f1 ───────────────────────────────────────────────────
  {
    id: 'binary-f1',
    title: '1. binary_f1(tp, fp, fn)',
    type: 'function',
    statement:
      'Реализуйте функцию `binary_f1(tp, fp, fn)`, которая принимает три целых числа (True Positives, False Positives, False Negatives) и возвращает F1-score в виде числа с плавающей запятой.\n\nF1 = 2·TP / (2·TP + FP + FN)\n\nЕсли знаменатель равен 0, верните 0.0.',
    constraints: [
      'tp, fp, fn ≥ 0 (целые числа)',
      'При tp=fp=fn=0 верните 0.0',
      'Не использовать sklearn или сторонние библиотеки',
      'Имя функции: binary_f1',
    ],
    starterCode: 'def binary_f1(tp, fp, fn):\n    # your code here\n    pass\n',
    sampleTests: [
      {
        input: 'binary_f1(70, 30, 70)',
        expectedOutput: '0.5833',
        description: 'Стандартный случай: TP=70, FP=30, FN=70',
      },
      {
        input: 'binary_f1(10, 0, 0)',
        expectedOutput: '1.0',
        description: 'Идеальный классификатор: все верно',
      },
      {
        input: 'binary_f1(0, 5, 5)',
        expectedOutput: '0.0',
        description: 'Нет верных предсказаний',
      },
    ],
    hiddenTests: [
      { id: 'f1-h1', description: 'Граничный случай: tp=fp=fn=0' },
      { id: 'f1-h2', description: 'Крупные значения tp=1000, fp=200, fn=300' },
      { id: 'f1-h3', description: 'fp=0, fn>0 (высокий recall, точный precision)' },
    ],
    checker: (code: string): CheckResult => {
      const c = code.toLowerCase()
      const hasDef = /def\s+binary_f1\s*\(\s*tp\s*,\s*fp\s*,\s*fn\s*\)/.test(c)
      const hasReturn = /\breturn\b/.test(c)
      const hasTP = c.includes('tp')
      const hasFP = c.includes('fp')
      const hasFN = c.includes('fn')
      const hasDenom = /2\s*\*\s*tp\s*\+\s*fp\s*\+\s*fn|fp\s*\+\s*fn/.test(c)
      const hasZeroCheck = /if|==\s*0|denomin/.test(c)
      const hasFormula = /2\s*[*·]\s*tp/.test(c)

      const sampleResults: TestResult[] = [
        {
          testId: 'sample-1',
          passed: hasDef && hasReturn && hasFP && hasFN && hasTP,
          description: 'Сигнатура функции и использование параметров',
          actualOutput: hasDef ? 'def binary_f1(tp, fp, fn): ...' : 'функция не найдена',
          expectedOutput: 'def binary_f1(tp, fp, fn): ...',
        },
        {
          testId: 'sample-2',
          passed: hasFormula && hasDenom,
          description: 'Формула F1 = 2·TP / (2·TP + FP + FN)',
          actualOutput: hasFormula ? 'формула присутствует' : 'формула не найдена',
          expectedOutput: '2*tp / (2*tp + fp + fn)',
        },
        {
          testId: 'sample-3',
          passed: hasZeroCheck,
          description: 'Обработка нулевого знаменателя',
          actualOutput: hasZeroCheck ? 'проверка нуля найдена' : 'проверка нуля отсутствует',
          expectedOutput: 'if denominator == 0: return 0.0',
        },
      ]

      const hiddenResults: TestResult[] = [
        { testId: 'f1-h1', passed: hasZeroCheck, description: 'Граничный случай: 0, 0, 0' },
        { testId: 'f1-h2', passed: hasFormula && hasDenom, description: 'Крупные значения' },
        { testId: 'f1-h3', passed: hasDenom, description: 'Точный precision, неполный recall' },
      ]

      const allPassed = sampleResults.every(r => r.passed)
      const totalPassed = [...sampleResults, ...hiddenResults].filter(r => r.passed).length
      const score = Math.round((totalPassed / (sampleResults.length + hiddenResults.length)) * 100)

      return { passed: allPassed, sampleResults, hiddenResults, score }
    },
  },

  // ── Task 2: Sum pairs stdin/stdout ───────────────────────────────────────
  {
    id: 'sum-pairs',
    title: '2. Sum Pairs (stdin/stdout)',
    type: 'stdin-stdout',
    statement:
      'Напишите программу, которая читает из stdin:\n- Первая строка: число n\n- Следующие n строк: два числа a и b через пробел\n\nВыведите n строк — сумму каждой пары.',
    constraints: [
      '1 ≤ n ≤ 1000',
      'Числа могут быть отрицательными',
      'Каждая сумма на отдельной строке',
      'Использовать input() и print()',
    ],
    starterCode: 'n = int(input())\nfor _ in range(n):\n    # read a pair and print sum\n    pass\n',
    sampleTests: [
      {
        input: '5\n1 2\n4 8\n-3 7\n10 0\n2 2',
        expectedOutput: '3\n12\n4\n10\n4',
        description: 'Базовый тест: 5 пар, включая отрицательное',
      },
      {
        input: '1\n0 0',
        expectedOutput: '0',
        description: 'Одна пара нулей',
      },
    ],
    hiddenTests: [
      { id: 'sp-h1', description: 'n=1, большие числа' },
      { id: 'sp-h2', description: 'n=10, все отрицательные' },
      { id: 'sp-h3', description: 'n=3, числа с пробелами в разных количествах' },
    ],
    checker: (code: string): CheckResult => {
      const c = code.toLowerCase()
      const hasInput = /input\s*\(/.test(c)
      const hasInt = /int\s*\(/.test(c)
      const hasPrint = /print\s*\(/.test(c)
      const hasLoop = /for\s+\w+\s+in\s+range|while/.test(c)
      const hasUnpack = /a\s*,\s*b\s*=|map\s*\(.*int.*input|split\s*\(/.test(c)
      const hasSum = /a\s*\+\s*b|sum\s*\(/.test(c)

      const sampleResults: TestResult[] = [
        {
          testId: 's-1',
          passed: hasInput && hasInt && hasLoop,
          description: 'Чтение n и цикл',
          actualOutput: hasInput ? 'input() и цикл найдены' : 'не найдено',
          expectedOutput: 'n = int(input()); for _ in range(n):',
        },
        {
          testId: 's-2',
          passed: hasUnpack,
          description: 'Распаковка пары a, b из строки',
          actualOutput: hasUnpack ? 'распаковка найдена' : 'не найдено',
          expectedOutput: 'a, b = map(int, input().split())',
        },
        {
          testId: 's-3',
          passed: hasPrint && hasSum,
          description: 'Вывод суммы print(a + b)',
          actualOutput: hasPrint && hasSum ? 'print с суммой найден' : 'не найдено',
          expectedOutput: 'print(a + b)',
        },
      ]

      const hiddenResults: TestResult[] = [
        { testId: 'sp-h1', passed: hasInput && hasInt, description: 'Большие числа' },
        { testId: 'sp-h2', passed: hasLoop && hasPrint, description: 'Отрицательные числа' },
        { testId: 'sp-h3', passed: hasUnpack && hasSum, description: 'Разные форматы пробелов' },
      ]

      const allPassed = sampleResults.every(r => r.passed)
      const totalPassed = [...sampleResults, ...hiddenResults].filter(r => r.passed).length
      const score = Math.round((totalPassed / (sampleResults.length + hiddenResults.length)) * 100)

      return { passed: allPassed, sampleResults, hiddenResults, score }
    },
  },

  // ── Task 2b: feature means stdin/stdout ──────────────────────────────────
  {
    id: 'stdin-feature-stats',
    title: '2b. Feature Means (stdin/stdout)',
    type: 'stdin-stdout',
    statement:
      'Считайте из stdin матрицу размера n×m и выведите среднее значение каждого столбца с точностью до 2 знаков.\n\nВвод:\n- Первая строка: n m\n- Далее n строк по m чисел\n\nВывод:\n- Одна строка: m чисел (средние по столбцам) через пробел.',
    constraints: [
      '1 ≤ n, m ≤ 100',
      'Использовать stdin/stdout формат',
      'Округление до 2 знаков после запятой',
      'Не использовать внешние библиотеки',
    ],
    starterCode:
      'n, m = map(int, input().split())\nrows = [list(map(float, input().split())) for _ in range(n)]\n# print column means\n',
    sampleTests: [
      {
        input: '3 2\n1 2\n3 4\n5 6',
        expectedOutput: '3.00 4.00',
        description: 'Средние по столбцам для простой матрицы',
      },
    ],
    hiddenTests: [
      { id: 'fs-h1', description: 'n=1, проверка единичной строки' },
      { id: 'fs-h2', description: 'Отрицательные и дробные значения' },
      { id: 'fs-h3', description: 'Проверка формата stdout с пробелами' },
    ],
    checker: (code: string): CheckResult => {
      const c = code.toLowerCase()
      const hasRead = /input\s*\(/.test(c) && /split\s*\(/.test(c)
      const hasLoop = /for\s+.+in\s+range|for\s+.+in\s+rows/.test(c)
      const hasColumnCalc = /sum\s*\(|zip\s*\(\s*\*rows|rows\[.*\]\[/.test(c)
      const hasPrint = /print\s*\(/.test(c)
      const hasFormat = /round\s*\(|:.2f|format\s*\(/.test(c)

      const sampleResults: TestResult[] = [
        { testId: 'fs-s1', passed: hasRead, description: 'Чтение n, m и строк матрицы' },
        { testId: 'fs-s2', passed: hasColumnCalc && hasLoop, description: 'Подсчёт средних по столбцам' },
        { testId: 'fs-s3', passed: hasPrint && hasFormat, description: 'Печать с точностью до 2 знаков' },
      ]
      const hiddenResults: TestResult[] = [
        { testId: 'fs-h1', passed: hasRead && hasPrint, description: 'Единичный случай' },
        { testId: 'fs-h2', passed: hasColumnCalc, description: 'Знаки и дроби' },
        { testId: 'fs-h3', passed: hasFormat, description: 'Формат вывода' },
      ]
      const allPassed = sampleResults.every(r => r.passed)
      const totalPassed = [...sampleResults, ...hiddenResults].filter(r => r.passed).length
      const score = Math.round((totalPassed / (sampleResults.length + hiddenResults.length)) * 100)
      return { passed: allPassed, sampleResults, hiddenResults, score }
    },
  },

  // ── Task 2c: minmax scaling stdin/stdout ─────────────────────────────────
  {
    id: 'stdin-minmax-scale',
    title: '2c. MinMax Scale (stdin/stdout)',
    type: 'stdin-stdout',
    statement:
      'Реализуйте MinMax масштабирование массива.\n\nВвод:\n- Первая строка: n\n- Вторая строка: n чисел\n\nВывод:\n- n чисел: (x-min)/(max-min), если max=min -> вывести n нулей.',
    constraints: [
      '1 ≤ n ≤ 1000',
      'Поддержка отрицательных чисел',
      'Если max == min, выводить 0.0 для каждого элемента',
      'Формат stdin/stdout',
    ],
    starterCode:
      'n = int(input())\narr = list(map(float, input().split()))\n# print scaled values\n',
    sampleTests: [
      {
        input: '5\n1 2 3 4 5',
        expectedOutput: '0.0 0.25 0.5 0.75 1.0',
        description: 'Базовый min-max scaling',
      },
    ],
    hiddenTests: [
      { id: 'mm-h1', description: 'max == min' },
      { id: 'mm-h2', description: 'Отрицательный диапазон' },
      { id: 'mm-h3', description: 'Большой n' },
    ],
    checker: (code: string): CheckResult => {
      const c = code.toLowerCase()
      const hasMinMax = /min\s*\(|max\s*\(/.test(c)
      const hasFormula = /\(\s*\w+\s*-\s*\w+\s*\)\s*\/\s*\(\s*\w+\s*-\s*\w+\s*\)/.test(c)
      const hasZeroCase = /if\s+.*==.*:|if\s+.*max.*min/.test(c)
      const hasPrint = /print\s*\(/.test(c)
      const hasRead = /int\s*\(\s*input/.test(c) && /split\s*\(/.test(c)

      const sampleResults: TestResult[] = [
        { testId: 'mm-s1', passed: hasRead, description: 'Чтение n и массива' },
        { testId: 'mm-s2', passed: hasMinMax && hasFormula, description: 'Формула min-max' },
        { testId: 'mm-s3', passed: hasZeroCase && hasPrint, description: 'Обработка max==min и вывод' },
      ]
      const hiddenResults: TestResult[] = [
        { testId: 'mm-h1', passed: hasZeroCase, description: 'Degenerate case' },
        { testId: 'mm-h2', passed: hasFormula, description: 'Отрицательные значения' },
        { testId: 'mm-h3', passed: hasPrint, description: 'Формат вывода' },
      ]
      const allPassed = sampleResults.every(r => r.passed)
      const totalPassed = [...sampleResults, ...hiddenResults].filter(r => r.passed).length
      const score = Math.round((totalPassed / (sampleResults.length + hiddenResults.length)) * 100)
      return { passed: allPassed, sampleResults, hiddenResults, score }
    },
  },

  // ── Task 2d: threshold metrics stdin/stdout ───────────────────────────────
  {
    id: 'stdin-threshold-metrics',
    title: '2d. Threshold Metrics (stdin/stdout)',
    type: 'stdin-stdout',
    statement:
      'По вероятностям и истинным меткам посчитайте TP FP FN при заданном пороге.\n\nВвод:\n- Первая строка: n threshold\n- Вторая строка: n вероятностей [0..1]\n- Третья строка: n меток 0/1\n\nВывод:\n- Одна строка: TP FP FN',
    constraints: [
      'Использовать threshold: pred=1, если p >= threshold',
      'Подсчитать TP, FP, FN',
      'stdin/stdout формат',
      'n до 10^4',
    ],
    starterCode:
      'n, threshold = input().split()\nn = int(n)\nthreshold = float(threshold)\nprobs = list(map(float, input().split()))\ny = list(map(int, input().split()))\n# print TP FP FN\n',
    sampleTests: [
      {
        input: '5 0.5\n0.9 0.7 0.4 0.3 0.8\n1 0 1 0 1',
        expectedOutput: '2 1 1',
        description: 'TP=2, FP=1, FN=1',
      },
    ],
    hiddenTests: [
      { id: 'tm-h1', description: 'Порог 0 и 1' },
      { id: 'tm-h2', description: 'Все предсказания отрицательные' },
      { id: 'tm-h3', description: 'Граничные p == threshold' },
    ],
    checker: (code: string): CheckResult => {
      const c = code.toLowerCase()
      const hasThresholdComp = />=\s*threshold|>=\s*t|if\s+.*>=/.test(c)
      const hasCounters = /tp|fp|fn/.test(c)
      const hasConditions = /if\s+.*and|if\s+.*==\s*1|elif/.test(c)
      const hasLoop = /for\s+.+in\s+range|zip\s*\(/.test(c)
      const hasPrint = /print\s*\(/.test(c)

      const sampleResults: TestResult[] = [
        { testId: 'tm-s1', passed: hasThresholdComp, description: 'Пороговая бинаризация p>=threshold' },
        { testId: 'tm-s2', passed: hasCounters && hasConditions && hasLoop, description: 'Подсчёт TP/FP/FN' },
        { testId: 'tm-s3', passed: hasPrint, description: 'Вывод трёх счётчиков' },
      ]
      const hiddenResults: TestResult[] = [
        { testId: 'tm-h1', passed: hasThresholdComp, description: 'Экстремальные пороги' },
        { testId: 'tm-h2', passed: hasCounters, description: 'Случай без позитивных предсказаний' },
        { testId: 'tm-h3', passed: hasConditions, description: 'Граница равенства порогу' },
      ]
      const allPassed = sampleResults.every(r => r.passed)
      const totalPassed = [...sampleResults, ...hiddenResults].filter(r => r.passed).length
      const score = Math.round((totalPassed / (sampleResults.length + hiddenResults.length)) * 100)
      return { passed: allPassed, sampleResults, hiddenResults, score }
    },
  },

  // ── Task 2e: batch mse stdin/stdout ───────────────────────────────────────
  {
    id: 'stdin-batch-loss',
    title: '2e. Batch MSE (stdin/stdout)',
    type: 'stdin-stdout',
    statement:
      'Вычислите MSE по двум векторным строкам y_true и y_pred.\n\nВвод:\n- Первая строка: n\n- Вторая строка: y_true (n чисел)\n- Третья строка: y_pred (n чисел)\n\nВывод:\n- Одно число MSE.',
    constraints: [
      'MSE = (1/n) * sum((y_pred - y_true)^2)',
      'Поддержка float',
      'stdin/stdout формат',
      'Результат можно выводить с 6 знаками',
    ],
    starterCode:
      'n = int(input())\ny_true = list(map(float, input().split()))\ny_pred = list(map(float, input().split()))\n# print mse\n',
    sampleTests: [
      {
        input: '3\n1 2 3\n1 3 5',
        expectedOutput: '1.666667',
        description: 'MSE для [0,1,2]^2 -> 5/3',
      },
    ],
    hiddenTests: [
      { id: 'bl-h1', description: 'n=1' },
      { id: 'bl-h2', description: 'Отрицательные значения' },
      { id: 'bl-h3', description: 'Нули и равные векторы' },
    ],
    checker: (code: string): CheckResult => {
      const c = code.toLowerCase()
      const hasDiff = /y_pred.*y_true|y_true.*y_pred/.test(c)
      const hasSquare = /\*\*\s*2|\*\s*\w+\s*\*/.test(c)
      const hasMean = /\/\s*n|sum\s*\(.*\)\s*\/\s*n/.test(c)
      const hasRead = /int\s*\(\s*input/.test(c) && /map\s*\(\s*float/.test(c)
      const hasPrint = /print\s*\(/.test(c)

      const sampleResults: TestResult[] = [
        { testId: 'bl-s1', passed: hasRead, description: 'Чтение n, y_true, y_pred' },
        { testId: 'bl-s2', passed: hasDiff && hasSquare, description: 'Квадрат ошибки' },
        { testId: 'bl-s3', passed: hasMean && hasPrint, description: 'Среднее и вывод MSE' },
      ]
      const hiddenResults: TestResult[] = [
        { testId: 'bl-h1', passed: hasMean, description: 'Единичный пример' },
        { testId: 'bl-h2', passed: hasSquare, description: 'Отрицательные числа' },
        { testId: 'bl-h3', passed: hasDiff, description: 'Нулевой loss case' },
      ]
      const allPassed = sampleResults.every(r => r.passed)
      const totalPassed = [...sampleResults, ...hiddenResults].filter(r => r.passed).length
      const score = Math.round((totalPassed / (sampleResults.length + hiddenResults.length)) * 100)
      return { passed: allPassed, sampleResults, hiddenResults, score }
    },
  },

  // ── Task 3: PyTorch MLP ─────────────────────────────────────────────────
  {
    id: 'pytorch-mlp',
    title: '3. PyTorch MLP Checker',
    type: 'pytorch-structural',
    statement:
      'Реализуйте полный MLP-классификатор на PyTorch:\n1. Класс, наследующий `nn.Module` с методом `forward`\n2. Минимум 2 скрытых слоя (`nn.Linear`) и нелинейность (ReLU)\n3. Полный train-loop: zero_grad → forward → loss → backward → step\n4. Inference: `.eval()` + `torch.no_grad()`',
    constraints: [
      'Использовать nn.Module как базовый класс',
      'Минимум 3 nn.Linear (2 скрытых + 1 выходной)',
      'Обязательна нелинейность: ReLU/GELU/SiLU',
      'Train-loop: zero_grad, backward, step',
      'Inference: eval() и no_grad()',
    ],
    starterCode:
      'import torch\nimport torch.nn as nn\nimport torch.nn.functional as F\n\nclass MLP(nn.Module):\n    def __init__(self, input_dim, hidden_dim, output_dim):\n        super().__init__()\n        # your layers here\n        pass\n\n    def forward(self, x):\n        # your forward pass\n        pass\n\n# Training setup\nmodel = MLP(10, 64, 2)\noptimizer = torch.optim.Adam(model.parameters(), lr=1e-3)\ncriterion = nn.CrossEntropyLoss()\n\n# Train loop\nfor epoch in range(10):\n    model.train()\n    # your training code here\n    pass\n\n# Inference\nmodel.eval()\nwith torch.no_grad():\n    # your inference code here\n    pass\n',
    sampleTests: [
      {
        input: 'Structural check',
        expectedOutput: 'All 6 structural requirements met',
        description: 'Проверка структуры кода',
      },
    ],
    hiddenTests: [
      { id: 'pt-h1', description: 'Проверка правильного порядка вызовов в train-loop' },
      { id: 'pt-h2', description: 'Проверка наличия активационных функций в forward' },
      { id: 'pt-h3', description: 'Проверка eval+no_grad паттерна для инференса' },
    ],
    checker: (code: string): CheckResult => {
      const c = code.toLowerCase()
      const checks = [
        { id: 'pt-s1', label: 'Класс, наследующий nn.Module', passed: /class\s+\w+\s*\(\s*nn\.module\s*\)/.test(c) },
        { id: 'pt-s2', label: 'Метод forward определён', passed: /def\s+forward\s*\(/.test(c) },
        {
          id: 'pt-s3',
          label: 'Минимум 3 nn.Linear (2 hidden + 1 output)',
          passed: (c.match(/nn\.linear\s*\(/g) ?? []).length >= 3,
        },
        {
          id: 'pt-s4',
          label: 'Нелинейность (ReLU/GELU/SiLU)',
          passed: /(nn\.relu|nn\.gelu|nn\.silu|f\.relu|f\.gelu|torch\.relu|\.relu\s*\()/.test(c),
        },
        {
          id: 'pt-s5',
          label: 'Train-loop: zero_grad → backward → step',
          passed: /zero_grad\s*\(/.test(c) && /backward\s*\(/.test(c) && /\.step\s*\(/.test(c),
        },
        {
          id: 'pt-s6',
          label: 'Inference: eval() + no_grad()',
          passed: /\.eval\s*\(/.test(c) && /torch\.no_grad\s*\(/.test(c),
        },
      ]

      const sampleResults: TestResult[] = checks.map(ch => ({
        testId: ch.id,
        passed: ch.passed,
        description: ch.label,
        actualOutput: ch.passed ? '✓ найдено' : '✗ не найдено',
        expectedOutput: '✓ обязательно',
      }))

      const hiddenResults: TestResult[] = [
        { testId: 'pt-h1', passed: /zero_grad/.test(c) && /backward/.test(c), description: 'Порядок вызовов train-loop' },
        { testId: 'pt-h2', passed: /(relu|gelu|silu)/.test(c), description: 'Активация в forward' },
        { testId: 'pt-h3', passed: /\.eval\s*\(/.test(c) && /no_grad/.test(c), description: 'eval + no_grad паттерн' },
      ]

      const allPassed = sampleResults.every(r => r.passed)
      const totalPassed = [...sampleResults, ...hiddenResults].filter(r => r.passed).length
      const score = Math.round((totalPassed / (sampleResults.length + hiddenResults.length)) * 100)

      return { passed: allPassed, sampleResults, hiddenResults, score }
    },
  },

  // ── Task 4: Fill-in-code: Gradient Descent ───────────────────────────────
  {
    id: 'fill-gradient-descent',
    title: '4. Fill-in: Gradient Descent',
    type: 'fill-in-code',
    statement:
      'Дополните реализацию градиентного спуска для минимизации MSE. Заполните места, помеченные `# TODO`.\n\nАлгоритм:\n1. Вычислить предсказания: ŷ = X @ w\n2. Вычислить ошибку: error = ŷ - y\n3. Вычислить градиент MSE: grad = (2/n) * X.T @ error\n4. Обновить веса: w = w - lr * grad',
    constraints: [
      'Использовать numpy (import numpy as np)',
      'X имеет форму (n, d), w форму (d,), y форму (n,)',
      'Одна итерация gradient descent step',
      'Вернуть обновлённые веса w',
    ],
    starterCode:
      'import numpy as np\n\ndef gradient_descent_step(X, y, w, lr=0.01):\n    """One step of gradient descent for MSE loss.\n    \n    Args:\n        X: features (n, d)\n        y: targets (n,)\n        w: weights (d,)\n        lr: learning rate\n    \n    Returns:\n        Updated weights w_new\n    """\n    n = len(y)\n    \n    # TODO: compute predictions\n    y_pred = # ???\n    \n    # TODO: compute error\n    error = # ???\n    \n    # TODO: compute gradient of MSE\n    grad = # ???\n    \n    # TODO: update weights\n    w_new = # ???\n    \n    return w_new\n',
    sampleTests: [
      {
        input: 'X=[[1,2],[3,4]], y=[5,6], w=[0,0], lr=0.1',
        expectedOutput: 'w_new != [0, 0] (weights updated)',
        description: 'Веса должны измениться после одного шага',
      },
    ],
    hiddenTests: [
      { id: 'gd-h1', description: 'Корректная формула градиента: (2/n) * X.T @ error' },
      { id: 'gd-h2', description: 'Правильное обновление весов: w - lr * grad' },
      { id: 'gd-h3', description: 'Использование матричных операций numpy (@ или dot)' },
    ],
    checker: (code: string): CheckResult => {
      const c = code.toLowerCase()
      const hasImport = /import\s+numpy/.test(c)
      const hasPred = /y_pred\s*=\s*x\s*@\s*w|y_pred\s*=\s*np\.dot\s*\(\s*x/.test(c)
      const hasError = /error\s*=\s*y_pred\s*-\s*y/.test(c)
      const hasGrad = /\(2\s*\/\s*n\s*\)\s*\*\s*x\s*\.\s*t[\s@]|np\.dot\s*\(\s*x\s*\.\s*t|x\.transpose\s*\(\s*\)/.test(c)
      const hasUpdate = /w_new\s*=\s*w\s*-\s*lr\s*\*\s*grad/.test(c)
      const hasReturn = /return\s+w_new/.test(c)

      const sampleResults: TestResult[] = [
        {
          testId: 'gd-s1',
          passed: hasImport && hasPred,
          description: 'import numpy + y_pred = X @ w',
          actualOutput: hasPred ? 'y_pred = X @ w найдено' : 'не найдено',
          expectedOutput: 'y_pred = X @ w',
          diff: hasPred ? undefined : lineDiff('(отсутствует)', 'y_pred = X @ w'),
        },
        {
          testId: 'gd-s2',
          passed: hasError && hasGrad,
          description: 'error = ŷ - y и grad = (2/n) * X.T @ error',
          actualOutput: hasError && hasGrad ? 'формулы найдены' : 'частично найдено',
          expectedOutput: 'error = y_pred - y\ngrad = (2/n) * X.T @ error',
        },
        {
          testId: 'gd-s3',
          passed: hasUpdate && hasReturn,
          description: 'w_new = w - lr * grad и return w_new',
          actualOutput: hasUpdate && hasReturn ? 'обновление и return найдены' : 'не найдено',
          expectedOutput: 'w_new = w - lr * grad\nreturn w_new',
        },
      ]

      const hiddenResults: TestResult[] = [
        { testId: 'gd-h1', passed: hasGrad, description: 'Правильный градиент' },
        { testId: 'gd-h2', passed: hasUpdate, description: 'Правильное обновление весов' },
        { testId: 'gd-h3', passed: hasPred && hasError, description: 'Матричные операции numpy' },
      ]

      const allPassed = sampleResults.every(r => r.passed)
      const totalPassed = [...sampleResults, ...hiddenResults].filter(r => r.passed).length
      const score = Math.round((totalPassed / (sampleResults.length + hiddenResults.length)) * 100)

      return { passed: allPassed, sampleResults, hiddenResults, score }
    },
  },

  // ── Task 5: Debugging: broken normalization ──────────────────────────────
  {
    id: 'debug-normalization',
    title: '5. Debugging: Normalize Function',
    type: 'debugging',
    statement:
      'Эта функция нормализации данных содержит 3 ошибки. Найдите и исправьте их.\n\nОжидаемое поведение: normalize(x) = (x - mean) / std, возвращает numpy array.',
    constraints: [
      'Ошибка 1: неправильная ось вычисления mean (должна быть axis=0)',
      'Ошибка 2: деление на mean вместо std',
      'Ошибка 3: возвращает список вместо numpy array',
      'Функция должна называться normalize и принимать numpy array X',
    ],
    starterCode:
      'import numpy as np\n\ndef normalize(X):\n    """Normalize features to zero mean and unit variance.\n    \n    Bug 1: wrong axis for mean\n    Bug 2: divides by mean instead of std  \n    Bug 3: returns list instead of ndarray\n    """\n    # BUG 1: should be axis=0 (per feature), not axis=1\n    mean = np.mean(X, axis=1)\n    \n    std = np.std(X, axis=0)\n    std = np.where(std == 0, 1, std)\n    \n    # BUG 2: should divide by std, not mean\n    normalized = (X - mean) / mean\n    \n    # BUG 3: should return numpy array, not list\n    return normalized.tolist()\n',
    sampleTests: [
      {
        input: 'normalize(np.array([[1,2],[3,4],[5,6]]))',
        expectedOutput: 'array with mean≈0, std≈1 per column',
        description: 'Нормализованный массив: среднее≈0, std≈1 по столбцам',
      },
    ],
    hiddenTests: [
      { id: 'dn-h1', description: 'axis=0 в np.mean (нормализация по признакам)' },
      { id: 'dn-h2', description: 'Деление на std, а не mean' },
      { id: 'dn-h3', description: 'Возврат numpy array (не list)' },
    ],
    checker: (code: string): CheckResult => {
      const c = code.toLowerCase()
      const fixedAxis = /np\.mean\s*\(.*axis\s*=\s*0/.test(c)
      const divByMean = /normalized\s*=\s*\(x\s*-\s*mean\)\s*\/\s*mean/.test(c)
      const divByStd = /normalized\s*=\s*\(x\s*-\s*mean\)\s*\/\s*std/.test(c)
      // Bug is fixed when dividing by std (not mean) is present
      const fixedDiv = !divByMean && divByStd
      const hasToList = /\.tolist\s*\(\)/.test(c)
      const hasReturnNormalized = /return\s+normalized/.test(c)
      // Bug is fixed when return statement exists without .tolist()
      const fixedReturn = !hasToList && hasReturnNormalized

      const sampleResults: TestResult[] = [
        {
          testId: 'dn-s1',
          passed: fixedAxis,
          description: 'Исправлена ось: np.mean(X, axis=0)',
          actualOutput: fixedAxis ? 'axis=0 найден' : 'axis != 0 или не найдено',
          expectedOutput: 'np.mean(X, axis=0)',
          diff: fixedAxis ? undefined : lineDiff('np.mean(X, axis=1)', 'np.mean(X, axis=0)'),
        },
        {
          testId: 'dn-s2',
          passed: fixedDiv,
          description: 'Исправлено деление: (X - mean) / std',
          actualOutput: fixedDiv ? '/ std найдено' : '/ mean (ошибка) или не найдено',
          expectedOutput: '(X - mean) / std',
          diff: fixedDiv ? undefined : lineDiff('(X - mean) / mean', '(X - mean) / std'),
        },
        {
          testId: 'dn-s3',
          passed: fixedReturn,
          description: 'Исправлен возврат: return normalized (не .tolist())',
          actualOutput: fixedReturn ? 'return normalized без tolist()' : '.tolist() всё ещё присутствует',
          expectedOutput: 'return normalized',
          diff: fixedReturn ? undefined : lineDiff('return normalized.tolist()', 'return normalized'),
        },
      ]

      const hiddenResults: TestResult[] = [
        { testId: 'dn-h1', passed: fixedAxis, description: 'axis=0 для mean' },
        { testId: 'dn-h2', passed: fixedDiv, description: 'Деление на std' },
        { testId: 'dn-h3', passed: fixedReturn, description: 'Возврат ndarray' },
      ]

      const allPassed = sampleResults.every(r => r.passed)
      const totalPassed = [...sampleResults, ...hiddenResults].filter(r => r.passed).length
      const score = Math.round((totalPassed / (sampleResults.length + hiddenResults.length)) * 100)

      return { passed: allPassed, sampleResults, hiddenResults, score }
    },
  },
]

// ─── Sub-components ─────────────────────────────────────────────────────────

function CheckResultPanel({ result }: { result: CheckResult }) {
  const pct = result.score
  const grade =
    pct >= 80
      ? { color: 'text-green-700', bg: 'bg-green-50 border-green-200' }
      : pct >= 50
      ? { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' }
      : { color: 'text-red-700', bg: 'bg-red-50 border-red-200' }

  return (
    <div className="space-y-4">
      {/* Score */}
      <div className={`rounded-xl border p-4 ${grade.bg}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xl font-bold ${grade.color}`}>
            {pct >= 80 ? '✅' : pct >= 50 ? '⚠️' : '❌'} Результат: {pct}%
          </span>
          <span className="text-sm text-gray-500">
            {[...result.sampleResults, ...result.hiddenResults].filter(r => r.passed).length} /{' '}
            {result.sampleResults.length + result.hiddenResults.length} тестов
          </span>
        </div>
        {result.feedback && <p className="mt-1 text-sm text-gray-600">{result.feedback}</p>}
      </div>

      {/* Sample tests */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          📋 Видимые тесты ({result.sampleResults.filter(r => r.passed).length}/{result.sampleResults.length}):
        </h4>
        <div className="space-y-2">
          {result.sampleResults.map(t => (
            <div
              key={t.testId}
              className={`rounded-lg border p-3 text-sm ${t.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
            >
              <div className="flex items-center gap-2 font-medium">
                <span>{t.passed ? '✅' : '❌'}</span>
                <span className={t.passed ? 'text-green-700' : 'text-red-700'}>{t.description}</span>
              </div>
              {!t.passed && t.diff && (
                <pre className="mt-2 text-xs font-mono bg-white border border-red-200 rounded p-2 overflow-x-auto whitespace-pre-wrap">
                  {t.diff}
                </pre>
              )}
              {!t.passed && t.actualOutput && !t.diff && (
                <div className="mt-1 text-xs text-gray-600">
                  Получено: <code className="font-mono">{t.actualOutput}</code>
                  {t.expectedOutput && (
                    <>
                      {' → '} Ожидалось: <code className="font-mono">{t.expectedOutput}</code>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hidden tests */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          🔒 Скрытые тесты ({result.hiddenResults.filter(r => r.passed).length}/{result.hiddenResults.length}):
        </h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {result.hiddenResults.map(t => (
            <div
              key={t.testId}
              className={`rounded-lg border px-3 py-2 text-sm flex items-center gap-2 ${
                t.passed ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <span>{t.passed ? '✅' : '❌'}</span>
              <span>{t.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface TaskPanelProps {
  task: CodeTask
}

function TaskPanel({ task }: TaskPanelProps) {
  const [code, setCode] = useState(task.starterCode)
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [activeTab, setActiveTab] = useState<'statement' | 'tests' | 'result'>('statement')

  const handleCheck = () => {
    const result = task.checker(code)
    setCheckResult(result)
    setActiveTab('result')
  }

  const handleReset = () => {
    setCode(task.starterCode)
    setCheckResult(null)
    setActiveTab('statement')
  }

  const typeColors: Record<string, string> = {
    'function': 'bg-blue-100 text-blue-700',
    'stdin-stdout': 'bg-purple-100 text-purple-700',
    'pytorch-structural': 'bg-orange-100 text-orange-700',
    'fill-in-code': 'bg-green-100 text-green-700',
    'debugging': 'bg-red-100 text-red-700',
  }

  const typeLabels: Record<string, string> = {
    'function': 'Function',
    'stdin-stdout': 'Stdin/Stdout',
    'pytorch-structural': 'PyTorch',
    'fill-in-code': 'Fill-in',
    'debugging': 'Debug',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-800">{task.title}</h2>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[task.type]}`}>
            {typeLabels[task.type]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            ↺ Сброс
          </button>
          <button
            onClick={handleCheck}
            className="text-sm font-semibold px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ▶ Проверить
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-0 divide-x divide-gray-100">
        {/* Left: code editor */}
        <div>
          <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400 font-mono flex items-center gap-2">
            <span aria-hidden="true">🐍</span> Python 3
            <span className="ml-auto text-gray-500">pattern-based checker</span>
          </div>
          <Editor
            height="380px"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val ?? '')}
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              tabSize: 4,
              insertSpaces: true,
              wordWrap: 'on',
              automaticLayout: true,
              lineNumbers: 'on',
            }}
          />
        </div>

        {/* Right: tabs for statement / tests / result */}
        <div className="flex flex-col">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100 bg-gray-50">
            {(['statement', 'tests', 'result'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'statement' ? '📋 Условие' : tab === 'tests' ? '🧪 Тесты' : '📊 Результат'}
                {tab === 'result' && checkResult && (
                  <span className={`ml-1 inline-block w-2 h-2 rounded-full ${checkResult.passed ? 'bg-green-500' : 'bg-red-500'}`} />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4 text-sm">
            {activeTab === 'statement' && (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{task.statement}</p>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">�� Ограничения:</h4>
                  <ul className="space-y-1">
                    {task.constraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <span className="text-blue-400 shrink-0">•</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">📋 Видимые тесты:</h4>
                {task.sampleTests.map((t, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                    <div className="bg-gray-50 px-3 py-1.5 font-medium text-gray-600">{t.description}</div>
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                      <div className="p-2">
                        <div className="text-gray-500 mb-1">Input:</div>
                        <pre className="font-mono text-gray-700 whitespace-pre-wrap">{t.input}</pre>
                      </div>
                      <div className="p-2">
                        <div className="text-gray-500 mb-1">Expected:</div>
                        <pre className="font-mono text-gray-700 whitespace-pre-wrap">{t.expectedOutput}</pre>
                      </div>
                    </div>
                  </div>
                ))}
                <h4 className="font-semibold text-gray-700 mt-4">🔒 Скрытые тесты ({task.hiddenTests.length}):</h4>
                <p className="text-gray-500 text-xs">Содержимое скрытых тестов не показывается. Видны только pass/fail.</p>
                <div className="flex flex-wrap gap-2">
                  {task.hiddenTests.map(ht => (
                    <span key={ht.id} className="bg-gray-100 border border-gray-200 rounded px-2 py-1 text-xs text-gray-500 font-mono">
                      {ht.id}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'result' && (
              checkResult ? (
                <CheckResultPanel result={checkResult} />
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-4xl mb-3">▶</div>
                  <p>Нажмите «Проверить» для запуска тестов</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function CodePracticePage() {
  const [searchParams] = useSearchParams()
  const taskFromUrl = searchParams.get('task')
  const orderedTasks = useMemo(() => {
    if (!taskFromUrl) return codeTasks
    const target = codeTasks.find((t) => t.id === taskFromUrl)
    if (!target) return codeTasks
    return [target, ...codeTasks.filter((t) => t.id !== taskFromUrl)]
  }, [taskFromUrl])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">💻 Code Practice Hub</h1>
        <p className="text-gray-600 max-w-3xl">
          Локальная проверка работает детерминированно через rule-based паттерны (regex + структурный анализ).
          Monaco Editor поддерживает Tab-отступы, подсветку синтаксиса Python и автодополнение.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {[
            { color: 'bg-blue-100 text-blue-700', label: 'Function-based' },
            { color: 'bg-purple-100 text-purple-700', label: 'Stdin/Stdout' },
            { color: 'bg-orange-100 text-orange-700', label: 'PyTorch structural' },
            { color: 'bg-green-100 text-green-700', label: 'Fill-in-code' },
            { color: 'bg-red-100 text-red-700', label: 'Debugging' },
          ].map(t => (
            <span key={t.label} className={`px-2 py-0.5 rounded-full font-semibold ${t.color}`}>{t.label}</span>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {orderedTasks.map(task => (
          <TaskPanel key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
