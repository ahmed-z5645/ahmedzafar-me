import type { Spec } from "./spec-defaults";

// These must match the snippet byte for byte, leading two spaces included.
export const START_MARKER = "  // ==== DATA START ====";
export const END_MARKER = "  // ==== DATA END ====";

/** Emit a JS single-quoted string literal. The `</` escape matters: without it a
 *  user typing "</script>" into a field would terminate the widget's own script
 *  tag when the snippet is pasted into Squarespace. */
export function jsString(value: string): string {
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r\n?/g, "\n")
    .replace(/\n/g, "\\n")
    .replace(/<\//g, "<\\/");
  return `'${escaped}'`;
}

export function serializeData(specs: Spec[]): string {
  const cards = specs
    .map((spec) => {
      const details = spec.details
        .map(
          (d) =>
            `        { label: ${jsString(d.label)}, value: ${jsString(d.value)} }`,
        )
        .join(",\n");
      return [
        "    {",
        `      name: ${jsString(spec.name)},`,
        `      gate: ${jsString(spec.gate)},`,
        `      color: ACCENT.${spec.color},`,
        "      details: [",
        details,
        "      ]",
        "    }",
      ].join("\n");
    })
    .join(",\n");
  return `  var DATA = [\n${cards}\n  ];\n`;
}

/** Replace the snippet's DATA block in place. Throws rather than degrading, so a
 *  marker rename upstream surfaces here instead of silently shipping stale copy. */
export function spliceSnippet(raw: string, dataSource: string): string {
  const start = raw.indexOf(START_MARKER);
  const end = raw.indexOf(END_MARKER);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("DATA markers not found in the snippet.");
  }
  if (
    raw.indexOf(START_MARKER, start + START_MARKER.length) !== -1 ||
    raw.indexOf(END_MARKER, end + END_MARKER.length) !== -1
  ) {
    throw new Error("DATA markers appear more than once in the snippet.");
  }
  return raw.slice(0, start) + START_MARKER + "\n" + dataSource + raw.slice(end);
}
