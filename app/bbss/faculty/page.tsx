import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import WidgetPreview from "../../components/bbss/widget-preview";
import CopyButton from "../../components/bbss/copy-button";
import Steps from "../../components/bbss/steps";
import {
  BbssPage,
  Callout,
  CodeBlock,
  Mono,
  P,
  Section,
} from "../../components/bbss/prose";

export const metadata: Metadata = {
  title: "Biochemistry Faculty Directory — BBSS Widgets",
  description:
    "A searchable list of the Department of Biochemistry and Biomedical Sciences faculty, and how to keep it current.",
  robots: { index: false, follow: false },
};

// Read at build time from the same file the copy button serves, so the listing
// below can never drift from the script an exec actually runs.
const SCRAPER = fs.readFileSync(
  path.join(process.cwd(), "public/bbss/snippets/scrape-faculty.js"),
  "utf8",
);

const SAMPLE_OUTPUT = `Found 33 faculty on the page (widget.html currently has 32).
ADDED:   Isaac Harris
REMOVED: (none)
⚠ REVIEW these rows before shipping (5):
   Matthew Miller: moved to subtitle → "Scientific Director, ... (IIDR)"`;

export default function FacultyPage() {
  return (
    <BbssPage
      title="Biochemistry Faculty Directory"
      standfirst="A searchable list of the department's faculty."
    >
      <P>
        Every active faculty member in the Department of Biochemistry and
        Biomedical Sciences — photo, title, research areas, and email — with a
        search box that filters as you type by name, title, or research area.
        Photos load from the department&rsquo;s own site, so they stay current on
        their own; if one ever disappears, that row falls back to the
        person&rsquo;s initials rather than a broken image.
      </P>
      <P>
        Rows link to the department&rsquo;s people page. They deliberately
        don&rsquo;t link to individual professors: McMaster shows each bio in a
        pop-up rather than on its own web address, so there&rsquo;s nothing to link
        to.
      </P>

      <Section title="Try it">
        <P>
          Type a name or a research area — &ldquo;microbiome&rdquo;,
          &ldquo;cancer&rdquo;, &ldquo;machine learning&rdquo; — and watch the list
          narrow.
        </P>
        <div className="mt-8">
          <WidgetPreview
            src="/bbss/snippets/biochem-faculty.html"
            title="Biochemistry Faculty Directory demo"
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
          .
        </P>
      </Section>

      <Section title="Keeping the list current">
        <P>
          The list is a <strong className="text-foreground">snapshot</strong>, not
          a live feed. Faculty join, retire, get promoted, and change research
          focus, and the widget won&rsquo;t notice on its own. Refresh it{" "}
          <strong className="text-foreground">once a term</strong>, and any time
          someone tells you a professor is missing.
        </P>
        <P>
          You don&rsquo;t retype it. A short script reads the department&rsquo;s
          own people page and rebuilds the whole list for you.
        </P>
        <Steps
          steps={[
            {
              title: "Open the department's people page:",
              body: (
                <>
                  <strong className="text-foreground">
                    biochem.healthsci.mcmaster.ca/people
                  </strong>
                  . Stay on the Faculty tab — the one already selected when the
                  page loads.
                </>
              ),
            },
            {
              title: "Open the developer console:",
              body: "⌥ Option + ⌘ Command + J on a Mac, Ctrl + Shift + J on Windows. A panel opens with a blinking cursor. This is normal and you can't break anything from it.",
            },
            {
              title: "If it warns you about pasting code,",
              body: (
                <>
                  type <Mono>allow pasting</Mono>, press Enter, and carry on.
                  (Chrome asks this to protect people from scams. This script only
                  reads the page.)
                </>
              ),
            },
            {
              title: "Press Copy the update script below,",
              body: "click into the console, paste, press Enter.",
            },
            {
              title: "Read what it prints",
              body: "— see below — then follow Update the widget.",
            },
          ]}
        />
        <CopyButton
          text={SCRAPER}
          label="Copy the update script"
          className="mt-8"
        />
        <CodeBlock>{SCRAPER}</CodeBlock>
      </Section>

      <Section title="Reading the results">
        <CodeBlock maxHeight={220}>{SAMPLE_OUTPUT}</CodeBlock>
        <P>
          <strong className="text-foreground">ADDED / REMOVED</strong> — who joined
          or left since the last update. This is your sanity check: if it claims
          twenty people left, something went wrong — stop and ask.
        </P>
        <P>
          <strong className="text-foreground">⚠ REVIEW</strong> — judgement calls
          the script made. The department&rsquo;s page crams job titles, degrees,
          and research areas into one blob of text per person, so the script has to
          guess which line is which. It drops degrees, keeps research areas, and
          moves things like &ldquo;Canada Research Chair in …&rdquo; up next to the
          job title. These are usually right; glance at them anyway.
        </P>
        <Callout>
          <strong>The script drafts, you confirm.</strong> It copies the
          department&rsquo;s wording exactly, which means small hand-made
          improvements to the current list get reverted. Skim the result before you
          ship it.
        </Callout>
      </Section>

      <Section title="Update the widget">
        <P>The new list is already on your clipboard.</P>
        <Steps
          steps={[
            {
              title: "Press Copy snippet above",
              body: "to get the current widget code, and paste it into any plain text editor.",
            },
            {
              title: "Find the two lines",
              body: (
                <>
                  <Mono>{"// ==== DATA START ===="}</Mono> and{" "}
                  <Mono>{"// ==== DATA END ===="}</Mono>.
                </>
              ),
            },
            {
              title: "Select everything between them",
              body: "and paste over it with what the script gave you.",
            },
            {
              title: "Copy the whole edited snippet",
              body: "and paste it into the Squarespace Code Block, replacing what's there.",
            },
            {
              title: "Check the live page:",
              body: "the count at the top right of the widget should match the number the script reported.",
            },
          ]}
        />
      </Section>

      <Section title="If the script prints an error">
        <P>
          If it says it can&rsquo;t find the Faculty tab, you&rsquo;re either on
          the wrong page or on the wrong tab — go back to step 1. If it still
          fails, the department has redesigned its website and the script needs
          updating by whoever maintains these widgets. Nothing is broken on the
          BBSS site in the meantime; the existing list keeps working exactly as
          before.
        </P>
      </Section>
    </BbssPage>
  );
}
