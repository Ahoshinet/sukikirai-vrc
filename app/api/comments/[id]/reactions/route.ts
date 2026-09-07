import { getSessionUser } from "../../../../lib/auth";
import { toggleReaction } from "../../../../lib/mutations";
import { metaFromRequest } from "../../../../lib/request";
import { overRateLimit, rateLimited } from "../../../../lib/rate-limit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json(
      { error: "リアクションにはログインが必要です。" },
      { status: 401 },
    );
  }
  if (user.banned) {
    return Response.json({ error: "利用が制限されています。" }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json()) as { emoji?: string };
  const emoji = (body.emoji ?? "").trim();
  if (!/^[0-9a-f]{4,5}(-[0-9a-f]{4,5})*$/i.test(emoji)) {
    return Response.json({ error: "不正な絵文字です。" }, { status: 400 });
  }

  const meta = metaFromRequest(request);
  if (await overRateLimit(meta.ip, "write")) {
    return rateLimited("write");
  }

  const result = await toggleReaction({
    commentId: id,
    userId: user.id,
    emoji,
    meta,
  });

  return Response.json(result);
}
