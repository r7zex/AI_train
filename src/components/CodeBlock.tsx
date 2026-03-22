import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

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
    <div className="rounded-xl overflow-hidden border border-gray-200 my-4 shadow-sm">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <span className="text-xs text-gray-400 font-mono uppercase">{language}</span>
        <button onClick={handleCopy} className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700">
          {copied ? '✓ Скопировано' : '📋 Копировать'}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.83rem', lineHeight: '1.5' }}>
        {code}
      </SyntaxHighlighter>
      {output && (
        <div className="bg-gray-900 border-t border-gray-700 px-4 py-3">
          <div className="text-xs text-green-400 font-mono mb-1">▶ Вывод:</div>
          <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap leading-relaxed">{output}</pre>
        </div>
      )}
      {explanation && (
        <div className="bg-blue-50 border-t border-blue-100 px-4 py-3 text-sm text-blue-800">
          💡 {explanation}
        </div>
      )}
    </div>
  )
}
