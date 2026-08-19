import type { ReactNode } from "react";
import Footer from "../footer/footer";

/** Single-column editorial shell shared by every /bbss page. */
export function BbssPage({
  title,
  standfirst,
  children,
}: {
  title: string;
  standfirst: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <main className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-24">
        <div className="max-w-[880px] mx-auto pt-20 pb-16 lg:pt-28 lg:pb-24">
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-foreground/[0.40]">
            BBSS Website Widgets
          </p>
          <h1 className="mt-5 font-[family-name:var(--font-newsreader)] text-[36px] sm:text-hero leading-[1.1] tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-4 font-[family-name:var(--font-newsreader)] italic text-[20px] leading-snug text-foreground/[0.58]">
            {standfirst}
          </p>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16 border-t border-foreground/[0.10] pt-10">
      <h2 className="font-[family-name:var(--font-newsreader)] text-[28px] leading-tight tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 font-[family-name:var(--font-geist-sans)] text-body leading-relaxed text-foreground/[0.58]">
      {children}
    </p>
  );
}

/** A pulled-out caution. Same type scale as body copy, marked by an accent rule
 *  rather than colour, so it survives both themes. */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 border-l-2 border-accent pl-4 font-[family-name:var(--font-geist-sans)] text-body leading-relaxed text-foreground">
      {children}
    </p>
  );
}

/** Question-and-answer pair, used by the troubleshooting sections. */
export function Troubleshoot({
  q,
  children,
}: {
  q: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6">
      <p className="font-[family-name:var(--font-geist-sans)] text-body font-semibold text-foreground">
        {q}
      </p>
      <p className="mt-1.5 font-[family-name:var(--font-geist-sans)] text-body leading-relaxed text-foreground/[0.58]">
        {children}
      </p>
    </div>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return (
    <code className="font-[family-name:var(--font-geist-mono)] text-[13px] bg-surface border border-foreground/[0.15] rounded px-1.5 py-0.5">
      {children}
    </code>
  );
}

/** Scrollable, non-wrapping code block for snippets and console output. */
export function CodeBlock({
  children,
  maxHeight = 420,
}: {
  children: string;
  maxHeight?: number;
}) {
  return (
    <pre
      className="mt-5 overflow-auto border border-foreground/[0.15] rounded bg-surface p-4 font-[family-name:var(--font-geist-mono)] text-[12px] leading-relaxed text-foreground"
      style={{ maxHeight }}
    >
      {children}
    </pre>
  );
}
