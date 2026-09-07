export const CATEGORY_KEYS = ["user", "avatar", "world", "group"] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export interface CategoryMeta {
  key: CategoryKey;
  segment: string;
  label: string;
  description: string;
}

export const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  user: {
    key: "user",
    segment: "users",
    label: "ユーザー",
    description: "ワールドで見かけたユーザーへの投票。",
  },
  avatar: {
    key: "avatar",
    segment: "avatars",
    label: "アバター",
    description: "見かけたアバターの好き嫌い。",
  },
  world: {
    key: "world",
    segment: "worlds",
    label: "ワールド",
    description: "訪れたワールドの評価。",
  },
  group: {
    key: "group",
    segment: "groups",
    label: "グループ",
    description: "グループやコミュニティへの評価。",
  },
};

export type Stance = "suki" | "kirai";

export interface Entry {
  id: string;
  slug: string;
  category: CategoryKey;
  name: string;
  imageUrl: string | null;
  suki: number;
  kirai: number;
  comments: number;
  total: number;
}

export type Reactions = Record<string, number>;

export interface Comment {
  id: string;
  entryId: string;
  parentId: string | null;
  authorLabel: string;
  stance: Stance;
  body: string;
  postedAt: string;
  reactions: Reactions;
  mine: string[];
}

export interface CommentSummary {
  id: string;
  entryId: string;
  entryName: string;
  entrySlug: string;
  entryCategory: CategoryKey;
  stance: Stance;
  postedAt: string;
}

export interface EntrySource {
  source: "x" | "vrchat" | "booth";
  sourceId: string;
  sourceUrl: string;
}

export interface VoteTrendPoint {
  hour: string;
  suki: number;
  kirai: number;
}

export function entryHref(entry: Pick<Entry, "category" | "slug">): string {
  return `/${CATEGORIES[entry.category].segment}/${entry.slug}`;
}

export function sukiPercent(entry: Pick<Entry, "suki" | "kirai">): number {
  const total = entry.suki + entry.kirai;
  return total === 0 ? 50 : Math.round((entry.suki / total) * 100);
}

export function formatCount(value: number): string {
  return value.toLocaleString("ja-JP");
}

export function formatDateTime(iso: string): string {
  const [date, time = ""] = iso.split("T");
  return `${date.replace(/-/g, "/")} ${time.slice(0, 5)}`;
}
