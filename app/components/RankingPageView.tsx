import { Text } from "@mantine/core";
import { TbTrophy } from "react-icons/tb";

import { listEntries } from "../lib/queries";
import { PageHeading, PageLayout } from "./PageLayout";
import { PAGE_SIZE, PaginationNav } from "./PaginationNav";
import { RankingList } from "./RankingList";

export async function RankingPageView({ page }: { page: number }) {
  const offset = (page - 1) * PAGE_SIZE;
  const { items, total } = await listEntries(undefined, PAGE_SIZE, offset);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <PageLayout>
      <PageHeading
        icon={<TbTrophy size={24} color="var(--mantine-color-brand-6)" />}
        title="総合ランキング"
        description="ユーザー・アバター・ワールド・グループを横断した、得票数の多い順の一覧です。"
        meta={
          <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
            {total}件
          </Text>
        }
      />
      <RankingList entries={items} startRank={offset + 1} />
      <PaginationNav
        basePath="/ranking"
        page={page}
        totalPages={totalPages}
        from={total === 0 ? 0 : offset + 1}
        to={Math.min(offset + PAGE_SIZE, total)}
        total={total}
      />
    </PageLayout>
  );
}
