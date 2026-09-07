import { notFound } from "next/navigation";
import { Text } from "@mantine/core";

import { CATEGORIES, type CategoryKey } from "../lib/categories";
import { getEntryBySlug, listEntries } from "../lib/queries";
import { CategoryIcon } from "./CategoryIcon";
import { EntryDetail } from "./EntryDetail";
import { PageHeading, PageLayout } from "./PageLayout";
import { PAGE_SIZE, PaginationNav } from "./PaginationNav";
import { RankingList } from "./RankingList";

export async function CategoryPageView({
  category,
  page = 1,
}: {
  category: CategoryKey;
  page?: number;
}) {
  const meta = CATEGORIES[category];
  const offset = (page - 1) * PAGE_SIZE;
  const { items, total } = await listEntries(category, PAGE_SIZE, offset);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <PageLayout>
      <PageHeading
        icon={
          <span style={{ color: "var(--mantine-color-brand-6)", display: "flex" }}>
            <CategoryIcon category={category} size={24} />
          </span>
        }
        title={`${meta.label}ランキング`}
        description={meta.description}
        meta={
          <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
            {total}件
          </Text>
        }
      />
      <RankingList entries={items} startRank={offset + 1} />
      <PaginationNav
        basePath={`/${meta.segment}`}
        page={page}
        totalPages={totalPages}
        from={total === 0 ? 0 : offset + 1}
        to={Math.min(offset + PAGE_SIZE, total)}
        total={total}
      />
    </PageLayout>
  );
}

export async function EntryPageView({
  category,
  slug,
}: {
  category: CategoryKey;
  slug: string;
}) {
  const entry = await getEntryBySlug(category, slug);
  if (!entry) {
    notFound();
  }

  return (
    <PageLayout>
      <EntryDetail entry={entry} />
    </PageLayout>
  );
}

export async function entryMetadata(category: CategoryKey, slug: string) {
  const entry = await getEntryBySlug(category, slug);
  if (!entry) {
    return { title: "見つかりませんでした" };
  }
  return {
    title: `${entry.name}の好き嫌い`,
    description: `${entry.name}（${CATEGORIES[category].label}）への匿名投票とコメント。投票すると結果が見られます。`,
  };
}
