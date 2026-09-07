import { and, eq, gte, inArray, sql } from "drizzle-orm";

import { getDb } from "../db/client";
import { actionLogs } from "../db/schema";

type Action = typeof actionLogs.$inferInsert["action"];

export const LIMITS = {
  write: {
    max: 30,
    windowSeconds: 60,
    actions: ["vote", "vote_clear", "comment", "reply", "reaction"],
  },
  register: {
    max: 10,
    windowSeconds: 600,
    actions: ["entry_create", "source_add"],
  },
  report: {
    max: 10,
    windowSeconds: 3600,
    actions: ["report"],
  },
} as const satisfies Record<
  string,
  { max: number; windowSeconds: number; actions: readonly Action[] }
>;

export type LimitKey = keyof typeof LIMITS;

export async function overRateLimit(
  ip: string,
  key: LimitKey,
): Promise<boolean> {
  if (ip === "unknown") {
    return false;
  }

  const { max, windowSeconds, actions } = LIMITS[key];
  const since = new Date(Date.now() - windowSeconds * 1000);

  try {
    const db = await getDb();
    const rows = await db
      .select({ value: sql<number>`count(*)` })
      .from(actionLogs)
      .where(
        and(
          eq(actionLogs.ip, ip),
          gte(actionLogs.createdAt, since),
          inArray(actionLogs.action, [...actions]),
        ),
      );
    return (rows[0]?.value ?? 0) >= max;
  } catch {
    return false;
  }
}

export function rateLimited(key: LimitKey): Response {
  const { windowSeconds } = LIMITS[key];
  const minutes = Math.ceil(windowSeconds / 60);
  return Response.json(
    {
      error: `操作が多すぎます。${minutes}分ほど時間をおいてから再度お試しください。`,
    },
    { status: 429, headers: { "retry-after": String(windowSeconds) } },
  );
}
