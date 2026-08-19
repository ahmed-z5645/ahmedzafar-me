import type { ReactNode } from "react";

export type Step = { title: string; body?: ReactNode };

/** Numbered instruction list. Shared so every "do this, then this" sequence on the
 *  BBSS pages is numbered and spaced identically. */
export default function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="mt-6 space-y-5">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4">
          <span
            aria-hidden
            className="font-[family-name:var(--font-geist-mono)] text-[12px] text-foreground/[0.40] pt-[3px] shrink-0 w-5"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="font-[family-name:var(--font-geist-sans)] text-body text-foreground">
            <span className="font-semibold">{step.title}</span>
            {step.body && (
              <span className="text-foreground/[0.58]"> {step.body}</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
