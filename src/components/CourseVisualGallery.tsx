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
            className="overflow-hidden rounded-2xl border border-[#d9e6f2] bg-white shadow-[0_18px_48px_-34px_rgba(11,112,224,0.45)]"
          >
            <div
              className="overflow-x-auto bg-white"
              role="region"
              aria-label="Прокручиваемая иллюстрация"
              tabIndex={0}
            >
              <img
                src={visual.src}
                alt={visual.alt}
                aria-describedby={captionId}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full min-w-[680px] bg-white object-contain sm:min-w-0"
              />
            </div>
            <figcaption id={captionId} className="border-t border-[#dbe9f6] bg-[#f4f9ff] px-4 py-3 text-[13px] leading-5 text-[#435466] sm:px-5 sm:py-4">
              {visual.caption}
            </figcaption>
          </figure>
        )
      })}
    </section>
  )
}
