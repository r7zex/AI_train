import { useState, useEffect } from 'react'

const STORAGE_KEY = 'ml-trainer-progress'

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]))
  }, [completed])

  const markCompleted = (topicId: string) => setCompleted(prev => new Set([...prev, topicId]))
  const markIncomplete = (topicId: string) => setCompleted(prev => { const n = new Set(prev); n.delete(topicId); return n })
  const isCompleted = (topicId: string) => completed.has(topicId)
  const toggleCompleted = (topicId: string) => isCompleted(topicId) ? markIncomplete(topicId) : markCompleted(topicId)

  return { completed, isCompleted, toggleCompleted, markCompleted }
}
