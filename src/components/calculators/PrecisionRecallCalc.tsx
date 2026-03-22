import { useState } from 'react'

export default function PrecisionRecallCalc() {
  const [vals, setVals] = useState({ tp: 80, fp: 20, fn: 10, tn: 390 })
  const set = (k: string, v: string) => setVals(prev => ({ ...prev, [k]: parseInt(v) || 0 }))
  const { tp, fp, fn, tn } = vals
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0
  const f1 = precision + recall > 0 ? 2 * precision * recall / (precision + recall) : 0
  const accuracy = (tp + fp + fn + tn) > 0 ? (tp + tn) / (tp + fp + fn + tn) : 0
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 my-4">
      <h3 className="font-semibold text-blue-800 mb-3">🧮 Калькулятор Precision / Recall / F1</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { key: 'tp', label: 'TP (True Positive)',  border: 'border-green-400' },
          { key: 'fp', label: 'FP (False Positive)', border: 'border-red-400' },
          { key: 'fn', label: 'FN (False Negative)', border: 'border-orange-400' },
          { key: 'tn', label: 'TN (True Negative)',  border: 'border-blue-400' },
        ].map(({ key, label, border }) => (
          <div key={key}>
            <label className="block text-xs text-gray-600 mb-1">{label}</label>
            <input type="number" min="0" value={vals[key as keyof typeof vals]}
              onChange={e => set(key, e.target.value)}
              className={`w-full border-2 ${border} rounded-lg px-3 py-2 text-sm focus:outline-none`} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Precision', value: precision, color: 'bg-green-100 text-green-800' },
          { label: 'Recall',    value: recall,    color: 'bg-orange-100 text-orange-800' },
          { label: 'F1 Score',  value: f1,        color: 'bg-blue-100 text-blue-800' },
          { label: 'Accuracy',  value: accuracy,  color: 'bg-purple-100 text-purple-800' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-xl p-3 text-center`}>
            <div className="text-xs font-medium opacity-75">{label}</div>
            <div className="text-2xl font-bold mt-1">{(value * 100).toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
