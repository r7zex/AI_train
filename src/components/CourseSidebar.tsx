import { Link } from 'react-router-dom'
import { flowCourseBlocks, getFlowStepHref } from '../data/courseFlow'
import type { ProgressState } from '../hooks/useProgress'

interface CourseSidebarProps {
  activeTopicId?: string
  progress: ProgressState
  getTopicProgress: (topicId: string) => number
  getSubblockProgress: (subblockId: string) => number
  getBlockProgress: (blockId: string) => number
  onNavigate?: () => void
}

function firstTopicHref(themes: Array<{ id: string; steps: Array<{ id: string }> }>) {
  const topic = themes[0]
  if (!topic) return '/topics'
  return getFlowStepHref(topic.id, topic.steps[0].id)
}

function topicNumber(title: string) {
  return title.match(/^\d+(\.\d+)?/)?.[0] ?? ''
}

function topicLabel(title: string) {
  return title.replace(/^\d+(\.\d+)?\s+/, '')
}

export default function CourseSidebar({
  activeTopicId,
  progress,
  getTopicProgress,
  getBlockProgress,
  onNavigate,
}: CourseSidebarProps) {
  const totalSteps = flowCourseBlocks.reduce(
    (sum, block) => sum + block.subblocks.reduce((inner, subblock) => inner + subblock.themes.reduce((acc, topic) => acc + topic.steps.length, 0), 0),
    0,
  )
  const completedSteps = progress.completedSteps.length
  const coursePercent = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0

  return (
    <aside className="stepik-sidebar sticky top-[52px] hidden h-[calc(100vh-52px)] w-[286px] shrink-0 self-start overflow-y-auto bg-[#242424] text-white lg:block">
      <div className="border-b border-white/10 px-4 pb-4 pt-5">
        <Link to="/topics" onClick={onNavigate} className="block text-[14px] font-semibold leading-5 text-white hover:text-[#77cf6d]">
          Машинное обучение с нуля
        </Link>
        <div className="mt-3 flex items-center justify-between text-[12px] text-[#bdbdbd]">
          <span>{completedSteps} из {totalSteps} шагов</span>
          <span>{coursePercent}%</span>
        </div>
        <div className="mt-2 h-[5px] overflow-hidden bg-[#4b4b4b]">
          <div className="h-full bg-[#69be62] transition-[width]" style={{ width: `${coursePercent}%` }} />
        </div>
      </div>

      <nav aria-label="Содержание курса" className="pb-10 text-[13px]">
        {flowCourseBlocks.map((block) => {
          const blockThemes = block.subblocks.flatMap((subblock) => subblock.themes)
          const blockPercent = Math.round(getBlockProgress(block.id) * 100)

          return (
            <section key={block.id} className="border-b border-white/[0.07]">
              <Link
                to={firstTopicHref(blockThemes)}
                onClick={onNavigate}
                className="flex items-start gap-2 px-4 pb-2 pt-4 font-semibold leading-5 text-white hover:bg-white/[0.04]"
              >
                <span className="mt-[1px] text-[#8fd487]">{block.order}</span>
                <span className="min-w-0 flex-1">{block.title}</span>
                <span className="text-[10px] font-normal text-[#929292]">{blockPercent}%</span>
              </Link>

              <div className="pb-2">
                {blockThemes.map((topic) => {
                  const isActive = topic.id === activeTopicId
                  const href = getFlowStepHref(topic.id, topic.steps[0].id)
                  const progressPct = Math.round(getTopicProgress(topic.id) * 100)
                  const isDone = progressPct === 100

                  return (
                    <Link
                      key={topic.id}
                      to={href}
                      onClick={onNavigate}
                      title={`${topic.title} · ${progressPct}%`}
                      className={`group relative grid grid-cols-[28px,minmax(0,1fr),18px] items-start gap-2 px-4 py-[7px] leading-[18px] transition-colors ${
                        isActive ? 'bg-[#3f7f3e] text-white' : 'text-[#d8d8d8] hover:bg-[#303030] hover:text-white'
                      }`}
                    >
                      <span className="text-right text-[11px] text-[#9f9f9f] group-hover:text-[#cfcfcf]">{topicNumber(topic.title)}</span>
                      <span className="line-clamp-2">{topicLabel(topic.title)}</span>
                      <span className={`mt-[2px] inline-flex h-[14px] w-[14px] items-center justify-center rounded-full border text-[9px] ${isDone ? 'border-[#83d67a] bg-[#69be62] text-[#153617]' : 'border-[#666] text-transparent'}`}>
                        ✓
                      </span>
                      {isActive && <span className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-r-[9px] border-y-transparent border-r-white" />}
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
