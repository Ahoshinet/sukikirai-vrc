import { getEntryById } from "../../../lib/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const entry = await getEntryById(id);

  if (!entry?.imageUrl) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      location: entry.imageUrl,
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
