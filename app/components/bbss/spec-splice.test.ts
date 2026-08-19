import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { serializeData, spliceSnippet, START_MARKER, END_MARKER } from "./spec-splice";
import { DEFAULT_SPECS, type Spec } from "./spec-defaults";

const SNIPPET = fs.readFileSync(
  path.join(process.cwd(), "public/bbss/snippets/biochem-specializations.html"),
  "utf8",
);

/** Re-run the widget's own DATA block the way the browser would, so the tests
 *  assert on real evaluated content rather than on generated text. */
function evalData(snippet: string) {
  const start = snippet.indexOf(START_MARKER);
  const end = snippet.indexOf(END_MARKER);
  const block = snippet.slice(start + START_MARKER.length, end);
  const ACCENT = { green: "green", blue: "blue", orange: "orange", pink: "pink" };
  return new Function("ACCENT", `${block}; return DATA;`)(ACCENT) as Spec[];
}

describe("spec splice", () => {
  it("round-trips the shipped defaults unchanged", () => {
    const out = spliceSnippet(SNIPPET, serializeData(DEFAULT_SPECS));
    expect(evalData(out)).toEqual(DEFAULT_SPECS);
  });

  it("leaves everything outside the markers byte-identical", () => {
    const out = spliceSnippet(SNIPPET, serializeData(DEFAULT_SPECS));
    const head = (s: string) => s.slice(0, s.indexOf(START_MARKER));
    const tail = (s: string) => s.slice(s.indexOf(END_MARKER));
    expect(head(out)).toBe(head(SNIPPET));
    expect(tail(out)).toBe(tail(SNIPPET));
  });

  it("keeps colours as ACCENT identifiers, never hex", () => {
    const source = serializeData(DEFAULT_SPECS);
    expect(source).toContain("color: ACCENT.green");
    expect(source).not.toContain("#8AB976");
  });

  it("survives apostrophes, angle brackets, and a script tag in a field", () => {
    const hostile = "Ahmed's ⟨<script>alert(1)</script>⟩ \\ path — 5% ’quoted’";
    const specs = structuredClone(DEFAULT_SPECS);
    specs[0].details[0].value = hostile;
    specs[0].name = "It's <b>bold</b>";

    const out = spliceSnippet(SNIPPET, serializeData(specs));
    // The literal "</script>" must never reach the HTML parser intact, or the
    // widget's own <script> would be terminated early once pasted.
    expect(out.slice(out.indexOf(START_MARKER), out.indexOf(END_MARKER)))
      .not.toContain("</script>");

    const data = evalData(out);
    expect(data[0].details[0].value).toBe(hostile);
    expect(data[0].name).toBe("It's <b>bold</b>");
    expect(data[1]).toEqual(DEFAULT_SPECS[1]);
  });

  it("still produces one parseable <script> block after hostile input", () => {
    const specs = structuredClone(DEFAULT_SPECS);
    specs[0].name = "It's </script><script>alert(1)</script>";
    specs[0].details[0].value = "back\\slash and 'quotes'";
    const out = spliceSnippet(SNIPPET, serializeData(specs));

    const bodies = [...out.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
      (m) => m[1],
    );
    expect(bodies).toHaveLength(1);
    expect(() => new vm.Script(bodies[0])).not.toThrow();
  });

  it("preserves newlines typed into a textarea", () => {
    const specs = structuredClone(DEFAULT_SPECS);
    specs[2].details[3].value = "line one\r\nline two\nline three";
    const data = evalData(spliceSnippet(SNIPPET, serializeData(specs)));
    expect(data[2].details[3].value).toBe("line one\nline two\nline three");
  });

  it("throws loudly when the markers are missing", () => {
    expect(() => spliceSnippet("no markers here", "  var DATA = [];\n")).toThrow(
      /markers not found/,
    );
  });

  it("throws when the markers appear more than once", () => {
    expect(() => spliceSnippet(SNIPPET + SNIPPET, "  var DATA = [];\n")).toThrow(
      /more than once/,
    );
  });
});
