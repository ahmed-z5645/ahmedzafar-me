import Link from "next/link";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { getAllPosts, getAllTags } from "../lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Ahmed Zafar",
  description: "Writing on engineering, music, and everything in between.",
  openGraph: {
    title: "Blog — Ahmed Zafar",
    description: "Writing on engineering, music, and everything in between.",
    url: "https://ahmedzafar.me/blog",
  },
  alternates: { canonical: "https://ahmedzafar.me/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="min-h-screen">
      <main className="max-w-[1600px] mx-auto">

        {/* TOP — 40/60 split */}
        <div className="flex flex-col lg:flex-row">

          {/* LEFT */}
          <div className="lg:w-[40%] flex flex-col p-8 pb-0 lg:pt-9 lg:pb-12 lg:pl-24 lg:pr-12">
            <p className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]">
              ISSUE 03 | BLOG
            </p>
            <div className="mt-8 lg:mt-18">
              <h1 className="hero-title-group font-[family-name:var(--font-newsreader)] text-hero leading-[1.1] tracking-tight text-foreground mb-2">
                Things worth <span className="italic wipe-word wipe-1">writing.</span>
              </h1>
              <p className="text-body text-foreground/[0.58]">
                Occasional writing on engineering, music, food, and whatever else is on my mind.
              </p>
            </div>

            {/* Tag cloud */}
            {tags.length > 0 && (
              <div className="mt-10 border-t border-foreground/[0.10] pt-6">
                <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-foreground/[0.40] mb-4">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag}`}
                      className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wide text-foreground/[0.58] border border-foreground/[0.15] px-2.5 py-1 rounded hover:text-accent hover:border-accent transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:w-[60%] p-8 lg:pt-8 lg:pr-24 lg:pl-12 flex flex-col">
            <Header />

            {posts.length === 0 ? (
              <p className="text-body text-foreground/[0.40] mt-8">No posts yet.</p>
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
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wide text-accent"
                            >
                              {tag}
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
