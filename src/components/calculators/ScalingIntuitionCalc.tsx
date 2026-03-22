import { useMemo, useState } from 'react'

function parseNumbers(input: string): number[] {
  return input
    .split(/[,\s;]+/g)
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v))
}

export default function ScalingIntuitionCalc() {
  const [raw, setRaw] = useState('2, 4, 4, 4, 5, 5, 7, 9')

  const result = useMemo(() => {
    const values = parseNumbers(raw)
    if (values.length === 0) {
      return { values: [], mean: 0, variance: 0, std: 0, zscores: [] as number[] }
    }

    const mean = values.reduce((s, v) => s + v, 0) / values.length
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
    const std = Math.sqrt(variance)
    const zscores = std === 0 ? values.map(() => 0) : values.map((v) => (v - mean) / std)

    return { values, mean, variance, std, zscores }
  }, [raw])

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Scaling Intuition Widget</h3>
      <p className="text-sm text-gray-600 mb-3">
        Введите небольшой набор чисел через запятую. Виджет покажет mean/std и z-score (стандартизацию).
      </p>

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono mb-4"
      />

      {result.values.length === 0 ? (
        <div className="text-sm text-gray-500">Введите хотя бы одно число.</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-2 text-sm mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">Mean: <strong>{result.mean.toFixed(4)}</strong></div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">Variance: <strong>{result.variance.toFixed(4)}</strong></div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">Std: <strong>{result.std.toFixed(4)}</strong></div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">x</th>
                  <th className="px-3 py-2 text-left">z = (x - mean) / std</th>
                </tr>
              </thead>
              <tbody>
                {result.values.map((v, i) => (
                  <tr key={`${v}-${i}`} className="border-t border-gray-100">
                    <td className="px-3 py-2 font-mono">{v}</td>
                    <td className="px-3 py-2 font-mono">{result.zscores[i].toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

