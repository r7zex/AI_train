import { useMemo, useState } from 'react'

function safeDiv(a: number, b: number): number {
  if (b === 0) return 0
  return a / b
}

function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export default function ConfusionMatrixPlayground() {
  const [tp, setTp] = useState('25')
  const [fp, setFp] = useState('6')
  const [fn, setFn] = useState('9')
  const [tn, setTn] = useState('60')

  const metrics = useMemo(() => {
    const TP = Math.max(0, Number(tp) || 0)
    const FP = Math.max(0, Number(fp) || 0)
    const FN = Math.max(0, Number(fn) || 0)
    const TN = Math.max(0, Number(tn) || 0)

    const precision = safeDiv(TP, TP + FP)
    const recall = safeDiv(TP, TP + FN)
    const specificity = safeDiv(TN, TN + FP)
    const f1 = safeDiv(2 * precision * recall, precision + recall)
    const accuracy = safeDiv(TP + TN, TP + FP + FN + TN)
    const balancedAccuracy = (recall + specificity) / 2

    return { TP, FP, FN, TN, precision, recall, specificity, f1, accuracy, balancedAccuracy }
  }, [tp, fp, fn, tn])

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Confusion Matrix Playground</h3>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {[
          { label: 'TP', value: tp, setValue: setTp },
          { label: 'FP', value: fp, setValue: setFp },
          { label: 'FN', value: fn, setValue: setFn },
          { label: 'TN', value: tn, setValue: setTn },
        ].map((field) => (
          <label key={field.label} className="text-sm">
            <span className="block text-gray-600 mb-1">{field.label}</span>
            <input
              type="number"
              min={0}
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </label>
        ))}
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Факт \\ Предсказание</th>
              <th className="px-3 py-2 text-center">Positive</th>
              <th className="px-3 py-2 text-center">Negative</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100">
              <td className="px-3 py-2 font-medium">Positive</td>
              <td className="px-3 py-2 text-center bg-green-50">{metrics.TP}</td>
              <td className="px-3 py-2 text-center bg-red-50">{metrics.FN}</td>
            </tr>
            <tr className="border-t border-gray-100">
              <td className="px-3 py-2 font-medium">Negative</td>
              <td className="px-3 py-2 text-center bg-red-50">{metrics.FP}</td>
              <td className="px-3 py-2 text-center bg-green-50">{metrics.TN}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-3 gap-2 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">Precision: <strong>{percent(metrics.precision)}</strong></div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">Recall: <strong>{percent(metrics.recall)}</strong></div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">F1: <strong>{percent(metrics.f1)}</strong></div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">Specificity: <strong>{percent(metrics.specificity)}</strong></div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">Accuracy: <strong>{percent(metrics.accuracy)}</strong></div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">Balanced Acc: <strong>{percent(metrics.balancedAccuracy)}</strong></div>
      </div>
    </div>
  )
}

