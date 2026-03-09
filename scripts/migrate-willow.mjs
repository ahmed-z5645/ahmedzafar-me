import TurndownService from "turndown";
import fs from "fs";
import path from "path";

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const FEED_URL = "https://ahmedz.willow.camp/posts/json";

// Skip posts we've already manually created or don't want
const SKIP_TITLES = ["About", "We Need to Slam CTRL-Z On The Internet"];

const td = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(dateStr) {
  return dateStr.split("T")[0];
}

const res = await fetch(FEED_URL);
const feed = await res.json();

let created = 0;
let skipped = 0;

for (const item of feed.items) {
  if (SKIP_TITLES.includes(item.title)) {
    console.log(`⏭  Skipping: ${item.title}`);
    skipped++;
    continue;
  }

  const slug = slugify(item.title);
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    console.log(`⏭  Already exists: ${slug}.mdx`);
    skipped++;
    continue;
  }

  const markdown = td.turndown(item.content_html ?? "");
  const date = formatDate(item.date_published ?? new Date().toISOString());
  const tags = item.tags ?? [];
  const excerpt = item.summary ?? markdown.split("\n").find(l => l.trim() && !l.startsWith("#"))?.slice(0, 160) ?? "";

  const frontmatter = [
    "---",
    `title: "${item.title.replace(/"/g, '\\"')}"`,
    `date: "${date}"`,
    `tags: [${tags.map(t => `"${t}"`).join(", ")}]`,
    `excerpt: "${excerpt.replace(/"/g, '\\"').slice(0, 160)}"`,
    `description: "${excerpt.replace(/"/g, '\\"').slice(0, 160)}"`,
    `published: true`,
    `ogImage: ""`,
    "---",
    "",
  ].join("\n");

  fs.writeFileSync(filePath, frontmatter + markdown);
  console.log(`✓  Created: ${slug}.mdx`);
  created++;
}

console.log(`\nDone — ${created} created, ${skipped} skipped.`);
