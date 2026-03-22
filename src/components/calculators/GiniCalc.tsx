import { useState } from 'react'

export default function GiniCalc() {
  const [classInput, setClassInput] = useState('6, 4')
  const counts = classInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0)
  const total = counts.reduce((a, b) => a + b, 0)
  const probs = total > 0 ? counts.map(c => c / total) : []
  const gini = 1 - probs.reduce((acc, p) => acc + p * p, 0)
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-5 my-4">
      <h3 className="font-semibold text-green-800 mb-2">🧮 Калькулятор Gini Impurity</h3>
      <p className="text-sm text-green-700 mb-3 font-mono bg-green-100 px-3 py-2 rounded-lg">Gini = 1 − Σ pᵢ²</p>
      <div className="mb-4">
        <label className="block text-xs text-gray-600 mb-1">Количество объектов по классам (через запятую)</label>
        <input type="text" value={classInput} onChange={e => setClassInput(e.target.value)} placeholder="6, 4"
          className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
      </div>
      {total > 0 && (
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">Всего: {total} · Классы: [{counts.join(', ')}]</p>
          <p className="text-gray-600">Вероятности: [{probs.map(p => p.toFixed(4)).join(', ')}]</p>
          <p className="text-gray-600">Σpᵢ² = {probs.reduce((a, p) => a + p*p, 0).toFixed(4)}</p>
          <div className="bg-white border border-green-200 rounded-xl p-4 text-center mt-3">
            <div className="text-xs text-gray-500 mb-1">Gini Impurity</div>
            <div className="text-3xl font-bold text-green-700">{gini.toFixed(4)}</div>
            <div className="text-xs mt-1">{gini === 0 ? '✅ Чистый узел' : gini < 0.25 ? '🟢 Хорошее разбиение' : gini < 0.45 ? '🟡 Умеренная примесь' : '🔴 Высокая примесь'}</div>
          </div>
        </div>
      )}
    </div>
  )
}
