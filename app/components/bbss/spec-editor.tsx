"use client";

import { useEffect, useMemo, useState } from "react";
import CopyButton from "./copy-button";
import WidgetPreview from "./widget-preview";
import {
  ACCENT_COLORS,
  DEFAULT_SPECS,
  type AccentKey,
  type Spec,
} from "./spec-defaults";
import { serializeData, spliceSnippet } from "./spec-splice";

const SRC = "/bbss/snippets/biochem-specializations.html";

const inputClass =
  "w-full font-[family-name:var(--font-geist-sans)] text-body bg-surface text-foreground border border-foreground/[0.15] rounded px-3 py-2 focus:outline-none focus:border-accent transition-colors";

const labelClass =
  "block font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-foreground/[0.40] mb-1.5";

export default function SpecEditor() {
  const [specs, setSpecs] = useState<Spec[]>(() =>
    structuredClone(DEFAULT_SPECS),
  );
  const [debounced, setDebounced] = useState<Spec[]>(specs);
  const [raw, setRaw] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(specs), 300);
    return () => clearTimeout(t);
  }, [specs]);

  useEffect(() => {
    let cancelled = false;
    fetch(SRC)
      .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
      .then((text) => {
        if (!cancelled) setRaw(text);
      })
      .catch(() => {
        /* WidgetPreview renders its own fallback for a missing snippet. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { code, error } = useMemo(() => {
    if (raw === null) return { code: undefined, error: null as string | null };
    try {
      return {
        code: spliceSnippet(raw, serializeData(debounced)),
        error: null as string | null,
      };
    } catch (e) {
      return { code: undefined, error: (e as Error).message };
    }
  }, [raw, debounced]);

  function update(index: number, patch: Partial<Spec>) {
    setSpecs((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  }

  function updateDetail(index: number, detailIndex: number, value: string) {
    setSpecs((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              details: s.details.map((d, j) =>
                j === detailIndex ? { ...d, value } : d,
              ),
            }
          : s,
      ),
    );
  }

  return (
    <div>
      <WidgetPreview
        src={SRC}
        title="Biochemistry Specializations demo"
        overrideCode={code}
        copyLabel={code ? "Copy customized widget" : "Copy snippet"}
      />

      {error && (
        <p className="mt-4 border border-foreground/[0.15] rounded p-4 font-[family-name:var(--font-geist-sans)] text-body text-foreground">
          The editor couldn&rsquo;t rebuild the snippet ({error}) — the widget code
          has changed shape upstream. Use the unedited snippet for now and let
          whoever maintains these widgets know.
        </p>
      )}

      <div className="mt-10 space-y-3">
        {specs.map((spec, i) => (
          <details
            key={i}
            className="border border-foreground/[0.15] rounded overflow-hidden"
          >
            <summary className="cursor-pointer select-none px-4 py-3 flex items-center gap-3 font-[family-name:var(--font-geist-sans)] text-body text-foreground">
              <span
                aria-hidden
                className="w-3 h-3 rounded-full shrink-0"
                style={{
                  background:
                    ACCENT_COLORS.find((c) => c.key === spec.color)?.hex ??
                    "#8AB976",
                }}
              />
              {spec.name || "(untitled specialization)"}
            </summary>

            <div className="px-4 pb-5 pt-1 space-y-5 border-t border-foreground/[0.10]">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor={`name-${i}`}>
                    Name
                  </label>
                  <input
                    id={`name-${i}`}
                    className={inputClass}
                    value={spec.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`gate-${i}`}>
                    Badge
                  </label>
                  <input
                    id={`gate-${i}`}
                    className={inputClass}
                    value={spec.gate}
                    onChange={(e) => update(i, { gate: e.target.value })}
                  />
                </div>
              </div>

              <fieldset>
                <legend className={labelClass}>Colour</legend>
                <div className="flex flex-wrap gap-4">
                  {ACCENT_COLORS.map((c) => (
                    <label
                      key={c.key}
                      className="flex items-center gap-2 cursor-pointer font-[family-name:var(--font-geist-sans)] text-body text-foreground/[0.58]"
                    >
                      <input
                        type="radio"
                        name={`color-${i}`}
                        className="accent-accent"
                        checked={spec.color === c.key}
                        onChange={() =>
                          update(i, { color: c.key as AccentKey })
                        }
                      />
                      <span
                        aria-hidden
                        className="w-4 h-4 rounded-full border border-black/10"
                        style={{ background: c.hex }}
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {spec.details.map((detail, j) => (
                <div key={detail.label}>
                  <label className={labelClass} htmlFor={`d-${i}-${j}`}>
                    {detail.label}
                  </label>
                  <textarea
                    id={`d-${i}-${j}`}
                    rows={2}
                    className={`${inputClass} resize-y`}
                    value={detail.value}
                    onChange={(e) => updateDetail(i, j, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-start gap-3">
        {code && <CopyButton text={code} label="Copy customized widget" />}
        <button
          type="button"
          onClick={() => setSpecs(structuredClone(DEFAULT_SPECS))}
          className="font-[family-name:var(--font-geist-mono)] text-body border border-foreground/[0.15] rounded px-4 py-2 text-foreground/[0.58] hover:text-accent hover:border-accent transition-colors"
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}
