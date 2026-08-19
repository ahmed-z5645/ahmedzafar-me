import type { Metadata } from "next";
import Link from "next/link";
import WidgetPreview from "../../components/bbss/widget-preview";
import {
  BbssPage,
  P,
  Section,
  Troubleshoot,
} from "../../components/bbss/prose";

export const metadata: Metadata = {
  title: "BBSS Events Calendar — BBSS Widgets",
  description:
    "A calendar of BBSS events for the site, fed live from the events list on ahmedzafar.me.",
  robots: { index: false, follow: false },
};

export default function EventsCalendarPage() {
  return (
    <BbssPage
      title="BBSS Events Calendar"
      standfirst="A calendar of BBSS events for the site."
    >
      <P>
        Shows a full month grid — click any date to see what&rsquo;s on it — and
        automatically switches to a simple list of upcoming events on narrow
        screens, so it still works in a tight mobile column. Unlike the other two
        widgets, there&rsquo;s nothing to fill in and nothing to splice into the
        code: it fetches events live, every time someone loads the page, from an
        events list kept on this site.
      </P>

      <Section title="Try it">
        <P>
          This is the real widget, showing whatever events are in the list right
          now. Use the <strong className="text-foreground">Mobile</strong> toggle
          to see the collapsed agenda view students on phones will get.
        </P>
        <div className="mt-8">
          <WidgetPreview
            src="/bbss/snippets/bbss-events-calendar.html"
            title="BBSS Events Calendar demo"
          />
        </div>
      </Section>

      <Section title="Put it on the site">
        <P>
          Press <strong className="text-foreground">Copy snippet</strong> above,
          then follow the four steps on the{" "}
          <Link href="/bbss" className="text-accent hover:underline">
            main widget page
          </Link>
          . There&rsquo;s nothing to fill in first — the snippet already points at
          the live event list, so paste it exactly as copied.
        </P>
      </Section>

      <Section title="Adding, editing, and removing events">
        <P>
          Unlike the other two widgets, you never touch this widget&rsquo;s code to
          change what it shows. Events live in a small list on this site, managed
          at{" "}
          <Link
            href="/admin/bbss-events"
            className="text-accent hover:underline font-semibold"
          >
            /admin/bbss-events
          </Link>
          :
        </P>
        <ul className="mt-5 space-y-3 font-[family-name:var(--font-geist-sans)] text-body leading-relaxed text-foreground/[0.58] list-disc pl-5">
          <li>
            Add, edit, or delete individual events by hand through the form there.
          </li>
          <li>
            Or press <strong className="text-foreground">Sync from Notion</strong>{" "}
            on that same page to pull in whatever&rsquo;s currently in the BBSS
            Notion events calendar. This also happens automatically, once a day,
            without anyone doing anything.
          </li>
          <li>
            Events added by hand and events pulled from Notion both show up on the
            site side by side. Syncing again never deletes or overwrites anything
            you added by hand — it only ever touches the events that came from
            Notion.
          </li>
        </ul>
        <P>
          That page is behind a shared password — ask whoever maintains the BBSS
          site if you need it. This docs page doesn&rsquo;t need it: everyone can
          see the calendar, only editing requires the password.
        </P>
      </Section>

      <Section title="If the calendar looks empty or won't load">
        <Troubleshoot q="It's empty.">
          There are just no upcoming events in the list right now — press{" "}
          <strong className="text-foreground">Sync from Notion</strong> on the{" "}
          <Link href="/admin/bbss-events" className="text-accent hover:underline">
            admin page
          </Link>{" "}
          if events were added to Notion recently, or add one by hand there to
          check.
        </Troubleshoot>
        <Troubleshoot q={'It shows "Unable to load events right now."'}>
          The events API on this site is unreachable — check that ahmedzafar.me
          itself is up. Nothing about the Squarespace side needs fixing in that
          case.
        </Troubleshoot>
      </Section>
    </BbssPage>
  );
}
