'use client';

import { useRef } from 'react';
import { Icon } from './Icon';

/** − value + control. Keeps focus on a usable button when one end is reached. */
export function Stepper({ id, label, value, min, max, onChange, muted = false }: {
  id: string; label: string; value: number; min: number; max: number; onChange(v: number): void; muted?: boolean;
}) {
  const minus = useRef<HTMLButtonElement>(null);
  const plus = useRef<HTMLButtonElement>(null);
  const noun = label.toLowerCase().replace('how many ', '').replace('?', '');
  const step = (d: number) => {
    const v = Math.min(max, Math.max(min, value + d));
    onChange(v);
    if (d < 0 && v <= min) plus.current?.focus();
    if (d > 0 && v >= max) minus.current?.focus();
  };
  return (
    <div className="stepper" role="group" aria-labelledby={`${id}-label`}>
      <span className="field-label" id={`${id}-label`} style={muted ? { fontWeight: 500, color: 'var(--ink-muted)' } : undefined}>{label}</span>
      <div className="stepper-controls">
        <button ref={minus} type="button" className="stepper-btn" id={`${id}-minus`} onClick={() => step(-1)} disabled={value <= min} aria-label={`Fewer ${noun}`}><Icon name="minus" /></button>
        <output className="stepper-value" id={`${id}-value`} aria-live="polite">{value}</output>
        <button ref={plus} type="button" className="stepper-btn" id={`${id}-plus`} onClick={() => step(1)} disabled={value >= max} aria-label={`More ${noun}`}><Icon name="plus" /></button>
      </div>
    </div>
  );
}
