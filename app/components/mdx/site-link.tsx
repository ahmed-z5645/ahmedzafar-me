import Link from "next/link";

export default function SiteLink({ href, label }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="not-prose flex items-center justify-between w-full border border-foreground/[0.12] rounded px-4 py-3 font-[family-name:var(--font-geist-mono)] text-[1em] font-bold !text-foreground/[0.58] !no-underline hover:!text-accent hover:border-accent transition-colors group mt-6"
    >
      <span className="flex items-center gap-2.5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
        {label ?? "View on this site"}
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
