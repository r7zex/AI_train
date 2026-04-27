import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { toLatex } from '../lib/latex'

interface FormulaProps {
  math: string
  block?: boolean
  className?: string
}

export default function Formula({ math, block = false, className = '' }: FormulaProps) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(toLatex(math), ref.current, { displayMode: block, throwOnError: false, output: 'html' })
      } catch {
        if (ref.current) ref.current.textContent = math
      }
    }
  }, [math, block])
  return <span ref={ref} className={className} />
}
