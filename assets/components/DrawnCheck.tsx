/** Green check that draws itself in 500ms (shown at once with reduced motion). */
export function DrawnCheck({ className = 'result-icon drawn-check' }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" pathLength={1} /><path d="m8 12.5 2.8 2.8L16.5 9.5" pathLength={1} />
      </svg>
    </span>
  );
}
