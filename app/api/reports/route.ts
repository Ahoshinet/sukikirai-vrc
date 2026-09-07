import { eq } from "drizzle-orm";

import { getDb } from "../../db/client";
import { comments, entries } from "../../db/schema";
import { getSessionUser } from "../../lib/auth";
import { createReport } from "../../lib/mutations";
import { metaFromRequest } from "../../lib/request";
import { overRateLimit, rateLimited } from "../../lib/rate-limit";

const REASONS = [
  "掲載内容の削除依頼",
  "ガイドライン違反の報告",
  "不具合の報告",
  "その他",
];

export async function POST(request: Request) {
  const user = await getSessionUser();
  const meta = metaFromRequest(request);
  if (await overRateLimit(meta.ip, "report")) {
    return rateLimited("report");
  }

  const body = (await request.json().catch(() => null)) as {
    targetType?: string;
    targetId?: string;
    reason?: string;
    detail?: string;
    contact?: string;
  } | null;

  if (!body) {
    return Response.json({ error: "不正なリクエストです。" }, { status: 400 });
  }

  if (
    body.targetType !== "entry" &&
    body.targetType !== "comment" &&
    body.targetType !== "site"
  ) {
    return Response.json({ error: "対象が不正です。" }, { status: 400 });
  }
  const targetId = body.targetId?.trim() ?? "";
  if (body.targetType !== "site" && targetId === "") {
    return Response.json({ error: "対象が指定されていません。" }, { status: 400 });
  }
  if (!body.reason || !REASONS.includes(body.reason)) {
    return Response.json({ error: "種別を選択してください。" }, { status: 400 });
  }

  if (body.targetType !== "site") {
    const db = await getDb();
    const rows =
      body.targetType === "entry"
        ? await db
            .select({ id: entries.id })
            .from(entries)
            .where(eq(entries.id, targetId))
            .limit(1)
        : await db
            .select({ id: comments.id })
            .from(comments)
            .where(eq(comments.id, targetId))
            .limit(1);
    if (rows.length === 0) {
      return Response.json({ error: "対象が見つかりません。" }, { status: 404 });
    }
  }

  await createReport({
    targetType: body.targetType,
    targetId: body.targetType === "site" ? "-" : targetId,
    reporterId: user?.id ?? null,
    reason: body.reason,
    detail: typeof body.detail === "string" ? body.detail.slice(0, 2000) : null,
    contact:
      typeof body.contact === "string" ? body.contact.slice(0, 200) : null,
    meta,
  });

  return Response.json({ ok: true });
}
