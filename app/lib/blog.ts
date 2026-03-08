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

// ─── Core logic (injectable postsDir for testability) ─────────────────────────

function readPostFile(postsDir: string, filename: string): Post | null {
  const slug = filename.replace(/\.mdx?$/, "");
  const fullPath = path.join(postsDir, filename);
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

function getAllPostsFrom(postsDir: string): PostMeta[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((f) => readPostFile(postsDir, f))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function getPostBySlugFrom(postsDir: string, slug: string): Post | null {
  const mdxPath = path.join(postsDir, `${slug}.mdx`);
  const mdPath = path.join(postsDir, `${slug}.md`);
  const filename = fs.existsSync(mdxPath)
    ? `${slug}.mdx`
    : fs.existsSync(mdPath)
    ? `${slug}.md`
    : null;

  if (!filename) return null;
  return readPostFile(postsDir, filename);
}

function getAllTagsFrom(postsDir: string): string[] {
  const posts = getAllPostsFrom(postsDir);
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

function getPostsByTagFrom(postsDir: string, tag: string): PostMeta[] {
  return getAllPostsFrom(postsDir).filter((p) =>
    p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

// ─── Public API (uses real POSTS_DIR) ─────────────────────────────────────────

export const getAllPosts = () => getAllPostsFrom(POSTS_DIR);
export const getPostBySlug = (slug: string) => getPostBySlugFrom(POSTS_DIR, slug);
export const getAllTags = () => getAllTagsFrom(POSTS_DIR);
export const getPostsByTag = (tag: string) => getPostsByTagFrom(POSTS_DIR, tag);

// ─── Test exports (injectable postsDir) ───────────────────────────────────────

export const _testGetAllPosts = getAllPostsFrom;
export const _testGetPostBySlug = getPostBySlugFrom;
export const _testGetAllTags = getAllTagsFrom;
export const _testGetPostsByTag = getPostsByTagFrom;
