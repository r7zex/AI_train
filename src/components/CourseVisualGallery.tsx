import { getCourseVisuals } from '../data/courseVisuals'
import type { FlowTopic } from '../data/aiCurriculumTypes'

export default function CourseVisualGallery({ topic }: { topic: FlowTopic }) {
  const visuals = getCourseVisuals(topic)

  return (
    <section className="space-y-7" aria-label="Иллюстрации к теме">
      {visuals.map((visual) => (
        <figure key={visual.src} className="overflow-hidden border border-[#dfe4e7] bg-white shadow-[0_8px_28px_-26px_rgba(24,38,50,0.8)]">
          <img
            src={visual.src}
            alt={visual.alt}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full bg-white object-contain"
          />
        </figure>
      ))}
    </section>
  )
}
