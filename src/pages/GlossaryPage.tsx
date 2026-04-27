import { useMemo, useState } from 'react'
import { flowCourseBlocks } from '../data/courseFlow'

interface ReferenceSection {
  blockId: string
  blockTitle: string
  terms: string[]
  functions: string[]
  schemes: string[]
  notes: string[]
}

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)))
}

const referenceSections: ReferenceSection[] = flowCourseBlocks.map((block) => {
  const topics = block.subblocks.flatMap((subblock) => subblock.themes)
  const terms = uniqueItems(topics.flatMap((topic) => topic.terminology))
  const functions = uniqueItems(terms.filter((term) => term.includes('np.') || term.includes('rng.') || term.includes('shape') || term.includes('dtype') || term.includes('ndim') || term.includes('axis')))
  const schemes = uniqueItems(topics.flatMap((topic) => topic.formulas))
  const notes = uniqueItems(topics.flatMap((topic) => topic.themeCheatsheet))

  return {
    blockId: block.id,
    blockTitle: block.title,
    terms,
    functions,
    schemes,
    notes,
  }
})

export function TermsAndFunctionsPage() {
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLowerCase()

  const filteredSections = useMemo(() => {
    if (!normalized) return referenceSections

    return referenceSections
      .map((section) => ({
        ...section,
        terms: section.terms.filter((item) => item.toLowerCase().includes(normalized)),
        functions: section.functions.filter((item) => item.toLowerCase().includes(normalized)),
        schemes: section.schemes.filter((item) => item.toLowerCase().includes(normalized)),
        notes: section.notes.filter((item) => item.toLowerCase().includes(normalized)),
      }))
      .filter((section) => section.terms.length || section.functions.length || section.schemes.length || section.notes.length)
  }, [normalized])

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-6">
      <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
        <div className="max-w-4xl">
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2e7d32]">Справочник</div>
          <h1 className="mt-3 text-3xl font-bold text-[#111] lg:text-4xl">Термины, функции NumPy и опорные схемы по блокам</h1>
          <p className="mt-3 text-base leading-7 text-[#666]">
            Здесь собраны сущности из текущей учебной траектории: первые два блока курса, ключевые термины, функции NumPy,
            схемы и короткие правила для повторения перед практикой.
          </p>
        </div>

        <div className="mt-6">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по термину, функции или формуле..."
            className="w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-4 text-sm outline-none transition focus:border-[#69d05c]"
          />
        </div>
      </section>

      <div className="mt-8 space-y-6">
        {filteredSections.map((section) => (
          <section key={section.blockId} className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            <h2 className="text-2xl font-bold text-[#111]">{section.blockTitle}</h2>
            <div className="mt-5 grid gap-5 xl:grid-cols-2">
              {[
                { title: 'Термины', items: section.terms },
                { title: 'Функции и методы', items: section.functions },
                { title: 'Схемы и записи', items: section.schemes },
                { title: 'Короткие правила', items: section.notes },
              ].map((group) => (
                <article key={group.title} className="rounded-[24px] border border-black/10 bg-[#fafaf8] p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2e7d32]">{group.title}</div>
                  <div className="mt-4 space-y-3">
                    {group.items.length > 0 ? group.items.map((item) => (
                      <div key={item} className="rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm leading-7 text-[#2b2b2b]">
                        {item}
                      </div>
                    )) : (
                      <div className="rounded-2xl border border-dashed border-black/10 px-4 py-3 text-sm text-[#888]">В этом блоке нет элементов этой категории.</div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default TermsAndFunctionsPage
