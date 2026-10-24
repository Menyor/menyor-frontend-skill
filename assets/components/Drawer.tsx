'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

// Side drawer (a bottom sheet on phones) with a scrim. Focus moves in on
// open and stays inside (Tab wraps); Escape and the scrim close it.
export function Drawer({ open, onClose, title, subtitle, children, footer, className = '', initialFocus }: {
  open: boolean; onClose(): void; title: string; subtitle?: ReactNode; children: ReactNode; footer?: ReactNode;
  className?: string; initialFocus?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; });
  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    const target = (initialFocus && el?.querySelector<HTMLElement>(initialFocus)) || el?.querySelector<HTMLElement>('button, a, input, select, textarea');
    target?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close.current();
      if (e.key !== 'Tab' || !el) return;
      const f = [...el.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]')].filter(x => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, initialFocus]);

  if (!open) return null;
  const titleId = `drawer-${title.replace(/\W+/g, '-').toLowerCase()}`;
  return createPortal(
    <>
      <div className="scrim" onClick={onClose} />
      <aside ref={ref} className={`drawer ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="drawer-header">
          <div>
            <h2 id={titleId} className="drawer-title">{title}</h2>
            {subtitle}
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label={`Close ${title}`}><Icon name="close" /></button>
        </div>
        {children}
        {footer}
      </aside>
    </>,
    document.body,
  );
}
