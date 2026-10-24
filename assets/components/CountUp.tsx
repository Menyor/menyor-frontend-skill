'use client';

import { useEffect, useRef, useState } from 'react';
import { MOTION, prefersReducedMotion } from '@/lib/motion';
import { useApp } from './AppProvider';

/** Animates from the last value to `target` over 600ms (instant with reduced motion). */
export function useCountUp(target: number): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current;
    if (start === target || prefersReducedMotion()) {
      from.current = target;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- snap to the new value without animating
      setValue(target);
      return;
    }
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / MOTION.countUpMs);
      const eased = 1 - Math.pow(1 - k, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (k < 1) frame = requestAnimationFrame(tick);
      else from.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); from.current = target; };
  }, [target]);
  return value;
}

/** A price in the guest's currency that counts up when it changes. */
export function CountUpPrice({ usdCents }: { usdCents: number }) {
  const { price } = useApp();
  return <>{price(useCountUp(usdCents))}</>;
}
