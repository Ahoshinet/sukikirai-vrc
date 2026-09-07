import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { user } from "./auth-schema";

export * from "./auth-schema";

export const CATEGORY_VALUES = ["user", "avatar", "world", "group"] as const;
export const SOURCE_VALUES = ["x", "vrchat", "booth"] as const;
export const STANCE_VALUES = ["suki", "kirai"] as const;

export const entries = sqliteTable(
  "entries",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    category: text("category", { enum: CATEGORY_VALUES }).notNull(),
    name: text("name").notNull(),
    imageUrl: text("image_url"),
    sukiCount: integer("suki_count").notNull().default(0),
    kiraiCount: integer("kirai_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    totalCount: integer("total_count").notNull().default(0),
    status: text("status", { enum: ["visible", "hidden", "removed"] })
      .notNull()
      .default("visible"),
    createdBy: text("created_by").references(() => user.id),
    createdIp: text("created_ip"),
    createdUa: text("created_ua"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [
    index("entries_ranking").on(t.status, t.totalCount),
    index("entries_category_ranking").on(t.status, t.category, t.totalCount),
    index("entries_updated").on(t.status, t.updatedAt),
  ],
);

export const entrySources = sqliteTable(
  "entry_sources",
  {
    entryId: text("entry_id")
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    source: text("source", { enum: SOURCE_VALUES }).notNull(),
    sourceId: text("source_id").notNull(),
    sourceUrl: text("source_url").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.source, t.sourceId] }),
    index("entry_sources_entry").on(t.entryId),
  ],
);

export const votes = sqliteTable(
  "votes",
  {
    entryId: text("entry_id")
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stance: text("stance", { enum: STANCE_VALUES }).notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.entryId, t.userId] })],
);

export const comments = sqliteTable(
  "comments",
  {
    id: text("id").primaryKey(),
    entryId: text("entry_id")
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    parentId: text("parent_id"),
    authorLabel: text("author_label").notNull(),
    stance: text("stance", { enum: STANCE_VALUES }).notNull(),
    body: text("body").notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    status: text("status", { enum: ["visible", "hidden", "deleted"] })
      .notNull()
      .default("visible"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [
    index("comments_entry").on(t.entryId, t.status, t.createdAt),
    index("comments_parent").on(t.parentId),
    index("comments_recent").on(t.status, t.createdAt),
  ],
);

export const commentReactions = sqliteTable(
  "comment_reactions",
  {
    commentId: text("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    emoji: text("emoji").notNull(),
    ip: text("ip"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.commentId, t.userId, t.emoji] }),
    index("comment_reactions_comment").on(t.commentId),
  ],
);

export const reports = sqliteTable(
  "reports",
  {
    id: text("id").primaryKey(),
    targetType: text("target_type", { enum: ["entry", "comment", "site"] }).notNull(),
    targetId: text("target_id").notNull(),
    reporterId: text("reporter_id").references(() => user.id, {
      onDelete: "set null",
    }),
    reason: text("reason").notNull(),
    detail: text("detail"),
    contact: text("contact"),
    ip: text("ip"),
    status: text("status", { enum: ["open", "resolved", "rejected"] })
      .notNull()
      .default("open"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [index("reports_status").on(t.status, t.createdAt)],
);

export const actionLogs = sqliteTable(
  "action_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    action: text("action", {
      enum: [
        "login",
        "entry_create",
        "source_add",
        "vote",
        "vote_clear",
        "comment",
        "reply",
        "reaction",
        "report",
        "moderate_hide",
        "moderate_reject",
      ],
    }).notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    ip: text("ip").notNull(),
    userAgent: text("user_agent"),
    country: text("country"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [
    index("action_logs_ip").on(t.ip, t.createdAt),
    index("action_logs_user").on(t.userId, t.createdAt),
    index("action_logs_created").on(t.createdAt),
  ],
);
