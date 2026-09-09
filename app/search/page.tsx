import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, Group, Loader, Text } from "@mantine/core";
import { TbSearch } from "react-icons/tb";

import { PageHeading, PageLayout } from "../components/PageLayout";
import { SearchResults } from "../components/SearchResults";

export const metadata: Metadata = {
  title: "検索",
  description: "ユーザー・アバター・ワールド・グループを名前で検索します。",
};

export default function Page() {
  return (
    <PageLayout>
      <PageHeading
        icon={<TbSearch size={24} color="var(--mantine-color-brand-6)" />}
        title="検索"
        description="名前の一部を入力して検索してください。"
      />
      <Suspense
        fallback={
          <Card withBorder radius="md" padding="xl">
            <Group justify="center">
              <Loader size="sm" />
            </Group>
          </Card>
        }
      >
        <SearchResults />
      </Suspense>
      <noscript>
        <Text size="xs" c="dimmed" ta="center" mt="sm">
          検索には JavaScript が必要です。
        </Text>
      </noscript>
    </PageLayout>
  );
}
