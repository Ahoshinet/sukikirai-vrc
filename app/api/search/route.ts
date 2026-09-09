import { searchEntries } from "../../lib/queries";
import { PAGE_SIZE } from "../../components/PaginationNav";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);

  if (query === "") {
    return Response.json({ items: [], total: 0, page });
  }

  const { items, total } = await searchEntries(
    query,
    PAGE_SIZE,
    (page - 1) * PAGE_SIZE,
  );

  return Response.json(
    { items, total, page },
    { headers: { "cache-control": "public, max-age=30" } },
  );
}
