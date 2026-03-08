import Link from "next/link";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import { getAllTags, getPostsByTag } from "../../../lib/blog";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} — Ahmed Zafar`,
    description: `All posts tagged "${tag}".`,
    alternates: { canonical: `https://ahmedzafar.me/blog/tag/${tag}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <div className="min-h-screen">
      <main className="max-w-[1600px] mx-auto">

        <div className="flex flex-col lg:flex-row">

          {/* LEFT */}
          <div className="lg:w-[40%] flex flex-col p-8 pb-0 lg:pt-9 lg:pb-12 lg:pl-24 lg:pr-12">
            <p className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]">
              ISSUE 03 | BLOG
            </p>
            <div className="mt-8 lg:mt-18">
              <h1 className="font-[family-name:var(--font-newsreader)] text-hero leading-[1.1] tracking-tight text-foreground mb-2">
                <span className="text-foreground/[0.35]">#</span>{tag}
              </h1>
              <p className="text-body text-foreground/[0.58]">
                {posts.length} {posts.length === 1 ? "post" : "posts"} tagged with this.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/blog"
                className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-foreground/[0.40] hover:text-accent transition-colors"
              >
                ← All posts
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:w-[60%] p-8 lg:pt-8 lg:pr-24 lg:pl-12 flex flex-col">
            <Header />

            {posts.length === 0 ? (
              <p className="text-body text-foreground/[0.40] mt-8">No posts with this tag.</p>
            ) : (
              <ul className="divide-y divide-foreground/[0.08]">
                {posts.map((post) => (
                  <li key={post.slug} className="group py-6 first:pt-0">
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="flex items-baseline justify-between gap-4 mb-1">
                        <h2 className="font-[family-name:var(--font-newsreader)] text-card text-foreground group-hover:text-accent transition-colors leading-snug">
                          {post.title}
                        </h2>
                        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-foreground/[0.40] shrink-0">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {post.excerpt && (
                        <p className="text-body text-foreground/[0.58] leading-relaxed mb-2">
                          {post.excerpt}
                        </p>
                      )}
                      {post.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className={`font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wide ${t === tag ? "text-accent" : "text-foreground/[0.40]"}`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
