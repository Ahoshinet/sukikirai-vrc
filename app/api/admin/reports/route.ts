import { getAdminUser, resolveReport } from "../../../lib/admin";
import { log } from "../../../lib/mutations";
import { metaFromRequest } from "../../../lib/request";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return Response.json({ error: "権限がありません。" }, { status: 403 });
  }

  const body = (await request.json()) as {
    reportId?: string;
    action?: string;
  };

  if (!body.reportId) {
    return Response.json({ error: "IDが必要です。" }, { status: 400 });
  }
  if (body.action !== "hide" && body.action !== "reject") {
    return Response.json({ error: "操作が不正です。" }, { status: 400 });
  }

  await resolveReport(body.reportId, body.action);
  await log(
    admin.id,
    body.action === "hide" ? "moderate_hide" : "moderate_reject",
    "report",
    body.reportId,
    metaFromRequest(request),
  );

  return Response.json({ ok: true });
}
