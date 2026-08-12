import { DynaPuff, Nunito } from "next/font/google";

/** Scoped to /camping — these two fonts don't load anywhere else on the site. */
const dynaPuff = DynaPuff({
  variable: "--font-dynapuff",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export default function CampingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${dynaPuff.variable} ${nunito.variable} camping-theme bg-background text-foreground min-h-screen font-[family-name:var(--font-nunito)]`}
    >
      {children}
    </div>
  );
}
