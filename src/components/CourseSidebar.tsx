import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { flowCourseBlocks, getFlowStepHref } from '../data/courseFlow'
import type { ProgressState } from '../hooks/useProgress'

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-[3px] w-full bg-white/10">
      <div className="h-[3px] bg-[#22c55e] transition-all" style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
    </div>
  )
}

interface CourseSidebarProps {
  activeTopicId?: string
  progress: ProgressState
  getTopicProgress: (topicId: string) => number
  getSubblockProgress: (subblockId: string) => number
  getBlockProgress: (blockId: string) => number
}

function findActiveLocation(activeTopicId?: string) {
  for (const block of flowCourseBlocks) {
    for (const subblock of block.subblocks) {
      if (subblock.themes.some((item) => item.id === activeTopicId)) {
        return { blockId: block.id, subblockId: subblock.id }
      }
    }
  }
  return null
}

export default function CourseSidebar({ activeTopicId, progress, getTopicProgress, getSubblockProgress, getBlockProgress }: CourseSidebarProps) {
  const activeLocation = findActiveLocation(activeTopicId)

  const [userOpenBlocks, setUserOpenBlocks] = useState<Record<string, boolean>>({})
  const [userOpenSubblocks, setUserOpenSubblocks] = useState<Record<string, boolean>>({})

  const openBlocks = useMemo(() => {
    const base: Record<string, boolean> = Object.fromEntries(
      flowCourseBlocks.map((block) => [block.id, userOpenBlocks[block.id] ?? false])
    )
    if (activeLocation) base[activeLocation.blockId] = true
    return base
  }, [activeLocation, userOpenBlocks])

  const openSubblocks = useMemo(() => {
    const base: Record<string, boolean> = Object.fromEntries(
      flowCourseBlocks.flatMap((block) =>
        block.subblocks.map((subblock) => [subblock.id, userOpenSubblocks[subblock.id] ?? false])
      )
    )
    if (activeLocation) base[activeLocation.subblockId] = true
    return base
  }, [activeLocation, userOpenSubblocks])

  const totalTopics = flowCourseBlocks.reduce((sum, b) => sum + b.subblocks.reduce((s, sb) => s + sb.themes.length, 0), 0)
  const doneTopics = progress.completedTopics.length

  return (
    <aside className="sticky top-0 h-screen w-[248px] shrink-0 overflow-y-auto bg-[#1e1e1e] text-white">
      <div className="border-b border-white/8 px-4 py-3">
        <div className="text-[11px] font-semibold text-[#22c55e]">ML.train</div>
        <div className="mt-0.5 text-[13px] font-semibold leading-tight text-white">ML/DL Тренажёр</div>
        <div className="mt-2">
          <ProgressBar value={totalTopics > 0 ? doneTopics / totalTopics : 0} />
        </div>
        <div className="mt-1 text-[10px] text-slate-500">{doneTopics} / {totalTopics} тем</div>
      </div>

      <div className="py-1">
        {flowCourseBlocks.map((block) => {
          const isOpen = openBlocks[block.id]
          const blockProgress = getBlockProgress(block.id)
          const blockActive = activeLocation?.blockId === block.id

          return (
            <div key={block.id}>
              <button
                type="button"
                onClick={() => setUserOpenBlocks((prev) => ({ ...prev, [block.id]: !openBlocks[block.id] }))}
                className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-left ${blockActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="shrink-0 text-[10px] text-slate-600">{block.order}.</span>
                  <span className="truncate text-[12px] font-semibold">{block.title}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">{Math.round(blockProgress * 100)}%</span>
                  <svg width="8" height="8" viewBox="0 0 8 8" className={`shrink-0 text-slate-500 transition-transform ${isOpen ? '' : '-rotate-90'}`}>
                    <path d="M1 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              </button>

              {blockActive && isOpen && (
                <div className="mx-4 mb-1">
                  <ProgressBar value={blockProgress} />
                </div>
              )}

              {isOpen && (
                <div>
                  {block.subblocks.map((subblock) => {
                    const subOpen = openSubblocks[subblock.id]
                    const subProgress = getSubblockProgress(subblock.id)
                    const subActive = activeLocation?.subblockId === subblock.id

                    return (
                      <div key={subblock.id}>
                        <button
                          type="button"
                          onClick={() => setUserOpenSubblocks((prev) => ({ ...prev, [subblock.id]: !openSubblocks[subblock.id] }))}
                          className={`flex w-full items-center justify-between gap-2 py-1.5 pl-9 pr-4 text-left ${subActive ? 'text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          <span className="min-w-0 flex-1 truncate text-[11px]">
                            {block.order}.{subblock.order} {subblock.title}
                          </span>
                          <div className="flex shrink-0 items-center gap-1.5">
                            {subActive && <span className="text-[10px] text-slate-500">{Math.round(subProgress * 100)}%</span>}
                            <svg width="8" height="8" viewBox="0 0 8 8" className={`shrink-0 text-slate-600 transition-transform ${subOpen ? '' : '-rotate-90'}`}>
                              <path d="M1 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                            </svg>
                          </div>
                        </button>

                        {subOpen && (
                          <div>
                            {subblock.themes.map((topic) => {
                              const topicProgress = getTopicProgress(topic.id)
                              const isCompleted = progress.completedTopics.includes(topic.id)
                              const isInProgress = topicProgress > 0 && topicProgress < 1
                              const isActive = topic.id === activeTopicId
                              const href = getFlowStepHref(topic.id, progress.lastVisitedStep[topic.id] ?? topic.steps[0].id)

                              return (
                                <Link
                                  key={topic.id}
                                  to={href}
                                  className={`flex items-center gap-2 py-1.5 pl-12 pr-4 text-[11px] transition-colors ${
                                    isActive
                                      ? 'border-l-2 border-[#22c55e] bg-[#22c55e]/10 text-white'
                                      : 'border-l-2 border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                  }`}
                                >
                                  <span className={`shrink-0 ${isCompleted ? 'text-[#22c55e]' : isInProgress ? 'text-amber-400' : 'text-slate-600'}`}>
                                    {isCompleted ? (
                                      <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                                    ) : (
                                      <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="currentColor" /></svg>
                                    )}
                                  </span>
                                  <span className="truncate leading-snug">{topic.title}</span>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
