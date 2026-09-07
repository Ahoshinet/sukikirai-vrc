import { getSessionUser } from "../../../../lib/auth";
import { createComment, getVote } from "../../../../lib/mutations";
import {
  getComments,
  getEntryById,
  getVisibleRootComment,
  voteTrend,
} from "../../../../lib/queries";
import { metaFromRequest } from "../../../../lib/request";
import { overRateLimit, rateLimited } from "../../../../lib/rate-limit";

const MAX_LENGTH = 400;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) {
    return Response.json(
      { error: "コメントを読むにはログインと投票が必要です。" },
      { status: 401 },
    );
  }

  const vote = await getVote(id, user.id);
  if (!vote) {
    return Response.json(
      { error: "コメントは投票後に表示されます。" },
      { status: 403 },
    );
  }

  const [comments, trend] = await Promise.all([
    getComments(id, user.id),
    voteTrend(id),
  ]);
  return Response.json({ vote, comments, trend });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json(
      { error: "コメントの投稿にはログインが必要です。" },
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

  const vote = await getVote(id, user.id);
  if (!vote) {
    return Response.json(
      { error: "コメントの投稿には投票が必要です。" },
      { status: 403 },
    );
  }

  const body = (await request.json()) as {
    body?: string;
    parentId?: string | null;
  };
  const text = (body.body ?? "").trim();
  if (text === "") {
    return Response.json({ error: "本文を入力してください。" }, { status: 400 });
  }
  if (text.length > MAX_LENGTH) {
    return Response.json(
      { error: `${MAX_LENGTH}文字以内で入力してください。` },
      { status: 400 },
    );
  }

  const parentId = body.parentId ?? null;
  if (parentId && !(await getVisibleRootComment(parentId, id))) {
    return Response.json(
      { error: "返信先のコメントが見つかりません。" },
      { status: 400 },
    );
  }

  const meta = metaFromRequest(request);
  if (await overRateLimit(meta.ip, "write")) {
    return rateLimited("write");
  }

  await createComment({
    entryId: id,
    userId: user.id,
    parentId,
    stance: vote,
    body: text,
    meta,
  });

  const comments = await getComments(id, user.id);
  return Response.json({ comments });
}
