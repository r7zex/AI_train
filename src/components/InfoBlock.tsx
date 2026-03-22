interface InfoBlockProps {
  type: 'info' | 'warning' | 'tip' | 'error' | 'intuition' | 'note'
  title?: string
  children: React.ReactNode
}

const styles = {
  info:      { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-800',   icon: 'ℹ️' },
  warning:   { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: '⚠️' },
  tip:       { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  icon: '💡' },
  error:     { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    icon: '❌' },
  intuition: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', icon: '🔮' },
  note:      { bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-700',   icon: '📝' },
}

export default function InfoBlock({ type, title, children }: InfoBlockProps) {
  const s = styles[type]
  return (
    <div className={`${s.bg} ${s.border} border rounded-xl p-4 my-4`}>
      {title && <div className={`font-semibold ${s.text} mb-2`}>{s.icon} {title}</div>}
      <div className={`text-sm ${s.text} leading-relaxed`}>{children}</div>
    </div>
  )
}
