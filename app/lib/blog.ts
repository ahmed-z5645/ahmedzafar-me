import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  description: string;
  published: boolean;
  ogImage: string;
}

export interface Post extends PostMeta {
  content: string;
}

function readPostFile(filename: string): Post | null {
  const slug = filename.replace(/\.mdx?$/, "");
  const fullPath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);

  if (!data.published) return null;

  return {
    slug,
    title: data.title ?? "Untitled",
    date: data.date ?? "",
    tags: data.tags ?? [],
    excerpt: data.excerpt ?? "",
    description: data.description ?? data.excerpt ?? "",
    published: data.published ?? false,
    ogImage: data.ogImage ?? "",
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map(readPostFile)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  const filename = fs.existsSync(mdxPath)
    ? `${slug}.mdx`
    : fs.existsSync(mdPath)
    ? `${slug}.md`
    : null;

  if (!filename) return null;
  return readPostFile(filename);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) =>
    p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}
