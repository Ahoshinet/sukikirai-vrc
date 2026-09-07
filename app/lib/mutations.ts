import { and, eq, sql } from "drizzle-orm";

import { getDb, getEnv } from "../db/client";
import {
  actionLogs,
  commentReactions,
  comments as commentsTable,
  entries,
  entrySources,
  reports,
  voteEvents,
  votes,
} from "../db/schema";
import type { CategoryKey, Stance } from "./categories";
import { anonLabel, newId, newSlug } from "./ids";
import type { RequestMeta } from "./request";

type Action = typeof actionLogs.$inferInsert["action"];

export async function log(
  userId: string | null,
  action: Action,
  targetType: string | null,
  targetId: string | null,
  meta: RequestMeta,
): Promise<void> {
  const db = await getDb();
  await db.insert(actionLogs).values({
    id: newId(),
    userId,
    action,
    targetType,
    targetId,
    ip: meta.ip,
    userAgent: meta.userAgent,
    country: meta.country,
    createdAt: new Date(),
  });
}

export async function createEntry(input: {
  category: CategoryKey;
  name: string;
  imageUrl: string | null;
  source: "x" | "vrchat" | "booth";
  sourceId: string;
  sourceUrl: string;
  userId: string;
  meta: RequestMeta;
}): Promise<{ id: string; slug: string }> {
  const db = await getDb();
  const id = newId();
  const slug = newSlug();
  const now = new Date();

  await db.batch([
    db.insert(entries).values({
      id,
      slug,
      category: input.category,
      name: input.name,
      imageUrl: input.imageUrl,
      createdBy: input.userId,
      createdIp: input.meta.ip,
      createdUa: input.meta.userAgent,
      createdAt: now,
      updatedAt: now,
    }),
    db.insert(entrySources).values({
      entryId: id,
      source: input.source,
      sourceId: input.sourceId,
      sourceUrl: input.sourceUrl,
    }),
    db.insert(actionLogs).values({
      id: newId(),
      userId: input.userId,
      action: "entry_create",
      targetType: "entry",
      targetId: id,
      ip: input.meta.ip,
      userAgent: input.meta.userAgent,
      country: input.meta.country,
      createdAt: now,
    }),
  ]);

  return { id, slug };
}

export async function addEntrySource(input: {
  entryId: string;
  source: "x" | "vrchat" | "booth";
  sourceId: string;
  sourceUrl: string;
  imageUrl: string | null;
  applyIcon: boolean;
  userId: string;
  meta: RequestMeta;
}): Promise<void> {
  const db = await getDb();
  const now = new Date();

  const addSource = db.insert(entrySources).values({
    entryId: input.entryId,
    source: input.source,
    sourceId: input.sourceId,
    sourceUrl: input.sourceUrl,
  });

  const writeLog = db.insert(actionLogs).values({
    id: newId(),
    userId: input.userId,
    action: "source_add",
    targetType: "entry",
    targetId: input.entryId,
    ip: input.meta.ip,
    userAgent: input.meta.userAgent,
    country: input.meta.country,
    createdAt: now,
  });

  if (input.applyIcon && input.imageUrl) {
    await db.batch([
      addSource,
      db
        .update(entries)
        .set({ imageUrl: input.imageUrl, updatedAt: now })
        .where(eq(entries.id, input.entryId)),
      writeLog,
    ]);
    return;
  }

  await db.batch([addSource, writeLog]);
}

export async function getVote(
  entryId: string,
  userId: string,
): Promise<Stance | null> {
  const db = await getDb();
  const rows = await db
    .select({ stance: votes.stance })
    .from(votes)
    .where(and(eq(votes.entryId, entryId), eq(votes.userId, userId)))
    .limit(1);
  return (rows[0]?.stance as Stance | undefined) ?? null;
}

export async function castVote(input: {
  entryId: string;
  userId: string;
  stance: Stance;
  meta: RequestMeta;
}): Promise<void> {
  const db = await getDb();
  const previous = await getVote(input.entryId, input.userId);
  if (previous === input.stance) {
    return;
  }

  const now = new Date();
  const previousSuki = sql<number>`coalesce((select case when stance = 'suki' then 1 else 0 end from votes where entry_id = ${input.entryId} and user_id = ${input.userId} limit 1), 0)`;
  const previousKirai = sql<number>`coalesce((select case when stance = 'kirai' then 1 else 0 end from votes where entry_id = ${input.entryId} and user_id = ${input.userId} limit 1), 0)`;

  await db.batch([
    db
      .update(entries)
      .set({
        sukiCount: sql`${entries.sukiCount} + ${input.stance === "suki" ? 1 : 0} - ${previousSuki}`,
        kiraiCount: sql`${entries.kiraiCount} + ${input.stance === "kirai" ? 1 : 0} - ${previousKirai}`,
        totalCount: sql`${entries.totalCount} + 1 - ${previousSuki} - ${previousKirai}`,
        updatedAt: now,
      })
      .where(eq(entries.id, input.entryId)),
    db
      .insert(votes)
      .values({
        entryId: input.entryId,
        userId: input.userId,
        stance: input.stance,
        ip: input.meta.ip,
        userAgent: input.meta.userAgent,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [votes.entryId, votes.userId],
        set: {
          stance: input.stance,
          ip: input.meta.ip,
          userAgent: input.meta.userAgent,
          updatedAt: now,
        },
      }),
    db.insert(voteEvents).values({
      id: newId(),
      entryId: input.entryId,
      stance: input.stance,
      createdAt: now,
    }),
    db.insert(actionLogs).values({
      id: newId(),
      userId: input.userId,
      action: "vote",
      targetType: "entry",
      targetId: input.entryId,
      ip: input.meta.ip,
      userAgent: input.meta.userAgent,
      country: input.meta.country,
      createdAt: now,
    }),
  ]);
}

export async function clearVote(input: {
  entryId: string;
  userId: string;
  meta: RequestMeta;
}): Promise<void> {
  const db = await getDb();
  const previous = await getVote(input.entryId, input.userId);
  if (previous === null) {
    return;
  }

  const now = new Date();
  const previousSuki = sql<number>`coalesce((select case when stance = 'suki' then 1 else 0 end from votes where entry_id = ${input.entryId} and user_id = ${input.userId} limit 1), 0)`;
  const previousKirai = sql<number>`coalesce((select case when stance = 'kirai' then 1 else 0 end from votes where entry_id = ${input.entryId} and user_id = ${input.userId} limit 1), 0)`;

  await db.batch([
    db
      .update(entries)
      .set({
        sukiCount: sql`${entries.sukiCount} - ${previousSuki}`,
        kiraiCount: sql`${entries.kiraiCount} - ${previousKirai}`,
        totalCount: sql`${entries.totalCount} - ${previousSuki} - ${previousKirai}`,
        updatedAt: now,
      })
      .where(eq(entries.id, input.entryId)),
    db
      .delete(votes)
      .where(
        and(eq(votes.entryId, input.entryId), eq(votes.userId, input.userId)),
      ),
    db.insert(actionLogs).values({
      id: newId(),
      userId: input.userId,
      action: "vote_clear",
      targetType: "entry",
      targetId: input.entryId,
      ip: input.meta.ip,
      userAgent: input.meta.userAgent,
      country: input.meta.country,
      createdAt: now,
    }),
  ]);
}

export async function createComment(input: {
  entryId: string;
  userId: string;
  parentId: string | null;
  stance: Stance;
  body: string;
  meta: RequestMeta;
}): Promise<{ id: string }> {
  const db = await getDb();
  const env = await getEnv();
  const id = newId();
  const now = new Date();
  const label = await anonLabel(input.userId, input.entryId, env.ANON_ID_SALT);

  await db.batch([
    db.insert(commentsTable).values({
      id,
      entryId: input.entryId,
      userId: input.userId,
      parentId: input.parentId,
      authorLabel: label,
      stance: input.stance,
      body: input.body,
      ip: input.meta.ip,
      userAgent: input.meta.userAgent,
      createdAt: now,
    }),
    db
      .update(entries)
      .set({
        commentCount: sql`${entries.commentCount} + 1`,
        updatedAt: now,
      })
      .where(eq(entries.id, input.entryId)),
    db.insert(actionLogs).values({
      id: newId(),
      userId: input.userId,
      action: input.parentId ? "reply" : "comment",
      targetType: "comment",
      targetId: id,
      ip: input.meta.ip,
      userAgent: input.meta.userAgent,
      country: input.meta.country,
      createdAt: now,
    }),
  ]);

  return { id };
}

export async function toggleReaction(input: {
  commentId: string;
  userId: string;
  emoji: string;
  meta: RequestMeta;
}): Promise<{ active: boolean }> {
  const db = await getDb();
  const existing = await db
    .select({ emoji: commentReactions.emoji })
    .from(commentReactions)
    .where(
      and(
        eq(commentReactions.commentId, input.commentId),
        eq(commentReactions.userId, input.userId),
        eq(commentReactions.emoji, input.emoji),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(commentReactions)
      .where(
        and(
          eq(commentReactions.commentId, input.commentId),
          eq(commentReactions.userId, input.userId),
          eq(commentReactions.emoji, input.emoji),
        ),
      );
    return { active: false };
  }

  const now = new Date();
  await db.batch([
    db
      .insert(commentReactions)
      .values({
        commentId: input.commentId,
        userId: input.userId,
        emoji: input.emoji,
        ip: input.meta.ip,
        createdAt: now,
      })
      .onConflictDoNothing(),
    db.insert(actionLogs).values({
      id: newId(),
      userId: input.userId,
      action: "reaction",
      targetType: "comment",
      targetId: input.commentId,
      ip: input.meta.ip,
      userAgent: input.meta.userAgent,
      country: input.meta.country,
      createdAt: now,
    }),
  ]);
  return { active: true };
}

export async function createReport(input: {
  targetType: "entry" | "comment" | "site";
  targetId: string;
  reporterId: string | null;
  reason: string;
  detail: string | null;
  contact: string | null;
  meta: RequestMeta;
}): Promise<void> {
  const db = await getDb();
  const env = await getEnv();
  const id = newId();
  const now = new Date();

  await db.batch([
    db.insert(reports).values({
      id,
      targetType: input.targetType,
      targetId: input.targetId,
      reporterId: input.reporterId,
      reason: input.reason,
      detail: input.detail,
      contact: input.contact,
      ip: input.meta.ip,
      createdAt: now,
    }),
    db.insert(actionLogs).values({
      id: newId(),
      userId: input.reporterId,
      action: "report",
      targetType: input.targetType,
      targetId: input.targetId,
      ip: input.meta.ip,
      userAgent: input.meta.userAgent,
      country: input.meta.country,
      createdAt: now,
    }),
  ]);

  if (env.REPORT_WEBHOOK_URL) {
    await fetch(env.REPORT_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        content: [
          "**通報を受け付けました**",
          `対象: ${input.targetType} / ${input.targetId}`,
          `理由: ${input.reason}`,
          input.detail ? `詳細: ${input.detail.slice(0, 500)}` : null,
          input.contact ? `連絡先: ${input.contact}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        allowed_mentions: { parse: [] },
      }),
    }).catch(() => undefined);
  }
}
