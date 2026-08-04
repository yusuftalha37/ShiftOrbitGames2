import Image from "next/image"

/**
 * The header lockup: the studio emblem with the wordmark beside it and the
 * tagline underneath, in the condensed uppercase register the rest of the
 * site uses for display type.
 */
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="relative block h-9 w-9 shrink-0 sm:h-10 sm:w-10">
        <Image
          src="/logo.png"
          alt=""
          fill
          sizes="40px"
          className="object-contain"
          priority
        />
      </span>

      <span className="flex flex-col leading-none">
        <span className="display text-[1.0625rem] sm:text-[1.1875rem]">
          Shift<span className="text-accent">Orbit</span>
        </span>
        {!compact && (
          <span className="mt-1 text-[0.5625rem] font-semibold uppercase tracking-[0.22em] text-ink-3">
            Power to the stars
          </span>
        )}
      </span>
    </span>
  )
}
