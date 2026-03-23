import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { flowCourseBlocks, getFlowStepHref } from '../data/courseFlow'
import type { ProgressState } from '../hooks/useProgress'

function ProgressLine({ value }: { value: number }) {
  return (
    <div className="h-1 rounded-full bg-white/10">
      <div className="h-1 rounded-full bg-emerald-400 transition-all" style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
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

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 overflow-y-auto border-r border-white/8 bg-[#181818] text-white xl:w-72">
      {/* Course header */}
      <div className="border-b border-white/8 px-4 py-4">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Курс</div>
        <div className="mt-1 text-base font-bold leading-tight text-white">ML/DL Тренажёр</div>
        <p className="mt-1 text-xs leading-5 text-slate-400">Блок → Подблок → Тема</p>
      </div>

      <div className="py-3">
        {flowCourseBlocks.map((block) => {
          const isOpen = openBlocks[block.id]
          const blockProgress = getBlockProgress(block.id)
          const blockActive = activeLocation?.blockId === block.id

          return (
            <div key={block.id} className="mb-1">
              {/* Block header */}
              <button
                type="button"
                onClick={() => setUserOpenBlocks((prev) => ({ ...prev, [block.id]: !(openBlocks[block.id]) }))}
                className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left transition-colors ${blockActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="text-base">{block.icon}</span>
                  <div className="min-w-0">
                    <div className="truncate text-[11px] font-semibold leading-tight text-slate-200">{block.title}</div>
                    <div className="mt-0.5 text-[10px] text-slate-500">{Math.round(blockProgress * 100)}%</div>
                  </div>
                </div>
                <span className={`shrink-0 text-[11px] font-bold transition-transform ${isOpen ? '' : '-rotate-90'} text-slate-500`}>▾</span>
              </button>

              {blockActive && (
                <div className="mx-4 mb-1.5">
                  <ProgressLine value={blockProgress} />
                </div>
              )}

              {isOpen && (
                <div className="pb-1">
                  {block.subblocks.map((subblock) => {
                    const subOpen = openSubblocks[subblock.id]
                    const subProgress = getSubblockProgress(subblock.id)
                    const subActive = activeLocation?.subblockId === subblock.id

                    return (
                      <div key={subblock.id} className="mb-0.5">
                        {/* Subblock header */}
                        <button
                          type="button"
                          onClick={() => setUserOpenSubblocks((prev) => ({ ...prev, [subblock.id]: !(openSubblocks[subblock.id]) }))}
                          className={`flex w-full items-center justify-between gap-2 py-2 pl-10 pr-4 text-left transition-colors ${subActive ? 'text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[11px] font-medium leading-snug">
                              {block.order}.{subblock.order} {subblock.title}
                            </div>
                            {subActive && (
                              <div className="mt-1">
                                <ProgressLine value={subProgress} />
                              </div>
                            )}
                          </div>
                          <span className={`shrink-0 text-[10px] transition-transform ${subOpen ? '' : '-rotate-90'} text-slate-600`}>▾</span>
                        </button>

                        {subOpen && (
                          <div className="pb-1 pt-0.5">
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
                                  className={`flex items-center justify-between gap-2 py-1.5 pl-14 pr-4 transition-colors ${isActive ? 'bg-emerald-400/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                                >
                                  <div className="flex min-w-0 flex-1 items-center gap-2">
                                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isCompleted ? 'bg-emerald-400' : isInProgress ? 'bg-amber-400' : isActive ? 'bg-white' : 'bg-slate-600'}`} />
                                    <span className="truncate text-[11px] leading-snug">{topic.title}</span>
                                  </div>
                                  {isCompleted && <span className="shrink-0 text-[10px] text-emerald-400">✓</span>}
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
