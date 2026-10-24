'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Centred modal (scales 0.96 → 1) rendered on <body>, so a transformed
// ancestor (a card lifting on hover) can't trap it. Focus moves in and stays
// inside; Escape and the scrim close it; focus returns to the opener.
export function Modal({ onClose, labelledBy, className = '', role = 'dialog', children }: {
  onClose(): void; labelledBy: string; className?: string; role?: 'dialog' | 'alertdialog'; children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; });
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const el = ref.current;
    el?.querySelector<HTMLElement>('[data-autofocus], input, select, textarea, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close.current();
      if (e.key !== 'Tab' || !el) return;
      const f = [...el.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea')].filter(x => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); opener?.focus?.(); };
  }, []);
  return createPortal(
    <>
      <div className="scrim" onClick={onClose} />
      <div ref={ref} className={`dialog ${className}`} role={role} aria-modal="true" aria-labelledby={labelledBy}>{children}</div>
    </>,
    document.body,
  );
}
