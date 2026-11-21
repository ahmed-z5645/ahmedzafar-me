import { NextResponse } from "next/server";

// Hands the Mapbox *public* (pk.) token to the static /oec page at runtime, so the
// token lives in Vercel env (MAPBOX_TOKEN) rather than in the committed bundle.
// It is still visible to browsers by design — restrict it to ahmedzafar.ca in
// the Mapbox dashboard (URL restrictions).
export async function GET() {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "MAPBOX_TOKEN is not set" }, { status: 500 });
  }
  return NextResponse.json(
    { token },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
  );
}
