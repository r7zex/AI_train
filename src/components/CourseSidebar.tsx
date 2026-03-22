import { useState } from 'react'
import { Link } from 'react-router-dom'
import { flowCourseBlocks, getFlowStepHref } from '../data/courseFlow'
import type { ProgressState } from '../hooks/useProgress'

function ProgressLine({ value }: { value: number }) {
  return (
    <div className="h-1.5 rounded-full bg-white/10">
      <div className="h-1.5 rounded-full bg-emerald-400 transition-all" style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
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

export default function CourseSidebar({ activeTopicId, progress, getTopicProgress, getSubblockProgress, getBlockProgress }: CourseSidebarProps) {
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>(() => Object.fromEntries(flowCourseBlocks.map((block) => [block.id, true])))
  const [openSubblocks, setOpenSubblocks] = useState<Record<string, boolean>>(() => Object.fromEntries(flowCourseBlocks.flatMap((block) => block.subblocks.map((subblock) => [subblock.id, true]))))

  let activeLocation: { blockId: string; subblockId: string } | null = null
  for (const block of flowCourseBlocks) {
    for (const subblock of block.subblocks) {
      const topic = subblock.themes.find((item) => item.id === activeTopicId)
      if (topic) {
        activeLocation = { blockId: block.id, subblockId: subblock.id }
        break
      }
    }
    if (activeLocation) break
  }

  return (
    <aside className="h-screen w-[320px] shrink-0 overflow-y-auto border-r border-white/10 bg-[#181818] text-white">
      <div className="space-y-6 px-4 py-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.24em] text-emerald-300">Course</div>
          <div className="mt-2 text-xl font-semibold">ML/DL trainer</div>
          <p className="mt-2 text-sm leading-6 text-slate-300">Слева только структура курса: блок → подблок → тема. Навигация по шагам вынесена наверх урока квадратиками.</p>
        </div>

        {flowCourseBlocks.map((block) => {
          const isOpen = openBlocks[block.id]
          const blockProgress = getBlockProgress(block.id)
          const blockActive = activeLocation?.blockId === block.id

          return (
            <div key={block.id} className="space-y-3">
              <button
                type="button"
                onClick={() => setOpenBlocks((prev) => ({ ...prev, [block.id]: !prev[block.id] }))}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${blockActive ? 'bg-emerald-500/15 text-white' : 'bg-white/5 text-slate-100 hover:bg-white/10'}`}
              >
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Блок {block.order}</div>
                  <div className="mt-1 text-sm font-semibold">{block.icon} {block.title}</div>
                </div>
                <span className="text-xs text-slate-400">{isOpen ? '−' : '+'}</span>
              </button>
              <ProgressLine value={blockProgress} />

              {isOpen && (
                <div className="space-y-4 pl-3">
                  {block.subblocks.map((subblock) => {
                    const subOpen = openSubblocks[subblock.id]
                    const subProgress = getSubblockProgress(subblock.id)
                    const subActive = activeLocation?.subblockId === subblock.id

                    return (
                      <div key={subblock.id} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setOpenSubblocks((prev) => ({ ...prev, [subblock.id]: !prev[subblock.id] }))}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${subActive ? 'bg-white/10 text-white' : 'bg-transparent text-slate-300 hover:bg-white/5'}`}
                        >
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Подблок</div>
                            <div className="mt-1 text-sm font-medium">{block.order}.{subblock.order} {subblock.title}</div>
                          </div>
                          <span className="text-xs text-slate-400">{subOpen ? '−' : '+'}</span>
                        </button>
                        <ProgressLine value={subProgress} />

                        {subOpen && (
                          <div className="space-y-2 pl-3">
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
                                  className={`block rounded-xl border px-3 py-3 transition ${isActive ? 'border-emerald-400 bg-emerald-400/15 text-white' : 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-medium leading-5">{topic.title}</div>
                                      <div className="mt-1 text-xs text-slate-400">{Math.round(topicProgress * 100)}% завершено</div>
                                    </div>
                                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${isCompleted ? 'bg-emerald-400 text-slate-950' : isInProgress ? 'bg-amber-300 text-slate-950' : 'bg-slate-700 text-slate-100'}`}>
                                      {isCompleted ? 'done' : isInProgress ? 'active' : 'todo'}
                                    </span>
                                  </div>
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
