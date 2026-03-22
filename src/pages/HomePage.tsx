import { Link } from 'react-router-dom'
import { courseBlocks, totalCodeTasks, totalQuizQuestions, totalSteps } from '../data/course'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-6">
      <section className="grid gap-6 lg:grid-cols-[1.3fr,0.9fr]">
        <div className="rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#eef8ea] px-3 py-1 text-sm font-semibold text-[#2e7d32]">
            Полная пересборка под Stepik-поток
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#141414] lg:text-5xl">
            ML-тренажёр в более лёгком визуале: крупные блоки, подблоки, темы и пошаговое обучение.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5b5b5b]">
            Интерфейс перестроен не поверх старого, а как новый учебный поток: сначала блоки по хронологии изучения,
            потом подблоки, затем темы с теорией, ошибками, собеседованием, 5 квизами, 5 stdin→stdout практиками
            и шпаргалкой в конце каждой темы.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/topics" className="rounded-xl bg-[#69d05c] px-6 py-3 text-sm font-semibold text-[#101010] shadow-sm transition hover:brightness-95">
              Открыть структуру курса
            </Link>
            <Link to="/terms-functions" className="rounded-xl border border-black/10 bg-[#f8f8f6] px-6 py-3 text-sm font-semibold text-[#222] transition hover:bg-white">
              Термины, функции и формулы
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { label: 'Блоков', value: courseBlocks.length, note: 'в хронологии изучения' },
            { label: 'Шагов', value: totalSteps, note: 'theory → mistakes → interview → quiz → code → cheatsheet' },
            { label: 'Практик', value: `${totalQuizQuestions}Q / ${totalCodeTasks}C`, note: 'квизы и код на каждую тему' },
          ].map((card) => (
            <div key={card.label} className="rounded-[24px] border border-black/10 bg-[#1f1f1f] p-6 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
              <div className="text-sm text-white/60">{card.label}</div>
              <div className="mt-2 text-4xl font-bold text-[#8ae179]">{card.value}</div>
              <div className="mt-2 text-sm leading-6 text-white/70">{card.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-2 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#161616]">Хронология изучения</h2>
            <p className="mt-1 text-sm text-[#686868]">От Python к данным, затем к ML-моделям и финальной подготовке к собеседованию.</p>
          </div>
          <Link to="/topics" className="text-sm font-semibold text-[#2e7d32] hover:underline">
            Перейти ко всей программе →
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {courseBlocks.map((block) => (
            <article key={block.id} className="rounded-[24px] border border-black/10 bg-[#fafaf8] p-5 transition hover:bg-white hover:shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-[#2e7d32]">Блок {block.order}</div>
                  <h3 className="mt-1 text-xl font-bold text-[#191919]">{block.icon} {block.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#666]">{block.description}</p>
                </div>
                <div className="rounded-2xl bg-[#eef8ea] px-3 py-2 text-xs font-semibold text-[#2e7d32]">
                  {block.subblocks.reduce((sum, sub) => sum + sub.themes.length, 0)} тем
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {block.subblocks.map((subblock) => (
                  <div key={subblock.id} className="rounded-2xl border border-black/8 bg-white px-4 py-3">
                    <div className="text-sm font-semibold text-[#202020]">{block.order}.{subblock.order} {subblock.title}</div>
                    <div className="mt-1 text-sm text-[#707070]">{subblock.themes.map((theme) => theme.title).join(' • ')}</div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
