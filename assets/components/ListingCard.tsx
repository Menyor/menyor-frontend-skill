import Link from 'next/link';
import type { AddonDTO, ListingDTO } from '@/lib/catalogue';
import { MediaPlaceholder } from './MediaPlaceholder';
import { Price } from './Price';
import { AddToTripButton } from './AddToTrip';
import { Icon } from './Icon';
import { kindPath } from './kindPath';
import { formatTitle, keyFacts, locationLine, unitLabel } from '@/lib/listing-format';
import { CATALOGUE_UI } from '@/content/catalogue';


export function CardMedia({ listing, priority = false }: { listing: ListingDTO; priority?: boolean }) {
  return (
    <div className="card-media">
      {listing.photo
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={listing.photo.url} alt={listing.photo.alt} loading={priority ? 'eager' : 'lazy'} decoding="async" width={900} height={675} />
        : <MediaPlaceholder icon={listing.icon ?? 'compass'} label={`${listing.title}, photo to follow`} />}
      {listing.tag && <span className="card-badge">{listing.tag}</span>}
    </div>
  );
}

/** Green ticks, like the ready-made trip cards. */
export function CheckList({ items, max = 4 }: { items: string[]; max?: number }) {
  const shown = items.slice(0, max);
  return (
    <ul className="check-list">
      {shown.map(i => (
        <li key={i}><span className="check-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>{i}</li>
      ))}
      {items.length > shown.length && <li className="check-more">+ {items.length - shown.length} more</li>}
    </ul>
  );
}

/**
 * listing_card: photo, Cormorant title, location, two or three key facts as
 * badges, price in the guest's currency and "Add to my trip".
 */
export function ListingCard({ listing, addons = [], headingLevel = 2, unavailable = false }: {
  listing: ListingDTO; addons?: AddonDTO[]; headingLevel?: 2 | 3; unavailable?: boolean;
}) {
  const H = `h${headingLevel}` as 'h2' | 'h3';
  const href = `/${kindPath(listing.kind)}/${listing.slug}`;
  const includes = Array.isArray(listing.attributes.includes) ? (listing.attributes.includes as string[]) : null;
  return (
    <article className={`listing-card ${unavailable ? 'is-unavailable' : ''}`}>
      <Link href={href} tabIndex={-1} aria-hidden="true" className="listing-card-media"><CardMedia listing={listing} /></Link>
      <H className="listing-card-title"><Link href={href}>{formatTitle(listing.title)}</Link></H>
      <p className="listing-card-loc"><Icon name="pin" />{locationLine(listing)}</p>
      {includes
        ? <CheckList items={includes} max={3} />
        : <ul className="listing-card-facts">{keyFacts(listing).map(f => <li key={f} className="badge">{f}</li>)}</ul>}
      {unavailable && <p className="badge badge-muted">{CATALOGUE_UI.booked}</p>}
      <div className="listing-card-foot">
        <div>
          <p className="listing-card-price"><Price usdCents={listing.priceUsdCents} /></p>
          <p className="listing-card-unit">{unitLabel(listing)}</p>
        </div>
        {unavailable
          ? <Link href={href} className="btn btn-outline">{CATALOGUE_UI.otherDates}</Link>
          : <AddToTripButton listing={listing} addons={addons} label={CATALOGUE_UI.add} className="btn btn-primary" />}
      </div>
    </article>
  );
}
