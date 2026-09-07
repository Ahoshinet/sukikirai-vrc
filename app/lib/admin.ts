import { and, desc, eq } from "drizzle-orm";

import { getDb, getEnv } from "../db/client";
import { account, comments, entries, reports } from "../db/schema";
import { getSessionUser } from "./auth";

export interface AdminUser {
  id: string;
  name: string;
  discordId: string;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const env = await getEnv();
  const allowed = (env.ADMIN_DISCORD_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value !== "");

  if (allowed.length === 0) {
    return null;
  }

  const user = await getSessionUser();
  if (!user || user.banned) {
    return null;
  }

  const db = await getDb();
  const rows = await db
    .select({ accountId: account.accountId })
    .from(account)
    .where(and(eq(account.userId, user.id), eq(account.providerId, "discord")))
    .limit(1);

  const discordId = rows[0]?.accountId;
  if (!discordId || !allowed.includes(discordId)) {
    return null;
  }

  return { id: user.id, name: user.name, discordId };
}

export interface ReportRow {
  id: string;
  targetType: "entry" | "comment" | "site";
  targetId: string;
  reason: string;
  detail: string | null;
  contact: string | null;
  ip: string | null;
  status: "open" | "resolved" | "rejected";
  createdAt: string;
  targetName: string | null;
  targetBody: string | null;
  targetHref: string | null;
}

export async function listReports(
  status: "open" | "resolved" | "rejected",
): Promise<ReportRow[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(reports)
    .where(eq(reports.status, status))
    .orderBy(desc(reports.createdAt))
    .limit(100);

  return Promise.all(
    rows.map(async (row) => {
      let targetName: string | null = null;
      let targetBody: string | null = null;
      let targetHref: string | null = null;

      if (row.targetType === "site") {
        targetName = "サイト全体へのお問い合わせ";
      } else if (row.targetType === "entry") {
        const found = await db
          .select({ name: entries.name, slug: entries.slug, category: entries.category })
          .from(entries)
          .where(eq(entries.id, row.targetId))
          .limit(1);
        if (found[0]) {
          targetName = found[0].name;
          targetHref = `/${found[0].category}s/${found[0].slug}`;
        }
      } else {
        const found = await db
          .select({ body: comments.body, entryId: comments.entryId })
          .from(comments)
          .where(eq(comments.id, row.targetId))
          .limit(1);
        if (found[0]) {
          targetBody = found[0].body;
        }
      }

      return {
        id: row.id,
        targetType: row.targetType,
        targetId: row.targetId,
        reason: row.reason,
        detail: row.detail,
        contact: row.contact,
        ip: row.ip,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        targetName,
        targetBody,
        targetHref,
      };
    }),
  );
}

export async function resolveReport(
  reportId: string,
  action: "hide" | "reject",
): Promise<void> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(reports)
    .where(eq(reports.id, reportId))
    .limit(1);
  const report = rows[0];
  if (!report) {
    return;
  }

  if (action === "reject") {
    await db
      .update(reports)
      .set({ status: "rejected" })
      .where(eq(reports.id, reportId));
    return;
  }

  const hideTarget =
    report.targetType === "entry"
      ? db
          .update(entries)
          .set({ status: "hidden" })
          .where(eq(entries.id, report.targetId))
      : db
          .update(comments)
          .set({ status: "hidden" })
          .where(eq(comments.id, report.targetId));

  await db.batch([
    hideTarget,
    db
      .update(reports)
      .set({ status: "resolved" })
      .where(and(eq(reports.id, reportId), eq(reports.status, "open"))),
  ]);
}
