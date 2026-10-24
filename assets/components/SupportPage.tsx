import type { ReactNode } from 'react';

/** Supporting pages: centred eyebrow and Cormorant headline, content in a white large card about 720px wide. */
export function SupportPage({ eyebrow, lines, intro, children, wide = false }: {
  eyebrow?: string; lines: readonly string[]; intro?: string; children: ReactNode; wide?: boolean;
}) {
  return (
    <div className="container page support">
      <header className="page-head is-centred">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display">{lines.map(l => <span key={l} className="display-line">{l}</span>)}</h1>
        {intro && <p className="page-intro">{intro}</p>}
      </header>
      <div className={`support-card ${wide ? 'is-wide' : ''}`}>{children}</div>
    </div>
  );
}
