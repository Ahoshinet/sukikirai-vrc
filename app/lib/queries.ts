import { and, desc, eq, gte, inArray, isNull, like, sql } from "drizzle-orm";

import { getDb } from "../db/client";
import {
  commentReactions,
  comments as commentsTable,
  entries,
  entrySources,
  voteEvents,
} from "../db/schema";
import type {
  CategoryKey,
  Comment,
  CommentSummary,
  Entry,
  EntrySource,
  Reactions,
  Stance,
  VoteTrendPoint,
} from "./categories";

type EntryRow = typeof entries.$inferSelect;

function toEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    name: row.name,
    imageUrl: row.imageUrl,
    suki: row.sukiCount,
    kirai: row.kiraiCount,
    comments: row.commentCount,
    total: row.totalCount,
  };
}

const visible = eq(entries.status, "visible");

async function safe<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch {
    return fallback;
  }
}

export interface Page<T> {
  items: T[];
  total: number;
}

export async function listEntries(
  category: CategoryKey | undefined,
  limit: number,
  offset: number,
): Promise<Page<Entry>> {
  const where = category
    ? and(visible, eq(entries.category, category))
    : visible;

  return safe(async () => {
    const db = await getDb();
    const [rows, counted] = await Promise.all([
      db
        .select()
        .from(entries)
        .where(where)
        .orderBy(desc(entries.totalCount), entries.id)
        .limit(limit)
        .offset(offset),
      db.select({ value: sql<number>`count(*)` }).from(entries).where(where),
    ]);
    return { items: rows.map(toEntry), total: counted[0]?.value ?? 0 };
  }, { items: [], total: 0 });
}

export async function getEntryBySlug(
  category: CategoryKey,
  slug: string,
): Promise<Entry | null> {
  return safe(async () => {
    const db = await getDb();
    const rows = await db
      .select()
      .from(entries)
      .where(
        and(visible, eq(entries.category, category), eq(entries.slug, slug)),
      )
      .limit(1);
    return rows[0] ? toEntry(rows[0]) : null;
  }, null);
}

export async function getEntryById(id: string): Promise<Entry | null> {
  return safe(async () => {
    const db = await getDb();
    const rows = await db
      .select()
      .from(entries)
      .where(and(visible, eq(entries.id, id)))
      .limit(1);
    return rows[0] ? toEntry(rows[0]) : null;
  }, null);
}

export async function findEntryBySource(
  source: "x" | "vrchat" | "booth",
  sourceId: string,
): Promise<Entry | null> {
  const db = await getDb();
  const rows = await db
    .select({ entry: entries })
    .from(entrySources)
    .innerJoin(entries, eq(entries.id, entrySources.entryId))
    .where(
      and(eq(entrySources.source, source), eq(entrySources.sourceId, sourceId)),
    )
    .limit(1);
  return rows[0] ? toEntry(rows[0].entry) : null;
}

export async function getEntrySources(
  entryId: string,
): Promise<EntrySource[]> {
  return safe(async () => {
    const db = await getDb();
    const rows = await db
      .select({
        source: entrySources.source,
        sourceId: entrySources.sourceId,
        sourceUrl: entrySources.sourceUrl,
      })
      .from(entrySources)
      .where(eq(entrySources.entryId, entryId));
    return rows;
  }, []);
}

const TREND_HOURS = 24;

export async function voteTrend(entryId: string): Promise<VoteTrendPoint[]> {
  const end = Math.floor(Date.now() / 3_600_000) * 3_600_000;
  const start = new Date(end - (TREND_HOURS - 1) * 3_600_000);

  const buckets = new Map<number, { suki: number; kirai: number }>();
  for (let i = 0; i < TREND_HOURS; i += 1) {
    buckets.set(start.getTime() + i * 3_600_000, { suki: 0, kirai: 0 });
  }

  const rows = await safe(async () => {
    const db = await getDb();
    return db
      .select({ stance: voteEvents.stance, createdAt: voteEvents.createdAt })
      .from(voteEvents)
      .where(
        and(eq(voteEvents.entryId, entryId), gte(voteEvents.createdAt, start)),
      );
  }, [] as { stance: Stance; createdAt: Date }[]);

  for (const row of rows) {
    const key = Math.floor(row.createdAt.getTime() / 3_600_000) * 3_600_000;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket[row.stance] += 1;
    }
  }

  return [...buckets.entries()].map(([time, value]) => ({
    hour: new Date(time).toISOString(),
    suki: value.suki,
    kirai: value.kirai,
  }));
}

export interface SitemapEntry {
  category: CategoryKey;
  slug: string;
  updatedAt: Date;
}

export async function sitemapEntries(limit = 5000): Promise<SitemapEntry[]> {
  return safe(async () => {
    const db = await getDb();
    return db
      .select({
        category: entries.category,
        slug: entries.slug,
        updatedAt: entries.updatedAt,
      })
      .from(entries)
      .where(visible)
      .orderBy(desc(entries.updatedAt))
      .limit(limit);
  }, []);
}

export async function searchEntries(
  query: string,
  limit: number,
  offset: number,
): Promise<Page<Entry>> {
  const needle = query.trim();
  if (needle === "") {
    return { items: [], total: 0 };
  }

  const where = and(visible, like(entries.name, `%${needle}%`));

  return safe(async () => {
    const db = await getDb();
    const [rows, counted] = await Promise.all([
      db
        .select()
        .from(entries)
        .where(where)
        .orderBy(desc(entries.totalCount), entries.id)
        .limit(limit)
        .offset(offset),
      db.select({ value: sql<number>`count(*)` }).from(entries).where(where),
    ]);
    return { items: rows.map(toEntry), total: counted[0]?.value ?? 0 };
  }, { items: [], total: 0 });
}

export async function recentlyVoted(limit: number): Promise<Entry[]> {
  return safe(async () => {
    const db = await getDb();
    const latestVotes = db
      .select({
        entryId: voteEvents.entryId,
        latestVotedAt: sql<number>`max(${voteEvents.createdAt})`,
      })
      .from(voteEvents)
      .groupBy(voteEvents.entryId)
      .as("latest_votes");
    const rows = await db
      .select({ entry: entries })
      .from(entries)
      .innerJoin(latestVotes, eq(entries.id, latestVotes.entryId))
      .where(visible)
      .orderBy(desc(latestVotes.latestVotedAt))
      .limit(limit);
    return rows.map((row) => toEntry(row.entry));
  }, []);
}

export async function getVisibleRootComment(
  commentId: string,
  entryId: string,
): Promise<boolean> {
  return safe(async () => {
    const db = await getDb();
    const rows = await db
      .select({ id: commentsTable.id })
      .from(commentsTable)
      .where(
        and(
          eq(commentsTable.id, commentId),
          eq(commentsTable.entryId, entryId),
          eq(commentsTable.status, "visible"),
          isNull(commentsTable.parentId),
        ),
      )
      .limit(1);
    return rows.length > 0;
  }, false);
}

export async function getVisibleCommentEntry(
  commentId: string,
): Promise<{ entryId: string } | null> {
  return safe(async () => {
    const db = await getDb();
    const rows = await db
      .select({ entryId: commentsTable.entryId })
      .from(commentsTable)
      .innerJoin(entries, eq(entries.id, commentsTable.entryId))
      .where(
        and(
          eq(commentsTable.id, commentId),
          eq(commentsTable.status, "visible"),
          visible,
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  }, null);
}

export async function recentComments(
  limit: number,
  offset: number,
): Promise<Page<CommentSummary>> {
  const where = and(
    eq(commentsTable.status, "visible"),
    isNull(commentsTable.parentId),
  );

  return safe(async () => {
    const db = await getDb();
    const [rows, counted] = await Promise.all([
      db
        .select({
          id: commentsTable.id,
          entryId: commentsTable.entryId,
          stance: commentsTable.stance,
          createdAt: commentsTable.createdAt,
          entryName: entries.name,
          entrySlug: entries.slug,
          entryCategory: entries.category,
        })
        .from(commentsTable)
        .innerJoin(entries, eq(entries.id, commentsTable.entryId))
        .where(and(where, visible))
        .orderBy(desc(commentsTable.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ value: sql<number>`count(*)` })
        .from(commentsTable)
        .innerJoin(entries, eq(entries.id, commentsTable.entryId))
        .where(and(where, visible)),
    ]);

    return {
      items: rows.map((row) => ({
        id: row.id,
        entryId: row.entryId,
        entryName: row.entryName,
        entrySlug: row.entrySlug,
        entryCategory: row.entryCategory,
        stance: row.stance as Stance,
        postedAt: row.createdAt.toISOString(),
      })),
      total: counted[0]?.value ?? 0,
    };
  }, { items: [], total: 0 });
}

export async function getComments(
  entryId: string,
  viewerId: string | null,
): Promise<Comment[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(commentsTable)
    .where(
      and(
        eq(commentsTable.entryId, entryId),
        eq(commentsTable.status, "visible"),
      ),
    )
    .orderBy(desc(commentsTable.createdAt));

  if (rows.length === 0) {
    return [];
  }

  const ids = rows.map((row) => row.id);
  const reactionRows = await db
    .select({
      commentId: commentReactions.commentId,
      emoji: commentReactions.emoji,
      userId: commentReactions.userId,
    })
    .from(commentReactions)
    .where(inArray(commentReactions.commentId, ids));

  const counts = new Map<string, Reactions>();
  const mine = new Map<string, string[]>();
  for (const row of reactionRows) {
    const bucket = counts.get(row.commentId) ?? {};
    bucket[row.emoji] = (bucket[row.emoji] ?? 0) + 1;
    counts.set(row.commentId, bucket);
    if (viewerId && row.userId === viewerId) {
      mine.set(row.commentId, [...(mine.get(row.commentId) ?? []), row.emoji]);
    }
  }

  return rows.map((row) => ({
    id: row.id,
    entryId: row.entryId,
    parentId: row.parentId,
    authorLabel: row.authorLabel,
    stance: row.stance as Stance,
    body: row.body,
    postedAt: row.createdAt.toISOString(),
    reactions: counts.get(row.id) ?? {},
    mine: mine.get(row.id) ?? [],
  }));
}
