import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ReadOnlyCodeCellProps {
  code: string
  language?: string
  label?: string
  compact?: boolean
  showCopy?: boolean
  showHeader?: boolean
  className?: string
}

interface CodeBlockProps {
  code: string
  language?: string
  output?: string
  outputLanguage?: string
  explanation?: string
}

export function ReadOnlyCodeCell({
  code,
  language = 'python',
  label = language,
  compact = false,
  showCopy = false,
  showHeader = true,
  className = '',
}: ReadOnlyCodeCellProps) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`overflow-hidden bg-[#f3f4f6] ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">{label}</span>
          {showCopy && (
            <button onClick={handleCopy} className="border border-[#d1d5db] bg-white px-2.5 py-1 text-[12px] text-[#374151] transition-colors hover:bg-[#f9fafb]">
              {copied ? 'Скопировано' : 'Копировать'}
            </button>
          )}
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: '#f3f4f6',
          fontSize: compact ? '0.88rem' : '0.92rem',
          lineHeight: compact ? '1.4' : '1.48',
          padding: compact ? '8px 14px' : showHeader ? '10px 14px 14px' : '10px 14px',
        }}
        codeTagProps={{ style: { fontFamily: 'Source Code Pro, Consolas, Menlo, monospace' } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default function CodeBlock({ code, language = 'python', output, outputLanguage = 'text', explanation }: CodeBlockProps) {
  return (
    <div className="my-3 overflow-hidden bg-[#f3f4f6]">
      <ReadOnlyCodeCell code={code} language={language} label={language} showCopy />
      {output && (
        <div className="border-t border-[#e5e7eb]">
          <ReadOnlyCodeCell code={output} language={outputLanguage} label="вывод" compact />
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
