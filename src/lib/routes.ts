/**
 * Where a trip's itinerary lives.
 *
 * The itinerary used to be a dynamic route, `/trip-planner/trips/[tripId]`. That
 * cannot be exported: GitHub Pages serves files, so a static build would have to
 * know every trip id at build time, and trip ids are minted in the visitor's own
 * browser. The id therefore travels in the query string of one prerendered
 * page, which is deep-linkable, bookmarkable and cacheable like any other static
 * URL.
 *
 * Every link to an itinerary must go through here, so the encoding is decided in
 * exactly one place.
 */
export function itineraryHref(tripId: string): string {
  return `/trip-planner/trips/view?trip=${encodeURIComponent(tripId)}`;
}