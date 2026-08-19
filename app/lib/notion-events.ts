import type { BBSSEvent } from "./bbss-events";

const NOTION_VERSION = "2022-06-28";
const MAX_PAGES = 5; // 5 * 100 = up to 500 rows, plenty of headroom

/** Property names in the BBSS Notion events database. Adjust these if the
 *  database's column names differ — see BBSS_EVENTS_SETUP.txt. */
const TITLE_PROP = "Name";
const DATE_PROP = "Date";
const LOCATION_PROP = "Location";
const DESCRIPTION_PROP = "Description";

type NotionRichText = { plain_text: string }[];
type NotionDate = { start: string; end: string | null };

interface NotionProperty {
  type: string;
  title?: NotionRichText;
  rich_text?: NotionRichText;
  date?: NotionDate | null;
}

interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
}

function plainText(rich: NotionRichText | undefined): string {
  return (rich ?? []).map((r) => r.plain_text).join("");
}

function pageToEvent(page: NotionPage): BBSSEvent | null {
  const titleProp = page.properties[TITLE_PROP];
  const dateProp = page.properties[DATE_PROP];
  const locationProp = page.properties[LOCATION_PROP];
  const descriptionProp = page.properties[DESCRIPTION_PROP];

  const title =
    titleProp?.type === "title" ? plainText(titleProp.title).trim() : "";
  const date = dateProp?.type === "date" ? dateProp.date ?? null : null;

  if (!title || !date?.start) return null;

  const allDay = !date.start.includes("T");
  const start = allDay ? `${date.start}T00:00:00` : date.start;
  const end = date.end
    ? allDay
      ? `${date.end}T23:59:59`
      : date.end
    : allDay
      ? `${date.start}T23:59:59`
      : date.start;

  return {
    id: `notion-${page.id}`,
    title,
    start,
    end,
    allDay,
    location:
      locationProp?.type === "rich_text" ? plainText(locationProp.rich_text) : "",
    description:
      descriptionProp?.type === "rich_text"
        ? plainText(descriptionProp.rich_text)
        : "",
    source: "notion",
  };
}

/** Whether the Notion credentials are present. Callers use this to skip the
 *  sync entirely rather than treating an unconfigured deployment as a failure —
 *  the site runs fine on manually-added events alone. */
export function isNotionConfigured(): boolean {
  return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID);
}

/** Fetches every row from the Notion events database and maps it to a
 *  BBSSEvent. Read-only — never writes back to Notion.
 *
 *  Throws if called without credentials; check isNotionConfigured() first. A
 *  bad token or an unreachable Notion still throws, and should — that is a
 *  real failure, unlike simply not having set it up. */
export async function fetchNotionEvents(): Promise<BBSSEvent[]> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    throw new Error("Notion sync is not configured (missing NOTION_TOKEN or NOTION_DATABASE_ID)");
  }

  const events: BBSSEvent[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {}),
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Notion API error ${res.status}: ${await res.text()}`);
    }

    const data: { results: NotionPage[]; has_more: boolean; next_cursor: string | null } =
      await res.json();

    for (const notionPage of data.results) {
      const event = pageToEvent(notionPage);
      if (event) events.push(event);
    }

    if (!data.has_more) break;
    cursor = data.next_cursor ?? undefined;
  }

  return events;
}
