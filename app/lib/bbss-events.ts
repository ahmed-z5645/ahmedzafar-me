/** Redis hash: field = event id, value = BBSSEvent. Redis is the source of
 *  truth — Notion-sourced events are upserted into it by /api/bbss-events/sync,
 *  manual events are added directly through /admin/bbss-events. Neither ever
 *  writes back to Notion. */
export const BBSS_EVENTS_KEY = "bbss:events";

export interface BBSSEvent {
  id: string;
  title: string;
  start: string; // ISO 8601
  end: string; // ISO 8601
  allDay: boolean;
  location: string;
  description: string;
  source: "manual" | "notion";
}
