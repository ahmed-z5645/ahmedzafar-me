import type { Metadata } from "next";
import BBSSEventsAdmin from "../../components/bbss-events-admin";

export const metadata: Metadata = {
  title: "BBSS Events Admin",
  robots: { index: false, follow: false },
};

export default function BBSSEventsAdminPage() {
  return (
    <main className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-24 pt-16 sm:pt-20 pb-20">
      <h1 className="text-[28px] font-semibold mb-8 max-w-[720px] mx-auto">
        BBSS Events
      </h1>
      <BBSSEventsAdmin />
    </main>
  );
}
