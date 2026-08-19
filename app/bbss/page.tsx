import type { Metadata } from "next";
import Link from "next/link";
import Steps from "../components/bbss/steps";
import {
  BbssPage,
  Callout,
  Mono,
  P,
  Section,
  Troubleshoot,
} from "../components/bbss/prose";

export const metadata: Metadata = {
  title: "BBSS Website Widgets",
  description:
    "Interactive pieces for the BBSS Squarespace site — what they are, how to put them on a page, and how to change them later.",
  robots: { index: false, follow: false },
};

const WIDGETS = [
  {
    href: "/bbss/specializations",
    name: "Biochemistry Specializations",
    blurb:
      "An interactive flowchart of the four Level III Biochemistry paths. Students click a specialization to see how to get in, how long it takes, and what makes it different.",
    editable: "Editable: yes, with a point-and-click editor.",
  },
  {
    href: "/bbss/faculty",
    name: "Biochemistry Faculty Directory",
    blurb:
      "A searchable list of all 33 faculty in the Department of Biochemistry and Biomedical Sciences, with photos, research areas, and emails.",
    editable:
      "Editable: refreshed from the department's website with one command.",
  },
  {
    href: "/bbss/events-calendar",
    name: "BBSS Events Calendar",
    blurb:
      "A month grid of BBSS events that collapses to a simple list on phones. Students see what's coming up; nothing about it needs to be pasted or edited more than once.",
    editable:
      "Editable: yes, from a page on this site — add events by hand or pull them in from the BBSS Notion calendar.",
  },
];

export default function BbssHub() {
  return (
    <BbssPage
      title="BBSS Website Widgets"
      standfirst="Interactive pieces for the BBSS Squarespace site — what they are, how to put them on a page, and how to change them later."
    >
      <P>
        These widgets are small, self-contained blocks of code. You paste one into
        a Squarespace <strong className="text-foreground">Code Block</strong> and
        it becomes an interactive part of the page — a flowchart, a searchable
        directory. No plugins, no accounts, nothing to install, and nothing to
        maintain between updates.
      </P>
      <P>
        Each widget below has its own page with a live demo you can click around, a
        copy button, and instructions for changing its content. You don&rsquo;t
        need to know how to code to use them.
      </P>

      <div className="mt-12 grid gap-4">
        {WIDGETS.map((w) => (
          <Link
            key={w.href}
            href={w.href}
            className="group block border border-foreground/[0.15] rounded p-6 hover:border-accent transition-colors"
          >
            <h2 className="font-[family-name:var(--font-newsreader)] text-card text-foreground group-hover:text-accent transition-colors">
              {w.name}
            </h2>
            <p className="mt-2.5 font-[family-name:var(--font-geist-sans)] text-body leading-relaxed text-foreground/[0.58]">
              {w.blurb}
            </p>
            <p className="mt-3 font-[family-name:var(--font-geist-mono)] text-[12px] text-foreground/[0.40]">
              {w.editable}
            </p>
          </Link>
        ))}
      </div>

      <Section title="How to put a widget on the site">
        <P>
          <strong className="text-foreground">You&rsquo;ll need:</strong> edit
          access to the BBSS Squarespace site. Code Blocks require the{" "}
          <strong className="text-foreground">Business plan</strong> or higher —
          they don&rsquo;t exist on the Personal plan.
        </P>
        <Steps
          steps={[
            {
              title: "Copy the widget.",
              body: "Go to the widget's page here and press Copy snippet.",
            },
            {
              title: "Add a Code Block.",
              body: "In Squarespace, edit the page, click the + where the widget should go, and choose Code.",
            },
            {
              title: "Paste and save.",
              body: "Select everything already in the block, delete it, paste, and save.",
            },
            {
              title: "Check the live site.",
              body: "Click Preview, or save and visit the published page.",
            },
          ]}
        />
        <Callout>
          <strong>Step 4 is not optional.</strong> Squarespace&rsquo;s page editor
          often doesn&rsquo;t run widget code, so a widget can look completely
          broken — or invisible — while you&rsquo;re editing, and be perfectly fine
          on the real page. Always judge it from the live or preview view.
        </Callout>
      </Section>

      <Section title="Changing a widget later">
        <P>
          Every widget&rsquo;s content lives in one clearly marked block of the
          snippet, between two lines that read{" "}
          <Mono>{"// ==== DATA START ===="}</Mono> and{" "}
          <Mono>{"// ==== DATA END ===="}</Mono>. That&rsquo;s the only part you
          ever need to touch.
        </P>
        <P>
          The easiest path: use the editor on the widget&rsquo;s page here, press{" "}
          <strong className="text-foreground">Copy customized widget</strong>, and
          re-paste the whole thing into the same Code Block, replacing what&rsquo;s
          there. You never edit code inside Squarespace — you replace the whole
          block each time.
        </P>
        <P>
          Nothing you do on this site can break the live site. These pages have no
          connection to Squarespace; they just help you produce the right text to
          paste.
        </P>
      </Section>

      <Section title="When something looks wrong">
        <Troubleshoot q="The widget is blank or shows nothing.">
          You&rsquo;re almost certainly looking at the Squarespace editor rather
          than the live page. Preview or publish, then look again.
        </Troubleshoot>
        <Troubleshoot q="The widget appears twice.">
          The snippet got pasted into two Code Blocks. Delete one. (The code
          protects itself against being loaded twice, so nothing is broken —
          it&rsquo;s just duplicated.)
        </Troubleshoot>
        <Troubleshoot q="The fonts don't match the rest of the site.">
          That&rsquo;s intentional and correct: widgets inherit the site&rsquo;s
          fonts, so they should match automatically. If they don&rsquo;t, the Code
          Block may be inside an unusual section — try a plain section.
        </Troubleshoot>
        <Troubleshoot q="The layout looks squished on a phone.">
          Every widget is built to work down to 320px wide. Check the demo on this
          site with the <strong className="text-foreground">Mobile</strong> toggle
          first; if the demo is fine and Squarespace isn&rsquo;t, the Code Block is
          probably in a narrow column.
        </Troubleshoot>
        <Troubleshoot q="I pasted it and now the page won't save.">
          Undo, and make sure you copied with the{" "}
          <strong className="text-foreground">Copy snippet</strong> button rather
          than selecting the text by hand — partial copies are the usual cause.
        </Troubleshoot>
      </Section>

      <p className="mt-16 border-t border-foreground/[0.10] pt-8 font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]">
        Source code and technical notes:{" "}
        <a
          href="https://github.com/ahmed-z5645/BBSS-website-widgets"
          className="text-accent hover:underline"
        >
          github.com/ahmed-z5645/BBSS-website-widgets
        </a>
        .
      </p>
    </BbssPage>
  );
}
