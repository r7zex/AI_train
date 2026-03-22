import { useMemo, useRef } from 'react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
}

export default function CodeEditor({ value, onChange, height = 420 }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbers = useMemo(() => Array.from({ length: Math.max(1, value.split('\n').length) }, (_, index) => index + 1), [value])

  return (
    <div className="grid grid-cols-[56px,1fr] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-slate-100" style={{ height }}>
      <div className="overflow-hidden border-r border-slate-800 bg-slate-900 px-3 py-4 text-right font-mono text-xs leading-6 text-slate-500">
        {lineNumbers.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          event.preventDefault()
          const textarea = textareaRef.current
          if (!textarea) return
          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          const nextValue = `${value.slice(0, start)}  ${value.slice(end)}`
          onChange(nextValue)
          requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 2
          })
        }}
        className="h-full w-full resize-none bg-slate-950 px-4 py-4 font-mono text-sm leading-6 text-slate-100 outline-none"
      />
    </div>
  )
}
