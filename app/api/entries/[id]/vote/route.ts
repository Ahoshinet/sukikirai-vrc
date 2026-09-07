import { getSessionUser } from "../../../../lib/auth";
import { castVote, clearVote, getVote } from "../../../../lib/mutations";
import { getEntryById } from "../../../../lib/queries";
import { metaFromRequest } from "../../../../lib/request";
import { overRateLimit, rateLimited } from "../../../../lib/rate-limit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json(
      { error: "投票にはログインが必要です。" },
      { status: 401 },
    );
  }
  if (user.banned) {
    return Response.json({ error: "利用が制限されています。" }, { status: 403 });
  }

  const { id } = await params;
  const entry = await getEntryById(id);
  if (!entry) {
    return Response.json({ error: "対象が見つかりません。" }, { status: 404 });
  }

  const body = (await request.json()) as { stance?: string };
  const meta = metaFromRequest(request);
  if (await overRateLimit(meta.ip, "write")) {
    return rateLimited("write");
  }

  if (body.stance === "clear") {
    await clearVote({ entryId: id, userId: user.id, meta });
  } else if (body.stance === "suki" || body.stance === "kirai") {
    await castVote({ entryId: id, userId: user.id, stance: body.stance, meta });
  } else {
    return Response.json({ error: "不正な値です。" }, { status: 400 });
  }

  const [updated, vote] = await Promise.all([
    getEntryById(id),
    getVote(id, user.id),
  ]);

  return Response.json({
    vote,
    suki: updated?.suki ?? 0,
    kirai: updated?.kirai ?? 0,
    comments: updated?.comments ?? 0,
  });
}
