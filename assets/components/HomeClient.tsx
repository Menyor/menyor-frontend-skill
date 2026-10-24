'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gotoBooking } from './BookingCard';
import { Icon } from '../Icon';
import { MOTION, allowsParallax, prefersReducedMotion } from '@/lib/motion';

export function GotoBookingButton({ tab, className = 'btn btn-primary', children }: { tab: 'pickup' | 'plan'; className?: string; children: ReactNode }) {
  return <button type="button" className={className} onClick={() => gotoBooking(tab)}>{children}</button>;
}

/** Calls back once when 20% of the element is in view; at once with reduced motion. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- motion preference is only known in the browser
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) { setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: MOTION.revealThreshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

/**
 * Fades content up 24px when 20% of it is in view (once). With `stagger`,
 * direct children follow one another 90ms apart.
 */
export function Reveal({ children, className = '', stagger = false, as: Tag = 'div', id }: {
  children: ReactNode; className?: string; stagger?: boolean; as?: 'div' | 'ul' | 'ol'; id?: string;
}) {
  const { ref, visible } = useInView<HTMLElement>();
  return (
    <Tag ref={ref as never} id={id} className={`${className} ${stagger ? 'reveal-stagger' : 'reveal'} ${visible ? 'is-visible' : ''}`}>
      {children}
    </Tag>
  );
}

/** Eyebrow + Cormorant headline whose lines rise 120ms apart. */
export function SectionHeading({ id, eyebrow, lines, className = '', level = 2 }: {
  id: string; eyebrow?: string; lines: readonly string[]; className?: string; level?: 1 | 2;
}) {
  const { ref, visible } = useInView<HTMLDivElement>();
  const H = `h${level}` as 'h1' | 'h2';
  return (
    <div ref={ref} className={`section-heading ${className} ${visible ? 'is-visible' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <H id={id} className="display">
        {lines.map((l, i) => <span key={l} className="display-line" style={{ ['--line' as string]: i }}>{l}{i < lines.length - 1 ? ' ' : ''}</span>)}
      </H>
    </div>
  );
}

/** Desktop only: the hero photo scrolls at 0.85× and fades as the page moves. */
export function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!allowsParallax()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const h = el.offsetHeight || 1;
      const y = Math.min(window.scrollY, h);
      el.style.setProperty('--parallax', `${y * (1 - MOTION.heroParallax)}px`);
      el.style.setProperty('--hero-fade', String(1 - (y / h) * 0.6));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={ref} className="hero-media">{children}</div>;
}

/** Accordion, one answer open at a time; the answer's height animates and the plus turns 45°. */
export function Faq({ items, idPrefix = 'faq' }: { items: { q: string; a: string }[]; idPrefix?: string }) {
  const [open, setOpen] = useState(-1);
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div key={item.q} className={`accordion-item ${open === i ? 'is-open' : ''}`}>
          <h3 className="accordion-q">
            <button type="button" id={`${idPrefix}-btn-${i}`} aria-expanded={open === i} aria-controls={`${idPrefix}-panel-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{item.q}</span><Icon name="plus" className="accordion-sign" />
            </button>
          </h3>
          <div className="accordion-a" id={`${idPrefix}-panel-${i}`} role="region" aria-labelledby={`${idPrefix}-btn-${i}`} inert={open !== i}>
            <div><p>{item.a}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Phones only (CSS): a sticky "Plan my trip" bar once the booking card has
 * scrolled away. Steps aside while the closing section, which has the same
 * button, is on screen.
 */
export function PlanBar({ label }: { label: string }) {
  const [pastCard, setPastCard] = useState(false);
  const [closingVisible, setClosingVisible] = useState(false);
  useEffect(() => {
    const card = document.getElementById('booking');
    const closing = document.getElementById('closing');
    if (!card || !('IntersectionObserver' in window)) return;
    const a = new IntersectionObserver(([e]) => setPastCard(!e.isIntersecting && e.boundingClientRect.top < 0));
    a.observe(card);
    const b = new IntersectionObserver(([e]) => setClosingVisible(e.isIntersecting));
    if (closing) b.observe(closing);
    return () => { a.disconnect(); b.disconnect(); };
  }, []);
  const shown = pastCard && !closingVisible;
  return (
    <div className={`plan-bar ${shown ? 'is-shown' : ''}`} id="plan-bar" inert={!shown}>
      <button type="button" className="btn btn-primary btn-block" onClick={() => gotoBooking('plan')}>{label}</button>
    </div>
  );
}
