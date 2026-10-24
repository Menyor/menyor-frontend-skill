import { Icon } from './Icon';

// Designed placeholder until a verified photo exists: blue tint with one blue
// line icon. No text.
export function MediaPlaceholder({ icon, label }: { icon: string; label: string; seasonal?: boolean }) {
  return (
    <div className="media-placeholder" {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
      <Icon name={icon} className="media-placeholder-icon" />
    </div>
  );
}
