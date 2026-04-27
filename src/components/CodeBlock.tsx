import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  code: string
  language?: string
  output?: string
  explanation?: string
}

export default function CodeBlock({ code, language = 'python', output, explanation }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 overflow-hidden bg-[#f3f4f6]">
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">{language}</span>
        <button onClick={handleCopy} className="border border-[#d1d5db] bg-white px-2.5 py-1 text-[12px] text-[#374151] transition-colors hover:bg-[#f9fafb]">
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: '#f3f4f6',
          fontSize: '0.92rem',
          lineHeight: '1.55',
          padding: '12px 16px 18px',
        }}
        codeTagProps={{ style: { fontFamily: 'Source Code Pro, Consolas, Menlo, monospace' } }}
      >
        {code}
      </SyntaxHighlighter>
      {output && (
        <div className="border-t border-[#e5e7eb] bg-white px-4 py-3">
          <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">Вывод</div>
          <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-[#111827]">{output}</pre>
        </div>
      )}
      {explanation && (
        <div className="border-t border-[#e5e7eb] bg-white px-4 py-3 text-[14px] leading-6 text-[#374151]">
          {explanation}
        </div>
      )}
    </div>
  )
}
