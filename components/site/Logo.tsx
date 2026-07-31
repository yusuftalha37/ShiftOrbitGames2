/**
 * Wordmark: a geometric orbit glyph — an ellipse with a body offset from
 * its centre. Drawn rather than imported so it stays crisp at any size and
 * inherits the surrounding text colour.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <ellipse
          cx="11"
          cy="11"
          rx="9.25"
          ry="5"
          transform="rotate(-32 11 11)"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <circle cx="14.6" cy="7.4" r="3.1" fill="currentColor" />
      </svg>
      <span className="text-[0.9375rem] font-semibold tracking-[-0.015em]">
        Shift Orbit
      </span>
    </span>
  )
}
