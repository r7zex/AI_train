import { useMemo, useRef } from 'react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
}

export default function CodeEditor({ value, onChange, height = 260 }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbers = useMemo(() => Array.from({ length: Math.max(6, value.split('\n').length) }, (_, index) => index + 1), [value])

  return (
    <div
      className="grid grid-cols-[48px,1fr] overflow-hidden border border-[#cfd5dc] bg-white text-[#1e2329]"
      style={{ height }}
    >
      <div className="overflow-hidden border-r border-[#dde2e8] bg-[#f3f5f7] px-2 py-2 text-right font-mono text-[12px] leading-6 text-[#8b95a1]">
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
        className="h-full w-full resize-none bg-white px-3 py-2 font-mono text-[13px] leading-6 text-[#1f252d] outline-none"
      />
    </div>
  )
}
