import type { CourseVisual } from '../data/courseVisuals'

export default function CourseVisualGallery({ visuals }: { visuals: CourseVisual[] }) {
  if (!visuals.length) return null

  return (
    <section className="space-y-7" aria-label="Иллюстрации к теме">
      {visuals.map((visual) => {
        const captionId = `course-visual-caption-${visual.src.replace(/[^a-z0-9]+/gi, '-')}`
        return (
          <figure
            key={visual.src}
            className="overflow-hidden border border-[#dfe4e7] bg-white shadow-[0_8px_28px_-26px_rgba(24,38,50,0.8)]"
          >
            <img
              src={visual.src}
              alt={visual.alt}
              aria-describedby={captionId}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full bg-white object-contain"
            />
            <figcaption id={captionId} className="border-t border-[#e4e8eb] bg-[#f8faf9] px-4 py-3 text-[13px] leading-5 text-[#49545c]">
              {visual.caption}
            </figcaption>
          </figure>
        )
      })}
    </section>
  )
}
