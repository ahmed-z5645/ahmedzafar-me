import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { getAllPosts, getPostBySlug } from "../../lib/blog";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Ahmed Zafar`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://ahmedzafar.me/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      ...(post.ogImage ? { images: [post.ogImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: `https://ahmedzafar.me/blog/${slug}` },
  };
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: { dark: "github-dark-dimmed", light: "github-light" },
          keepBackground: false,
        },
      ],
    ],
  },
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Person", name: "Ahmed Zafar" },
    url: `https://ahmedzafar.me/blog/${slug}`,
    ...(post.ogImage ? { image: post.ogImage } : {}),
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-[1600px] mx-auto">

        {/* NAV ROW */}
        <div className="flex justify-end p-8 lg:pt-8 lg:pr-24">
          <Header />
        </div>

        {/* POST BODY — centred reading column */}
        <article className="mx-auto max-w-[680px] px-6 pb-24">

          {/* Back link */}
          <Link
            href="/blog"
            className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-foreground/[0.40] hover:text-accent transition-colors mb-10 inline-block"
          >
            ← All posts
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag}`}
                  className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-wide text-accent hover:underline"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <h1 className="font-[family-name:var(--font-newsreader)] text-hero leading-[1.1] tracking-tight text-foreground mb-4">
              {post.title}
            </h1>
            <time className="font-[family-name:var(--font-geist-mono)] text-[11px] text-foreground/[0.40]">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </header>

          {/* MDX content */}
          <div className="prose">
            <MDXRemote
              source={post.content}
              // @ts-expect-error rehype plugin type mismatch
              options={mdxOptions}
              components={{
                Caption: ({ children }: { children: React.ReactNode }) => (
                  <span className="caption">{children}</span>
                ),
              }}
            />
          </div>
        </article>

        <Footer />
      </main>
    </div>
  );
}
