const richTokenPattern = /(`[^`]+`|\*\*[^*]+\*\*)/g

function InlineCode({ children }: { children: string }) {
  return (
    <code className="inline-block max-w-full overflow-x-auto whitespace-nowrap rounded bg-[#f0f2f4] px-1.5 py-0.5 align-bottom font-mono text-[0.9em] text-[#20252a]">
      {children}
    </code>
  )
}

function renderAutoCode(value: string, keyPrefix: string) {
  return <span key={keyPrefix}>{value}</span>
}

export default function RichText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(richTokenPattern).map((part, index) => {
        if (!part) return null
        if (part.startsWith('`') && part.endsWith('`')) {
          return <InlineCode key={`${part}-${index}`}>{part.slice(1, -1)}</InlineCode>
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={`${part}-${index}`}>{renderAutoCode(part.slice(2, -2), `strong-${index}`)}</strong>
        }
        return renderAutoCode(part, `text-${index}`)
      })}
    </span>
  )
}
