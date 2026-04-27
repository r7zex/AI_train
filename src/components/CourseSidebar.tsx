import { Link } from 'react-router-dom'
import { flowCourseBlocks, getFlowStepHref } from '../data/courseFlow'
import type { ProgressState } from '../hooks/useProgress'

interface CourseSidebarProps {
  activeTopicId?: string
  progress: ProgressState
  getTopicProgress: (topicId: string) => number
  getSubblockProgress: (subblockId: string) => number
  getBlockProgress: (blockId: string) => number
}

function firstTopicHref(themes: Array<{ id: string; steps: Array<{ id: string }> }>, progress: ProgressState) {
  const topic = themes[0]
  if (!topic) return '/topics'
  return getFlowStepHref(topic.id, progress.lastVisitedStep[topic.id] ?? topic.steps[0].id)
}

function topicNumber(title: string) {
  return title.match(/^\d+(\.\d+)?/)?.[0] ?? ''
}

function topicLabel(title: string) {
  return title.replace(/^\d+(\.\d+)?\s+/, '')
}

export default function CourseSidebar({ activeTopicId, progress, getTopicProgress }: CourseSidebarProps) {
  const totalSteps = flowCourseBlocks.reduce(
    (sum, block) => sum + block.subblocks.reduce((inner, subblock) => inner + subblock.themes.reduce((acc, topic) => acc + topic.steps.length, 0), 0),
    0,
  )
  const completedSteps = progress.completedSteps.length

  return (
    <aside className="sticky top-[48px] hidden h-[calc(100vh-48px)] w-[232px] shrink-0 self-start overflow-y-auto bg-[#202020] text-white lg:block">
      <div className="px-3 pb-5 pt-5">
        <div className="text-[14px] font-bold leading-5 text-white">AI Train для тех, кто учит ML</div>
        <div className="mt-1 text-[13px] font-semibold leading-5 text-white">Прогресс по курсу: {completedSteps}/{totalSteps}</div>
        <div className="mt-2 flex items-center gap-1">
          <div className="h-1 w-full bg-[#444]">
            <div className="h-1 bg-[#65d36f]" style={{ width: `${totalSteps === 0 ? 0 : (completedSteps / totalSteps) * 100}%` }} />
          </div>
          <span className="h-1 w-1 rounded-full bg-[#65d36f]" />
          <span className="h-1 w-1 rounded-full bg-[#65d36f]" />
        </div>
      </div>

      <nav className="pb-8 text-[13px] leading-5">
        {flowCourseBlocks.map((block) => {
          const blockThemes = block.subblocks.flatMap((subblock) => subblock.themes)

          return (
            <section key={block.id} className="relative border-l-4 border-[#65d36f]">
              <Link
                to={firstTopicHref(blockThemes, progress)}
                className="block px-2 py-3 text-[14px] font-bold text-white hover:bg-[#2a2a2a]"
              >
                {block.order} {block.title}
              </Link>

              <div className="pb-2">
                {blockThemes.map((topic) => {
                  const isActive = topic.id === activeTopicId
                  const href = getFlowStepHref(topic.id, progress.lastVisitedStep[topic.id] ?? topic.steps[0].id)
                  const progressPct = Math.round(getTopicProgress(topic.id) * 100)

                  return (
                    <Link
                      key={topic.id}
                      to={href}
                      title={`${topic.title} · ${progressPct}%`}
                      className={`relative grid grid-cols-[32px,minmax(0,1fr)] items-center gap-1 px-2 py-2 text-[13px] font-semibold ${
                        isActive ? 'bg-[#3f7e42] text-white' : 'text-white hover:bg-[#2b2b2b]'
                      }`}
                    >
                      <span className="text-right text-[13px]">{topicNumber(topic.title)}</span>
                      <span className="truncate">{topicLabel(topic.title)}</span>
                      {isActive && <span className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[10px] border-r-[10px] border-y-transparent border-r-white" />}
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </nav>
    </aside>
  )
}
