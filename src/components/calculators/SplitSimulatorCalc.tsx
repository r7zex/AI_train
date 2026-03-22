import { useMemo, useState } from 'react'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export default function SplitSimulatorCalc() {
  const [total, setTotal] = useState('1000')
  const [trainPct, setTrainPct] = useState('70')
  const [validPct, setValidPct] = useState('15')
  const [testPct, setTestPct] = useState('15')
  const [positiveRate, setPositiveRate] = useState('18')

  const result = useMemo(() => {
    const n = Math.max(1, Math.floor(Number(total) || 0))
    let train = clamp(Number(trainPct) || 0, 0, 100)
    let valid = clamp(Number(validPct) || 0, 0, 100)
    let test = clamp(Number(testPct) || 0, 0, 100)
    const p = clamp(Number(positiveRate) || 0, 0, 100) / 100

    const sum = train + valid + test
    if (sum === 0) {
      train = 70
      valid = 15
      test = 15
    } else if (sum !== 100) {
      train = (train / sum) * 100
      valid = (valid / sum) * 100
      test = (test / sum) * 100
    }

    const nTrain = Math.round((train / 100) * n)
    const nValid = Math.round((valid / 100) * n)
    const nTest = n - nTrain - nValid

    const split = (size: number) => {
      const pos = Math.round(size * p)
      return { pos, neg: size - pos, size }
    }

    return {
      n,
      train,
      valid,
      test,
      trainSplit: split(nTrain),
      validSplit: split(nValid),
      testSplit: split(nTest),
    }
  }, [total, trainPct, validPct, testPct, positiveRate])

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Train/Valid/Test Split Simulator</h3>

      <div className="grid sm:grid-cols-5 gap-3 mb-4">
        {[
          { label: 'Total', value: total, set: setTotal },
          { label: 'Train %', value: trainPct, set: setTrainPct },
          { label: 'Valid %', value: validPct, set: setValidPct },
          { label: 'Test %', value: testPct, set: setTestPct },
          { label: 'Positive %', value: positiveRate, set: setPositiveRate },
        ].map((f) => (
          <label key={f.label} className="text-sm">
            <span className="block text-gray-600 mb-1">{f.label}</span>
            <input
              type="number"
              min={0}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
            />
          </label>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Split</th>
              <th className="px-3 py-2 text-right">Размер</th>
              <th className="px-3 py-2 text-right">Positive</th>
              <th className="px-3 py-2 text-right">Negative</th>
              <th className="px-3 py-2 text-right">Доля</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Train', pct: result.train, data: result.trainSplit },
              { name: 'Valid', pct: result.valid, data: result.validSplit },
              { name: 'Test', pct: result.test, data: result.testSplit },
            ].map((row) => (
              <tr key={row.name} className="border-t border-gray-100">
                <td className="px-3 py-2 font-medium">{row.name}</td>
                <td className="px-3 py-2 text-right">{row.data.size}</td>
                <td className="px-3 py-2 text-right text-green-700">{row.data.pos}</td>
                <td className="px-3 py-2 text-right text-red-700">{row.data.neg}</td>
                <td className="px-3 py-2 text-right">{row.pct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Симулятор показывает стратифицированный split: доля positive/negative сохраняется в каждом поднаборе.
      </p>
    </div>
  )
}

