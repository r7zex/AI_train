const SUBSCRIPT_MAP: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  'ₖ': 'k', 'ᵢ': 'i',
  'в‚Ђ': '0', 'в‚Ѓ': '1', 'в‚‚': '2', 'в‚ѓ': '3', 'в‚„': '4', 'в‚…': '5', 'в‚†': '6', 'в‚‡': '7', 'в‚€': '8', 'в‚‰': '9',
  'в‚–': 'k', 'бµў': 'i',
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

function wrapCyrillicText(value: string) {
  return value.replace(/[а-яА-ЯёЁ][а-яА-ЯёЁ\s-]*/gu, (match) => `\\text{${escapeLatexText(match.trim())}}`)
}

function applyCommonMathReplacements(value: string) {
  return value
    .replace(/ŷ|Е·/g, '\\hat{y}')
    .replace(/σ|Пѓ/g, '\\sigma')
    .replace(/μ|Ој/g, '\\mu')
    .replace(/η|О·/g, '\\eta')
    .replace(/θ|Оё/g, '\\theta')
    .replace(/λ|О»/g, '\\lambda')
    .replace(/α|О±/g, '\\alpha')
    .replace(/β|ОІ/g, '\\beta')
    .replace(/δ/g, '\\delta')
    .replace(/π|ПЂ/g, '\\pi')
    .replace(/Σ|ОЈ/g, '\\sum')
    .replace(/∇/g, '\\nabla ')
    .replace(/√|в€љ/g, '\\sqrt')
    .replace(/\u222a/g, ' \\cup ')
    .replace(/\u2229/g, ' \\cap ')
    .replace(/\u2205/g, ' \\varnothing ')
    .replace(/\u2248/g, ' \\approx ')
    .replace(/\u2264/g, ' \\leq ')
    .replace(/\u2265/g, ' \\geq ')
    .replace(/\u2260/g, ' \\neq ')
    .replace(/\u222b/g, ' \\int ')
    .replace(/\u00b7/g, ' \\cdot ')
    .replace(/\u2194/g, ' \\leftrightarrow ')
    .replace(/->/g, ' \\to ')
    .replace(/<=/g, ' \\leq ')
    .replace(/>=/g, ' \\geq ')
    .replace(/!=/g, ' \\neq ')
    .replace(/~=/g, ' \\approx ')
    .replace(/\bsoftmax\b/g, '\\operatorname{softmax}')
    .replace(/\blogits\b/g, '\\operatorname{logits}')
    .replace(/\bloss\b/g, '\\operatorname{loss}')
    .replace(/\bexp\b/g, '\\exp')
    .replace(/\bsqrt\b/g, '\\sqrt')
    .replace(/\bmean\b/g, '\\operatorname{mean}')
    .replace(/\bmedian\b/g, '\\operatorname{median}')
    .replace(/\bstd\b/g, '\\operatorname{std}')
    .replace(/\bmin\b/g, '\\min')
    .replace(/\bmax\b/g, '\\max')
    .replace(/\bIQR\b/g, '\\operatorname{IQR}')
    .replace(/\bTP\b/g, '\\operatorname{TP}')
    .replace(/\bFP\b/g, '\\operatorname{FP}')
    .replace(/\bFN\b/g, '\\operatorname{FN}')
    .replace(/\bTN\b/g, '\\operatorname{TN}')
    .replace(/\bCE\b/g, '\\operatorname{CE}')
    .replace(/\bPR\b/g, 'P R')
    .replace(/([A-Za-z\\}])([₀₁₂₃₄₅₆₇₈₉ₖᵢв‚Ђв‚Ѓв‚‚в‚ѓв‚„в‚…в‚†в‚‡в‚€в‚‰в‚–бµў]+)/g, (_, base, sub) => `${base}${toSubscript(sub)}`)
    .replace(/\^\(([^)]+)\)/g, '^{$1}')
}

export function looksLikeCodeFormula(value: string) {
  return /[:[\]]|\bdef\b|\bfor\b|\bif\b|\bprint\b|\binput\b|\.get\(|\.split\(|\.groupby\(|\.fillna\(|\(\)|=>/.test(value)
}

export function toLatex(value: string) {
  if (looksLikeCodeFormula(value)) {
    return `\\texttt{${escapeLatexText(value)}}`
  }

  return wrapCyrillicText(applyCommonMathReplacements(value))
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
