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
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <div className="my-4 overflow-hidden border border-[#d9dee7] bg-white shadow-[0_10px_24px_-22px_rgba(22,33,48,0.55)]">
      <div className="flex items-center justify-between border-b border-[#e1e6ed] bg-[#f7f8fa] px-4 py-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#536173]">{language}</span>
        <button onClick={handleCopy} className="border border-[#d7dde6] bg-white px-2.5 py-1 text-[12px] text-[#455366] transition-colors hover:border-[#9fb1c4] hover:bg-[#eef3f8]">
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: '#f4f6f8',
          fontSize: '0.86rem',
          lineHeight: '1.62',
          padding: '18px 20px',
        }}
        codeTagProps={{ style: { fontFamily: 'Source Code Pro, Consolas, Menlo, monospace' } }}
      >
        {code}
      </SyntaxHighlighter>
      {output && (
        <div className="border-t border-[#dfe6ee] bg-[#111820] px-4 py-3">
          <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7ee29a]">Вывод</div>
          <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-[#eef7ff]">{output}</pre>
        </div>
      )}
      {explanation && (
        <div className="border-t border-[#e3eaf2] bg-[#f8fbff] px-4 py-3 text-[13px] leading-6 text-[#38506d]">
          {explanation}
        </div>
      )}
    </div>
  )
}
