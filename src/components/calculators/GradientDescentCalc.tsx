import { useState } from 'react'

export default function GradientDescentCalc() {
  const [w, setW] = useState('2.0')
  const [grad, setGrad] = useState('0.5')
  const [lr, setLr] = useState('0.1')
  const wVal = parseFloat(w) || 0
  const gradVal = parseFloat(grad) || 0
  const lrVal = parseFloat(lr) || 0
  const newW = wVal - lrVal * gradVal
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 my-4">
      <h3 className="font-semibold text-orange-800 mb-2">🧮 Калькулятор шага градиентного спуска</h3>
      <p className="text-sm text-orange-700 mb-3 font-mono bg-orange-100 px-3 py-2 rounded-lg">w_new = w − lr × ∇L(w)</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'w (текущий вес)', val: w, set: setW },
          { label: '∇L(w) (градиент)', val: grad, set: setGrad },
          { label: 'lr (learning rate)', val: lr, set: setLr },
        ].map(({ label, val, set }) => (
          <div key={label}>
            <label className="block text-xs text-gray-600 mb-1">{label}</label>
            <input type="number" step="0.01" value={val} onChange={e => set(e.target.value)}
              className="w-full border border-orange-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-orange-200 rounded-xl p-4 text-center">
        <div className="text-xs text-gray-500 mb-1">Новое значение w</div>
        <div className="text-3xl font-bold text-orange-700">{newW.toFixed(6)}</div>
        <div className="text-xs text-gray-400 mt-2 font-mono">
          {wVal} − {lrVal} × {gradVal} = {wVal} − {(lrVal * gradVal).toFixed(6)} = {newW.toFixed(6)}
        </div>
      </div>
    </div>
  )
}
