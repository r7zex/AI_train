const SUBSCRIPT_MAP: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  'ₖ': 'k', 'ᵢ': 'i',
}

function escapeLatexText(value: string) {
  return value
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([#$%&_{}])/g, '\\$1')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/~/g, '\\textasciitilde{}')
}

function toSubscript(match: string) {
  const converted = match.split('').map((char) => SUBSCRIPT_MAP[char] ?? char).join('')
  return `_{${converted}}`
}

function applyCommonMathReplacements(value: string) {
  return value
    .replace(/ŷ/g, '\\hat{y}')
    .replace(/σ/g, '\\sigma')
    .replace(/μ/g, '\\mu')
    .replace(/η/g, '\\eta')
    .replace(/Σ/g, '\\sum')
    .replace(/√\s*([A-Za-z0-9_{}()]+)/g, '\\sqrt{$1}')
    .replace(/·/g, ' \\cdot ')
    .replace(/↔/g, ' \\leftrightarrow ')
    .replace(/<=/g, ' \\leq ')
    .replace(/>=/g, ' \\geq ')
    .replace(/!=/g, ' \\neq ')
    .replace(/~=/g, ' \\approx ')
    .replace(/\bmin\b/g, '\\min')
    .replace(/\bmax\b/g, '\\max')
    .replace(/([A-Za-z\\}])([₀₁₂₃₄₅₆₇₈₉ₖᵢ]+)/g, (_, base, sub) => `${base}${toSubscript(sub)}`)
    .replace(/\^\(([^)]+)\)/g, '^{$1}')
}

export function looksLikeCodeFormula(value: string) {
  return /[:[\]{}]|\bdef\b|\bfor\b|\bif\b|\bprint\b|\binput\b|\.get\(|\.split\(|\.groupby\(|\.fillna\(|\(\)|=>/.test(value)
}

export function toLatex(value: string) {
  if (looksLikeCodeFormula(value)) {
    return `\\texttt{${escapeLatexText(value)}}`
  }

  const normalized = applyCommonMathReplacements(value)
    .replace(/\bTP\b/g, '\\mathrm{TP}')
    .replace(/\bFP\b/g, '\\mathrm{FP}')
    .replace(/\bFN\b/g, '\\mathrm{FN}')
    .replace(/\bPR\b/g, 'P R')

  return normalized
}

export function parseCheatsheetItem(item: string) {
  if (item.startsWith('Формула: ')) {
    const content = item.replace('Формула: ', '')
    return { kind: 'Формула', content, latex: toLatex(content), isLatex: true }
  }

  if (item.startsWith('Термин: ')) {
    const content = item.replace('Термин: ', '')
    return { kind: 'Термин', content, latex: toLatex(content), isLatex: /[=Σσμ√/]/.test(content) || looksLikeCodeFormula(content) }
  }

  if (item.startsWith('Опора: ')) {
    const content = item.replace('Опора: ', '')
    return { kind: 'Опора', content, latex: `\\text{${escapeLatexText(content)}}`, isLatex: false }
  }

  return { kind: 'Конспект', content: item, latex: `\\text{${escapeLatexText(item)}}`, isLatex: false }
}
