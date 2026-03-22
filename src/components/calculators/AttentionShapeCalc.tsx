import { useState } from 'react'

export default function AttentionShapeCalc() {
  const [B, setB] = useState('2')
  const [T, setT] = useState('16')
  const [dModel, setDModel] = useState('64')
  const [heads, setHeads] = useState('8')
  const b = parseInt(B) || 2, t = parseInt(T) || 16, d = parseInt(dModel) || 64, h = parseInt(heads) || 8
  const dk = Math.floor(d / h)
  const shapes = [
    ['Input Embeddings',             `[${b}, ${t}, ${d}]`,    '[B, T, d_model]'],
    ['Q / K / V (одна голова)',      `[${b}, ${t}, ${dk}]`,   '[B, T, d_k]'],
    ['Attention Scores (одна гол.)', `[${b}, ${t}, ${t}]`,    '[B, T, T]'],
    ['После Softmax',                `[${b}, ${t}, ${t}]`,    '[B, T, T]'],
    ['Weighted Sum (одна голова)',   `[${b}, ${t}, ${dk}]`,   '[B, T, d_v]'],
    ['Concat всех голов',            `[${b}, ${t}, ${d}]`,    '[B, T, d_model]'],
    ['После linear out-proj',        `[${b}, ${t}, ${d}]`,    '[B, T, d_model]'],
  ]
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 my-4">
      <h3 className="font-semibold text-purple-800 mb-2">🧮 Shape Checker для Multi-Head Attention</h3>
      {d % h !== 0 && <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">⚠️ d_model ({d}) не делится на heads ({h}), d_k округлён: {dk}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[['B (batch)', B, setB], ['T (seq_len)', T, setT], ['d_model', dModel, setDModel], ['heads (h)', heads, setHeads]].map(([label, val, set]) => (
          <div key={label as string}>
            <label className="block text-xs text-gray-600 mb-1">{label as string}</label>
            <input type="number" min="1" value={val as string} onChange={e => (set as (v: string) => void)(e.target.value)}
              className="w-full border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
        ))}
      </div>
      <p className="text-xs text-purple-700 mb-3 font-mono">d_k = d_model / heads = {d} / {h} = {dk}</p>
      <div className="space-y-1.5">
        {shapes.map(([label, shape, template]) => (
          <div key={label} className="flex items-center gap-2 bg-white border border-purple-100 rounded-lg px-3 py-2">
            <span className="text-xs text-gray-500 w-48 flex-shrink-0">{label}</span>
            <span className="font-mono text-sm text-purple-700 font-semibold">{shape}</span>
            <span className="text-xs text-gray-400 hidden sm:block">{template}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
