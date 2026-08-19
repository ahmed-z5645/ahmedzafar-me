import type { Metadata } from "next";
import Link from "next/link";
import SpecEditor from "../../components/bbss/spec-editor";
import {
  BbssPage,
  Callout,
  CodeBlock,
  Mono,
  P,
  Section,
} from "../../components/bbss/prose";

export const metadata: Metadata = {
  title: "Biochemistry Specializations — BBSS Widgets",
  description:
    "An interactive flowchart of the four Level III Biochemistry paths, with a point-and-click content editor.",
  robots: { index: false, follow: false },
};

const FIELDS: [string, string][] = [
  ["Name", "The specialization's name, in bold on the card."],
  [
    "Badge",
    'The small uppercase label — how you get in ("Supplementary application"). Keep it to a few words; it’s a badge, not a sentence.',
  ],
  [
    "Colour",
    "The card's stripe and badge colour. One of the four BBSS accent colours. Give each card a different one.",
  ],
  ["Overview", "One sentence: what this path is for."],
  ["Entry year", "When students enter it (all four are Level III today)."],
  ["Application", "What they actually have to do to apply."],
  ["Prerequisites", "Grades, courses, or prep needed beforehand."],
  ["Program length", "4 years, 5 years, etc."],
  ["Highlights", "What makes this path distinctive — the selling point."],
];

const DATA_SHAPE = `var DATA = [
  {
    name: 'Biochemistry Co-op',           // card heading
    gate: 'OSCARplus application',        // the small uppercase badge
    color: ACCENT.orange,                 // ACCENT.green | .blue | .orange | .pink
    details: [                            // exactly these six labels, in this order
      { label: 'Overview',       value: '…' },
      { label: 'Entry year',     value: '…' },
      { label: 'Application',    value: '…' },
      { label: 'Prerequisites',  value: '…' },
      { label: 'Program length', value: '…' },
      { label: 'Highlights',     value: '…' }
    ]
  },
  …
];`;

export default function SpecializationsPage() {
  return (
    <BbssPage
      title="Biochemistry Specializations"
      standfirst="An interactive flowchart of the four Level III paths."
    >
      <P>
        A student lands on Level II Biochemistry and sees four ways forward. Each
        card shows the specialization and how you get in; clicking one expands the
        same six details for every path, so they&rsquo;re actually comparable. On a
        phone the flowchart stacks into a single column and the connector lines
        disappear.
      </P>

      <Section title="Try it">
        <P>
          This is the real widget, running. Click a card to expand it. Use the{" "}
          <strong className="text-foreground">Mobile</strong> toggle to see what
          students on phones will get.
        </P>
        <div className="mt-8">
          <SpecEditor />
        </div>
      </Section>

      <Section title="Put it on the site">
        <P>
          Press <strong className="text-foreground">Copy snippet</strong>, then
          follow the four steps on the{" "}
          <Link href="/bbss" className="text-accent hover:underline">
            main widget page
          </Link>
          . Copy the snippet as-is if the content above is already correct — you
          only need the editor if you want to change the words.
        </P>
      </Section>

      <Section title="Edit the content">
        <P>
          Change anything in the panels above and the demo updates as you type.
          When it looks right, press{" "}
          <strong className="text-foreground">Copy customized widget</strong> and
          paste it into Squarespace, replacing the whole Code Block.
        </P>
        <P>
          Your edits live only in this browser tab. Refreshing loses them, and
          nothing here touches the live site — so experiment freely.{" "}
          <strong className="text-foreground">Reset to default</strong> puts
          everything back.
        </P>
      </Section>

      <Section title="What the fields mean">
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-b border-foreground/[0.15]">
                <th className="py-2.5 pr-6 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-foreground/[0.40] font-normal">
                  Field
                </th>
                <th className="py-2.5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-foreground/[0.40] font-normal">
                  What it is
                </th>
              </tr>
            </thead>
            <tbody>
              {FIELDS.map(([field, meaning]) => (
                <tr key={field} className="border-b border-foreground/[0.10]">
                  <td className="py-3 pr-6 align-top font-[family-name:var(--font-geist-sans)] text-body font-semibold text-foreground whitespace-nowrap">
                    {field}
                  </td>
                  <td className="py-3 align-top font-[family-name:var(--font-geist-sans)] text-body leading-relaxed text-foreground/[0.58]">
                    {meaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout>
          Keep the six detail labels the same across all four cards. Uniform fields
          are the whole point: students are comparing paths, and that only works if
          every card answers the same questions.
        </Callout>
      </Section>

      <Section title="A note on going stale">
        <P>
          The wording is deliberately{" "}
          <strong className="text-foreground">evergreen</strong> — no dates,
          deadlines, or academic years. That way the widget doesn&rsquo;t quietly
          become wrong every September. If you do add a deadline, put it in that
          card&rsquo;s <strong className="text-foreground">Application</strong>{" "}
          field, and put a reminder in the exec calendar to take it out again.
        </P>
      </Section>

      <details className="mt-16 border-t border-foreground/[0.10] pt-8">
        <summary className="cursor-pointer font-[family-name:var(--font-newsreader)] text-[22px] text-foreground hover:text-accent transition-colors">
          Prefer editing the code directly?
        </summary>
        <P>
          Find the block between <Mono>{"// ==== DATA START ===="}</Mono> and{" "}
          <Mono>{"// ==== DATA END ===="}</Mono> and edit it there. Each
          specialization is one object; keep <Mono>color</Mono> as{" "}
          <Mono>ACCENT.green</Mono>, <Mono>ACCENT.blue</Mono>,{" "}
          <Mono>ACCENT.orange</Mono>, or <Mono>ACCENT.pink</Mono> rather than a
          colour code, so the palette stays in one place.
        </P>
        <CodeBlock>{DATA_SHAPE}</CodeBlock>
      </details>
    </BbssPage>
  );
}
