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

  const body = (await request.json()) as {
    targetType?: string;
    targetId?: string;
    reason?: string;
    detail?: string;
    contact?: string;
  };

  if (
    body.targetType !== "entry" &&
    body.targetType !== "comment" &&
    body.targetType !== "site"
  ) {
    return Response.json({ error: "対象が不正です。" }, { status: 400 });
  }
  if (body.targetType !== "site" && !body.targetId) {
    return Response.json({ error: "対象が指定されていません。" }, { status: 400 });
  }
  if (!body.reason || !REASONS.includes(body.reason)) {
    return Response.json({ error: "種別を選択してください。" }, { status: 400 });
  }

  await createReport({
    targetType: body.targetType,
    targetId: body.targetId ?? "-",
    reporterId: user?.id ?? null,
    reason: body.reason,
    detail: body.detail?.slice(0, 2000) ?? null,
    contact: body.contact?.slice(0, 200) ?? null,
    meta,
  });

  return Response.json({ ok: true });
}
