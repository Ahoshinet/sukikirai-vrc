import type { Metadata } from "next";
import { Card, Stack, Text } from "@mantine/core";
import { TbSearch } from "react-icons/tb";

import { PageHeading, PageLayout } from "../components/PageLayout";
import { PAGE_SIZE, PaginationNav, parsePage } from "../components/PaginationNav";
import { RankingList } from "../components/RankingList";
import { searchEntries } from "../lib/queries";

export const metadata: Metadata = {
  title: "検索",
  description: "ユーザー・アバター・ワールド・グループを名前で検索します。",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const query = (q ?? "").trim();
  const current = parsePage(page);
  const offset = (current - 1) * PAGE_SIZE;
  const { items, total } = await searchEntries(query, PAGE_SIZE, offset);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <PageLayout>
      <PageHeading
        icon={<TbSearch size={24} color="var(--mantine-color-brand-6)" />}
        title="検索"
        description={
          query === ""
            ? "名前の一部を入力して検索してください。"
            : `「${query}」の検索結果です。`
        }
        meta={
          query === "" ? undefined : (
            <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
              {total}件
            </Text>
          )
        }
      />

      {query === "" ? (
        <Card withBorder radius="md" padding="xl">
          <Text size="sm" c="dimmed" ta="center">
            検索したい名前を入力してください。
          </Text>
        </Card>
      ) : total === 0 ? (
        <Stack gap="xs">
          <Card withBorder radius="md" padding="xl">
            <Text size="sm" c="dimmed" ta="center">
              「{query}」に一致する対象は見つかりませんでした。
            </Text>
          </Card>
          <Text size="xs" c="dimmed" ta="center">
            まだ掲載されていない場合は、新しい投票ページを作成できます。
          </Text>
        </Stack>
      ) : (
        <>
          <RankingList entries={items} startRank={offset + 1} />
          <PaginationNav
            basePath="/search"
            query={`q=${encodeURIComponent(query)}`}
            page={current}
            totalPages={totalPages}
            from={offset + 1}
            to={Math.min(offset + PAGE_SIZE, total)}
            total={total}
          />
        </>
      )}
    </PageLayout>
  );
}
