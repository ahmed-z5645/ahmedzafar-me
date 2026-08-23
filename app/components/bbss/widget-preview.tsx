"use client";

import { useEffect, useRef, useState } from "react";
import CopyButton from "./copy-button";

const MIN_HEIGHT = 240;

/** The minimal page shell a snippet gets dropped into — the closest analogue to a
 *  Squarespace Code Block we can build. The ResizeObserver reports the rendered
 *  height back out so the frame grows when a card expands instead of clipping. */
function buildSrcDoc(code: string) {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;padding:16px;background:#fff;color:#242636;
font-family:-apple-system,system-ui,sans-serif;}</style></head><body>
${code}
<script>
// Held on window on purpose: an observer with no reference of its own can be
// garbage-collected after its first callback, which leaves the frame stuck at
// whatever height the widget happened to have while it was still loading.
window.__bbssResizeObserver = new ResizeObserver(function(){
  // Measured from the content itself, not documentElement.scrollHeight: that
  // never falls below the frame's own height, so a frame sized for the month
  // grid could never shrink back down for the much shorter agenda view.
  parent.postMessage({
    bbssHeight: document.body.getBoundingClientRect().bottom + 16
  }, '*');
});
window.__bbssResizeObserver.observe(document.body);
<\/script></body></html>`;
}

/** Points the snippet's custom element at a path on whatever origin is serving
 *  this page, for the preview frame only — the copied snippet keeps the
 *  production endpoint baked into it. Without this the demo on a dev server or a
 *  preview deployment fetches production, and reports "unable to load" whenever
 *  production is down or not yet deployed. */
function withPreviewEndpoint(code: string, path: string) {
  if (typeof window === "undefined") return code;
  const endpoint = new URL(path, window.location.origin).href;
  return code.replace(
    /<(bbss-[a-z0-9-]+)((?:\s[^>]*)?)>/i,
    (_match, tag, attrs) => `<${tag}${attrs} endpoint="${endpoint}">`
  );
}

export default function WidgetPreview({
  src,
  title,
  overrideCode,
  previewEndpoint,
  copyLabel = "Copy snippet",
}: {
  src: string;
  title: string;
  overrideCode?: string;
  /** Same-origin path the preview should fetch from instead of the snippet's
   *  hardcoded production endpoint, e.g. "/api/bbss-events". */
  previewEndpoint?: string;
  copyLabel?: string;
}) {
  // Keyed by src so a changed src invalidates the previous result without a
  // synchronous state reset inside the effect.
  const [result, setResult] = useState<{
    src: string;
    text: string | null;
  } | null>(null);
  const [mobile, setMobile] = useState(false);
  const [height, setHeight] = useState(MIN_HEIGHT);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setResult({ src, text });
      })
      .catch(() => {
        if (!cancelled) setResult({ src, text: null });
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Only trust our own frame; other embeds on the page must not resize it.
      if (e.source !== frameRef.current?.contentWindow) return;
      const h = (e.data as { bbssHeight?: unknown })?.bbssHeight;
      if (typeof h === "number" && Number.isFinite(h)) {
        setHeight(Math.max(MIN_HEIGHT, Math.ceil(h)));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const current = result?.src === src ? result : null;
  const failed = current !== null && current.text === null;
  const code = overrideCode ?? current?.text ?? null;
  // Shown in the frame; `code` is what Copy snippet hands over, unchanged.
  const frameCode =
    code !== null && previewEndpoint
      ? withPreviewEndpoint(code, previewEndpoint)
      : code;

  if (failed && overrideCode === undefined) {
    return (
      <div className="border border-foreground/[0.15] rounded p-6 text-body text-foreground/[0.58] font-[family-name:var(--font-geist-sans)]">
        Couldn&rsquo;t load the widget preview. The snippet is still available on{" "}
        <a
          href="https://github.com/ahmed-z5645/BBSS-website-widgets"
          className="text-accent hover:underline"
        >
          GitHub
        </a>
        .
      </div>
    );
  }

  const toggleClass = (active: boolean) =>
    `font-[family-name:var(--font-geist-mono)] text-[12px] uppercase tracking-wide px-3 py-1.5 rounded border transition-colors ${
      active
        ? "text-accent border-accent"
        : "text-foreground/[0.58] border-foreground/[0.15] hover:text-accent hover:border-accent"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMobile(false)}
          aria-pressed={!mobile}
          className={toggleClass(!mobile)}
        >
          Desktop
        </button>
        <button
          type="button"
          onClick={() => setMobile(true)}
          aria-pressed={mobile}
          className={toggleClass(mobile)}
        >
          Mobile (375px)
        </button>
      </div>

      <div className="border border-foreground/[0.15] rounded overflow-hidden bg-white">
        <div
          className="mx-auto transition-[max-width] duration-200"
          style={{ maxWidth: mobile ? 375 : "100%" }}
        >
          {frameCode === null ? (
            <div
              style={{ height: MIN_HEIGHT }}
              className="flex items-center justify-center font-[family-name:var(--font-geist-mono)] text-[12px] text-[#242636]/60"
            >
              Loading demo…
            </div>
          ) : (
            <iframe
              ref={frameRef}
              title={title}
              srcDoc={buildSrcDoc(frameCode)}
              sandbox="allow-scripts"
              className="w-full block border-0"
              style={{ height }}
            />
          )}
        </div>
      </div>

      <p className="mt-3 font-[family-name:var(--font-geist-sans)] text-body text-foreground/[0.58]">
        Shown on a white background because that&rsquo;s what these widgets are
        designed for on the BBSS site — they follow the page they&rsquo;re pasted
        into and have no dark mode of their own.
      </p>

      {code !== null && (
        <CopyButton text={code} label={copyLabel} className="mt-4" />
      )}
    </div>
  );
}
