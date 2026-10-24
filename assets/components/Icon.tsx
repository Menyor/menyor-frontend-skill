// Inline line icons (stroke = currentColor). Decorative unless `label` is given.
const PATHS: Record<string, string> = {
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>',
  bag: '<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  plan: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5Z"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z"/>',
  whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Z"/><path d="M9 9.5c.3 2 1.8 3.5 3.8 4l1-1 2 1"/>',
  shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/>',
  plane: '<path d="M21 15.5 13.5 12V6.5a1.5 1.5 0 0 0-3 0V12L3 15.5V17l7.5-2v3.5L8.5 20v1.5l3.5-1 3.5 1V20l-2-1.5V15l7.5 2v-1.5Z"/>',
  landing: '<path d="M3 21h18"/><path d="M4.5 10.5 6 8l2.5 1.2 2-4.7 2 .7-.6 5.3 5.3 2.3a1.6 1.6 0 0 1-1.2 3L4.5 12.5v-2Z"/>',
  checklist: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="m3.5 6 1.5 1.5L7.5 5M3.5 12l1.5 1.5 2.5-2.5M3.5 18l1.5 1.5 2.5-2.5"/>',
  namecard: '<circle cx="7.5" cy="6" r="2.5"/><path d="M3 21v-5.5A4.5 4.5 0 0 1 7.5 11h0a4.5 4.5 0 0 1 4.5 4.5"/><rect x="11.5" y="9" width="9.5" height="6.5" rx="1"/><path d="M14 12.25h4.5"/>',
  car: '<path d="M5 17h14M3 17v-4.5L5.5 7h13l2.5 5.5V17"/><path d="M3 12.5h18"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  bed: '<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11.5" r="2"/>',
  dish: '<path d="M3 18h18"/><path d="M5 18a7 7 0 0 1 14 0"/><path d="M12 9V7M10.5 7h3"/>',
  boat: '<path d="M3 16h18l-2 4H5l-2-4Z"/><path d="M12 3v13M12 4.5 18 13h-6"/>',
  cocktail: '<path d="M5 4h14l-7 8-7-8Z"/><path d="M12 12v8M8 20h8M8 7h8"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/>',
  minus: '<path d="M6 12h12"/>',
  plus: '<path d="M12 6v12M6 12h12"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  chevronDown: '<path d="m7 10 5 5 5-5"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  arrowLong: '<path d="M2 12h19M15.5 6.5 21 12l-5.5 5.5"/>',
  send: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  copyright: '<circle cx="12" cy="12" r="9"/><path d="M14.8 9.5a3.5 3.5 0 1 0 0 5"/>',
  sos: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>',
  google: '<path d="M20.5 12.2c0-.6-.1-1.2-.2-1.7H12v3.3h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.6-3.9 2.6-6.5Z"/><path d="M12 21c2.4 0 4.5-.8 5.9-2.2L15 16.5c-.8.5-1.8.9-3 .9-2.3 0-4.3-1.6-5-3.7H4v2.3A9 9 0 0 0 12 21Z"/><path d="M7 13.7a5.4 5.4 0 0 1 0-3.4V8H4a9 9 0 0 0 0 8l3-2.3Z"/><path d="M12 6.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 4 8l3 2.3c.7-2.1 2.7-3.7 5-3.7Z"/>',
  apple: '<path d="M16.4 12.6c0-2 1.6-3 1.7-3a3.8 3.8 0 0 0-3-1.6c-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.8-2.8-.7a4.1 4.1 0 0 0-3.5 2.1c-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.5 2.2 2.6 2.1 1-.1 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2.1.8-1.2 1.1-2.3 1.1-2.4 0 0-2-.8-2-3.7Z"/><path d="M14.4 6.3c.6-.7 1-1.7.9-2.6-.8 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.5.9.1 1.9-.5 2.5-1.2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  bank: '<path d="M3 9.5 12 4l9 5.5M4.5 10v7.5M9.5 10v7.5M14.5 10v7.5M19.5 10v7.5M3 20h18"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  pending: '<path d="M12 3.5a8.5 8.5 0 1 1-7.4 4.3"/><path d="M4.2 3.8v4.3h4.3"/><path d="M12 8v4.2l2.6 1.6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M8 14h3"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
  pin: '<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11Z"/><circle cx="12" cy="10" r="2.2"/>',
  thumbUp: '<path d="M7 11v9H4v-9h3Zm0 0 4-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7"/>',
  thumbDown: '<path d="M7 13V4H4v9h3Zm0 0 4 7a2 2 0 0 0 2-2v-4h5a2 2 0 0 0 2-2.3l-1.2-6A2 2 0 0 0 16.8 4H7"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".7" fill="currentColor"/>',
  tiktok: '<path d="M14 3.5v11a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3.5c.6 2.6 2.4 4.3 5 4.6"/>',
  x: '<path d="M4.5 4h4l11 16h-4L4.5 4Z"/><path d="M19.5 4 13 11.3M11 12.7 4.5 20"/>',
  linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16.5M8 7.5v.01M11.5 16.5v-6M11.5 13a2.5 2.5 0 0 1 5 0v3.5"/>',
};

/** The long, thin arrow of arrow links ("See cars →"). */
export function ArrowLong() {
  return (
    <svg viewBox="0 0 34 14" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M1 7h31M26 1.5 32 7l-6 5.5" />
    </svg>
  );
}

export type IconName = keyof typeof PATHS | string;

export function Icon({ name, className = 'icon', label }: { name: IconName; className?: string; label?: string }) {
  return (
    <span className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        focusable="false" dangerouslySetInnerHTML={{ __html: PATHS[name] ?? '' }} />
    </span>
  );
}
