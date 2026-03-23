import { useMemo, useState } from 'react'
import { yandexHandbookChapters, yandexHandbookStats, type HandbookArticle } from '../data/yandexHandbookTheory'

type LessonStep = 'theory' | 'ideas' | 'control' | 'practice' | 'recap'

const lessonSteps: Array<{ id: LessonStep; label: string }> = [
  { id: 'theory', label: 'Теория' },
  { id: 'ideas', label: 'Ключевые идеи' },
  { id: 'control', label: 'Контроль' },
  { id: 'practice', label: 'Практика' },
  { id: 'recap', label: 'Конспект' },
]

const chapterMethodFocus: Record<number, string> = {
  1: 'понять язык предмета и общую постановку ML-задач',
  2: 'сопоставлять классические алгоритмы и их ограничения',
  3: 'корректно выбирать метрики и схему валидации',
  4: 'работать с вероятностной формулировкой моделей',
  5: 'понимать базовую механику обучения нейросетей',
  6: 'разбираться, почему архитектура определяет поведение модели',
  7: 'применять DL-подходы в инженерной постановке',
  8: 'понимать различия генеративных семейств',
  9: 'моделировать пользовательские предпочтения и ранжирование',
  10: 'подбирать подход к практическим форматам данных',
  11: 'разбираться в постановках, где агент влияет на данные',
  12: 'укрепить фундаментальные теоретические гарантии',
  13: 'связывать практику deep learning с теорией обобщения',
  14: 'осознанно выбирать метод оптимизации',
  15: 'работать с онлайн-режимом и стохастическими алгоритмами',
  16: 'владеть математическим минимумом для ML-литературы',
}

const chapterUseCases: Record<number, string> = {
  1: 'первичная постановка задачи, требования к данным и критерии успеха',
  2: 'табличные данные, baseline-модели и интерпретируемые решения',
  3: 'оценка качества на несбалансированных классах и при ограниченном датасете',
  4: 'калибровка вероятностей, байесовские оценки и неопределённость',
  5: 'проектирование и отладка полносвязных сетей',
  6: 'компьютерное зрение, последовательности, графы и мультимодальные задачи',
  7: 'self-supervised и transfer-сценарии в промышленной разработке',
  8: 'генерация изображений, текста и латентных представлений',
  9: 'персонализация, ранжирование и дизайн рекомендательного продукта',
  10: 'кластеризация, временные ряды, прогнозирование и ranking',
  11: 'обучение с подкреплением и сбор разметки через краудсорсинг',
  12: 'анализ ошибок обобщения и диагностирование high-variance режимов',
  13: 'теоретический анализ поведения глубоких моделей',
  14: 'устойчивое и быстрое обучение моделей в production-контурах',
  15: 'потоковые данные и непрерывное обновление модели',
  16: 'чтение формул, вывод градиентов и вероятностное моделирование',
}

function flattenArticles() {
  return yandexHandbookChapters.flatMap((chapter) => chapter.articles)
}

function buildTheory(article: HandbookArticle) {
  const focus = chapterMethodFocus[article.chapterNumber] ?? 'структурное понимание темы'
  const useCase = chapterUseCases[article.chapterNumber] ?? 'прикладные ML-задачи'
  const sections = article.keySections.slice(0, 4)

  return [
    {
      title: 'Зачем эта тема',
      paragraphs: [
        `Тема «${article.title}» относится к разделу «${article.chapterTitle}» и в учебном треке нужна, чтобы ${focus}.`,
        `На практике этот материал напрямую используется, когда нужно принимать инженерные решения в контексте: ${useCase}.`,
      ],
    },
    {
      title: 'Как читать и разбирать',
      paragraphs: [
        `Сначала выдели формальную постановку задачи, затем выпиши допущения модели, после этого проверь, как меняются выводы при нарушении этих допущений.`,
        `Хороший рабочий ритм: определение → интуиция → формула/алгоритм → граничные случаи → практическая интерпретация метрик.`,
      ],
      bullets: sections.map((section) => `Фокусный блок статьи: ${section}.`),
    },
    {
      title: 'Инженерная интерпретация',
      paragraphs: [
        `Для собеседования и реальной разработки важно не просто повторить определение, а уметь объяснить, как выбор метода влияет на качество, скорость и устойчивость решения.`,
        `Если в теме есть несколько подходов, сравнивай их через компромиссы: интерпретируемость, вычислительная цена, чувствительность к данным и переносимость на новые выборки.`,
      ],
    },
  ]
}

function buildControlQuestions(article: HandbookArticle) {
  const sectionPrompts = article.keySections.slice(0, 3).map((section) => `Какова роль блока «${section}» в общей логике темы?`)

  return [
    `Сформулируй задачу, которую решает тема «${article.title}», в терминах входа, выхода и целевой функции.`,
    `Какие ключевые допущения используются в этой теме и что произойдет, если они нарушаются?`,
    `Какие ошибки чаще всего допускают при практическом применении этой темы?`,
    ...sectionPrompts,
  ]
}

function buildPracticePrompts(article: HandbookArticle) {
  return [
    `Собери минимальный пример по теме «${article.title}»: данные, baseline, метрика, интерпретация результата.`,
    'Сравни два варианта решения и объясни, при каких ограничениях выбирается каждый из них.',
    'Подготовь 3 edge-case сценария, на которых поведение метода может деградировать.',
  ]
}

function buildRecap(article: HandbookArticle) {
  const sectionShort = article.keySections.slice(0, 4).map((section) => `Разобрать: ${section}`)

  return [
    `После темы «${article.title}» ты должен уверенно объяснять её базовую постановку и ограничения.`,
    `Следующий шаг: перенести теорию в кодовый эксперимент и проверить устойчивость вывода на альтернативных данных.`,
    ...sectionShort,
  ]
}

export default function YandexTheoryPage() {
  const allArticles = useMemo(() => flattenArticles(), [])
  const [selectedSlug, setSelectedSlug] = useState(() => allArticles[0]?.slug ?? '')
  const [currentStep, setCurrentStep] = useState<LessonStep>('theory')
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()

  const filteredChapters = useMemo(() => {
    if (!normalizedQuery) return yandexHandbookChapters

    return yandexHandbookChapters
      .map((chapter) => ({
        ...chapter,
        articles: chapter.articles.filter((article) => {
          const text = [article.articleNumber, article.title, article.chapterTitle, ...article.keySections].join(' ').toLowerCase()
          return text.includes(normalizedQuery)
        }),
      }))
      .filter((chapter) => chapter.articles.length > 0)
  }, [normalizedQuery])

  const visibleArticles = useMemo(
    () => filteredChapters.reduce((acc, chapter) => acc + chapter.articles.length, 0),
    [filteredChapters],
  )

  const selectedArticle = useMemo(() => {
    const fromFiltered = filteredChapters.flatMap((chapter) => chapter.articles).find((article) => article.slug === selectedSlug)
    if (fromFiltered) return fromFiltered
    return filteredChapters.flatMap((chapter) => chapter.articles)[0] ?? null
  }, [filteredChapters, selectedSlug])

  if (!selectedArticle) {
    return (
      <div className="mx-auto max-w-[1320px] px-4 py-6 lg:px-6">
        <section className="border border-[#d9dee4] bg-white px-5 py-6 text-[14px] text-[#445264]">
          По текущему фильтру статьи не найдены.
        </section>
      </div>
    )
  }

  const theoryBlocks = buildTheory(selectedArticle)
  const controlQuestions = buildControlQuestions(selectedArticle)
  const practicePrompts = buildPracticePrompts(selectedArticle)
  const recapItems = buildRecap(selectedArticle)

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[360px,minmax(0,1fr)]">
        <aside className="h-[calc(100vh-7.5rem)] overflow-auto border border-[#d9dee4] bg-white">
          <header className="sticky top-0 z-10 border-b border-[#e2e6eb] bg-white px-4 py-4">
            <h1 className="text-[16px] font-semibold text-[#1e2329]">Yandex Handbook × Stepik Flow</h1>
            <p className="mt-1 text-[12px] leading-5 text-[#667381]">
              16 глав • 72 темы • теория в формате пошагового урока.
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="border border-[#e3e8ee] bg-[#f8fafc] px-2 py-1.5">
                <div className="text-[10px] text-[#6f7c8b]">Глав</div>
                <div className="text-[14px] font-semibold text-[#1f2833]">{yandexHandbookStats.totalChapters}</div>
              </div>
              <div className="border border-[#e3e8ee] bg-[#f8fafc] px-2 py-1.5">
                <div className="text-[10px] text-[#6f7c8b]">Тем</div>
                <div className="text-[14px] font-semibold text-[#1f2833]">{yandexHandbookStats.totalArticles}</div>
              </div>
              <div className="border border-[#e3e8ee] bg-[#f8fafc] px-2 py-1.5">
                <div className="text-[10px] text-[#6f7c8b]">Заданий</div>
                <div className="text-[14px] font-semibold text-[#1f2833]">{yandexHandbookStats.totalAssignments}</div>
              </div>
            </div>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по темам"
              className="mt-3 w-full border border-[#cfd6df] px-3 py-2 text-[13px] text-[#1f2833] outline-none transition focus:border-[#5f8ecb]"
            />
            <div className="mt-1 text-[11px] text-[#788493]">Найдено тем: {visibleArticles}</div>
          </header>

          <div className="divide-y divide-[#edf1f5]">
            {filteredChapters.map((chapter) => (
              <section key={chapter.chapterNumber} className="px-4 py-3">
                <h2 className="text-[13px] font-semibold text-[#1f2833]">{chapter.chapterTitle}</h2>
                <p className="mt-1 text-[11px] leading-5 text-[#687585]">Цель главы: {chapter.chapterGoal}.</p>

                <div className="mt-2 space-y-1">
                  {chapter.articles.map((article) => {
                    const active = article.slug === selectedArticle.slug
                    return (
                      <button
                        key={article.slug}
                        type="button"
                        onClick={() => {
                          setSelectedSlug(article.slug)
                          setCurrentStep('theory')
                        }}
                        className={`w-full border px-2 py-2 text-left text-[12px] transition ${
                          active
                            ? 'border-[#9cc4f1] bg-[#eef5fe] text-[#1e4f89]'
                            : 'border-[#e2e7ed] bg-white text-[#2f3c4a] hover:bg-[#f7f9fb]'
                        }`}
                      >
                        <div className="font-medium">{article.articleNumber} {article.title}</div>
                        {article.hasAssignment && <div className="mt-0.5 text-[10px] text-[#2f6b2d]">Есть задание</div>}
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <main className="min-w-0 border border-[#d9dee4] bg-white">
          <header className="border-b border-[#e2e6eb] px-5 py-4">
            <div className="text-[12px] text-[#6d7a89]">{selectedArticle.chapterTitle}</div>
            <h2 className="mt-1 text-[24px] font-semibold leading-8 text-[#1f252d]">
              {selectedArticle.articleNumber} {selectedArticle.title}
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-[#4c5a69]">
              Глава ориентирована на то, чтобы {selectedArticle.chapterGoal}. Ниже материал собран как lesson-flow: теория,
              контроль, практика и итоговый конспект.
            </p>
            <div className="mt-3 text-[12px]">
              Оригинал статьи:{' '}
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#2b6cb0] underline underline-offset-2 hover:text-[#1e4e84]"
              >
                открыть на education.yandex.ru
              </a>
            </div>
          </header>

          <div className="border-b border-[#e2e6eb] px-5 py-3">
            <div className="flex flex-wrap gap-2">
              {lessonSteps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`border px-3 py-1.5 text-[12px] font-medium transition ${
                    currentStep === step.id
                      ? 'border-[#8cb8eb] bg-[#ecf4ff] text-[#1e4f89]'
                      : 'border-[#d8e0e9] bg-white text-[#3f4d5c] hover:bg-[#f7f9fb]'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          <section className="px-5 py-5">
            {currentStep === 'theory' && (
              <div className="space-y-6">
                {theoryBlocks.map((block) => (
                  <article key={block.title}>
                    <h3 className="text-[17px] font-semibold text-[#1f2833]">{block.title}</h3>
                    <div className="mt-2 space-y-3">
                      {block.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-[14px] leading-7 text-[#2f3b48]">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {block.bullets && (
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] leading-7 text-[#2f3b48]">
                        {block.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            )}

            {currentStep === 'ideas' && (
              <div className="space-y-5">
                <article>
                  <h3 className="text-[17px] font-semibold text-[#1f2833]">Опорные блоки темы</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedArticle.keySections.map((section) => (
                      <span key={section} className="border border-[#d6dee7] bg-[#f9fbfd] px-2 py-1 text-[12px] text-[#445264]">
                        {section}
                      </span>
                    ))}
                  </div>
                </article>

                <article className="border border-[#e2e7ed] bg-[#fbfcfd] px-4 py-3">
                  <h4 className="text-[14px] font-semibold text-[#1f2833]">Как фиксировать понимание</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] leading-6 text-[#334252]">
                    <li>Запиши формальную постановку и минимальный набор предпосылок.</li>
                    <li>Сравни метод с ближайшей альтернативой по сильным/слабым сторонам.</li>
                    <li>Проверь, какие метрики реально отражают качество на твоем типе данных.</li>
                    <li>Сформулируй два типичных failure-case и способы их диагностики.</li>
                  </ul>
                </article>
              </div>
            )}

            {currentStep === 'control' && (
              <div className="space-y-3">
                <h3 className="text-[17px] font-semibold text-[#1f2833]">Контрольные вопросы</h3>
                <ol className="space-y-2 text-[14px] leading-7 text-[#2f3b48]">
                  {controlQuestions.map((question, index) => (
                    <li key={question} className="border border-[#e1e7ee] bg-[#fbfcfd] px-3 py-2">
                      <span className="mr-2 font-semibold text-[#1f4f88]">{index + 1}.</span>
                      {question}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {currentStep === 'practice' && (
              <div className="space-y-5">
                {selectedArticle.assignments.length > 0 && (
                  <article className="border border-[#d9e7cf] bg-[#f3faee] px-4 py-3">
                    <h3 className="text-[15px] font-semibold text-[#32562c]">Внешнее задание</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedArticle.assignments.map((assignment) => (
                        <a
                          key={assignment.url}
                          href={assignment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-[#b7d6a8] bg-white px-3 py-1.5 text-[12px] text-[#2f5c2a] hover:bg-[#edf7e7]"
                        >
                          {assignment.title}
                        </a>
                      ))}
                    </div>
                  </article>
                )}

                <article>
                  <h3 className="text-[17px] font-semibold text-[#1f2833]">Практика в стиле Stepik</h3>
                  <ol className="mt-2 space-y-2 text-[14px] leading-7 text-[#2f3b48]">
                    {practicePrompts.map((prompt, index) => (
                      <li key={prompt} className="border border-[#e1e7ee] bg-[#fbfcfd] px-3 py-2">
                        <span className="mr-2 font-semibold text-[#1f4f88]">Шаг {index + 1}.</span>
                        {prompt}
                      </li>
                    ))}
                  </ol>
                </article>
              </div>
            )}

            {currentStep === 'recap' && (
              <div className="space-y-3">
                <h3 className="text-[17px] font-semibold text-[#1f2833]">Итоговый конспект</h3>
                <ul className="list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#2f3b48]">
                  {recapItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
