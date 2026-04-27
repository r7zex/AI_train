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

function findCurrentBlock(activeTopicId?: string) {
  for (const block of flowCourseBlocks) {
    for (const subblock of block.subblocks) {
      if (subblock.themes.some((topic) => topic.id === activeTopicId)) return block.id
    }
  }
  return ''
}

export default function CourseSidebar({ activeTopicId, progress, getTopicProgress, getSubblockProgress, getBlockProgress }: CourseSidebarProps) {
  const totalSteps = flowCourseBlocks.reduce(
    (sum, block) => sum + block.subblocks.reduce((inner, subblock) => inner + subblock.themes.reduce((acc, topic) => acc + topic.steps.length, 0), 0),
    0,
  )
  const completedSteps = progress.completedSteps.length
  const currentBlock = findCurrentBlock(activeTopicId)

  return (
    <aside className="hidden h-[calc(100vh-96px)] w-[340px] shrink-0 overflow-y-auto border-r border-[#2e343c] bg-[#252b32] text-[#d9e1ea] lg:block">
      <div className="border-b border-[#343b44] px-5 py-4">
        <Link to="/topics" className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center bg-[#45b96a] text-[11px] font-bold text-[#0d2313]">AI</span>
          <div>
            <div className="text-[13px] font-semibold text-[#f0f4f8]">AI Train</div>
            <div className="mt-0.5 text-[11px] text-[#a6b1be]">Карта полного ML-курса</div>
          </div>
        </Link>
      </div>

      <div className="border-b border-[#343b44] px-5 py-4">
        <div className="flex items-center justify-between text-[11px] text-[#a6b1be]">
          <span>Прогресс курса</span>
          <span>{completedSteps}/{totalSteps}</span>
        </div>
        <div className="mt-2 h-1.5 w-full bg-[#1f242a]">
          <div className="h-1.5 bg-[#44bb66]" style={{ width: `${totalSteps === 0 ? 0 : (completedSteps / totalSteps) * 100}%` }} />
        </div>
      </div>

      <div className="py-2">
        {flowCourseBlocks.map((block) => {
          const blockProgress = Math.round(getBlockProgress(block.id) * 100)
          const expanded = block.id === currentBlock || getBlockProgress(block.id) > 0

          return (
            <section key={block.id} className="border-b border-[#303740] px-3 py-3">
              <div className="px-2 py-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[12px] font-semibold leading-5 text-[#e8eef5]">{block.order}. {block.title}</div>
                    <div className="mt-0.5 text-[10px] leading-4 text-[#92a0af]">{block.description}</div>
                  </div>
                  <span className="shrink-0 text-[10px] text-[#92a0af]">{blockProgress}%</span>
                </div>
                <div className="mt-2 h-1 bg-[#1f242a]">
                  <div className="h-1 bg-[#44bb66]" style={{ width: `${blockProgress}%` }} />
                </div>
              </div>

              {expanded && (
                <div className="mt-2 space-y-2">
                  {block.subblocks.map((subblock) => {
                    const subblockProgress = Math.round(getSubblockProgress(subblock.id) * 100)
                    return (
                      <div key={subblock.id}>
                        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7f8c9d]">
                          {subblock.title} · {subblockProgress}%
                        </div>
                        <div className="space-y-0.5">
                          {subblock.themes.map((topic) => {
                            const href = getFlowStepHref(topic.id, progress.lastVisitedStep[topic.id] ?? topic.steps[0].id)
                            const isActive = topic.id === activeTopicId
                            const topicProgress = Math.round(getTopicProgress(topic.id) * 100)

                            return (
                              <Link
                                key={topic.id}
                                to={href}
                                className={`grid grid-cols-[minmax(0,1fr),36px] gap-2 px-2 py-1.5 text-[11px] leading-4 transition ${
                                  isActive ? 'bg-[#45b96a] text-[#102012]' : 'text-[#c7d0db] hover:bg-[#2e3640] hover:text-white'
                                }`}
                              >
                                <span className="truncate">{topic.title}</span>
                                <span className={`text-right ${isActive ? 'text-[#17331d]' : 'text-[#8f9eae]'}`}>{topicProgress}%</span>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </aside>
  )
}
