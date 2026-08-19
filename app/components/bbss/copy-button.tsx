"use client";

import { useRef, useState } from "react";

type Status = "idle" | "copied" | "manual";

export default function CopyButton({
  text,
  label = "Copy snippet",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const manualRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function flashCopied() {
    setStatus("copied");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  // Three tiers, because a silent copy failure is the worst outcome here: the
  // exec walks away believing they have the snippet and pastes something stale.
  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        flashCopied();
        return;
      }
    } catch {
      /* fall through to execCommand */
    }

    try {
      const scratch = document.createElement("textarea");
      scratch.value = text;
      scratch.setAttribute("readonly", "");
      scratch.style.position = "fixed";
      scratch.style.opacity = "0";
      document.body.appendChild(scratch);
      scratch.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(scratch);
      if (ok) {
        flashCopied();
        return;
      }
    } catch {
      /* fall through to manual */
    }

    setStatus("manual");
    requestAnimationFrame(() => manualRef.current?.select());
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={copy}
        className="font-[family-name:var(--font-geist-mono)] text-body border border-foreground/[0.15] rounded px-4 py-2 text-foreground hover:text-accent hover:border-accent transition-colors"
      >
        {status === "copied"
          ? "Copied ✓"
          : status === "manual"
            ? "Press ⌘C to copy"
            : label}
      </button>

      {status === "manual" && (
        <textarea
          ref={manualRef}
          readOnly
          value={text}
          aria-label={`${label} — select and copy manually`}
          className="mt-3 w-full h-40 font-[family-name:var(--font-geist-mono)] text-[12px] leading-relaxed border border-foreground/[0.15] rounded p-3 bg-surface text-foreground"
        />
      )}
    </div>
  );
}
