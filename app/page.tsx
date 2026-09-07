import { Card, Group, Stack, Text, Title } from "@mantine/core";
import { TbLock, TbTrophy } from "react-icons/tb";

import { CATEGORY_KEYS } from "./lib/categories";
import { MoreLink } from "./components/MoreLink";
import { PageLayout } from "./components/PageLayout";
import { RankingSection } from "./components/RankingSection";
import { RecentEntries } from "./components/RecentEntries";

export const revalidate = 60;

export default function Home() {
  return (
    <PageLayout>
      <Stack gap="xl">
        <Card withBorder radius="md" padding="lg">
          <Group gap={8} mb={4}>
            <TbTrophy size={22} color="var(--mantine-color-brand-6)" />
            <Title order={1} size="h3">
              好き嫌いVRC.com
            </Title>
          </Group>
          <Text size="sm" c="dimmed">
            VRChatで気になる物を見つけて、匿名で投票できるコミュニティサイトです。
          </Text>
          <Group justify="space-between" align="center" mt="sm" wrap="nowrap">
            <Group gap={4} c="dimmed" wrap="nowrap">
              <TbLock size={13} />
              <Text size="xs">
                投票にはログインが必要です。集計結果は匿名で表示されます。
              </Text>
            </Group>
            <MoreLink href="/ranking">総合ランキング</MoreLink>
          </Group>
        </Card>

        <RecentEntries />

        {CATEGORY_KEYS.map((category) => (
          <RankingSection key={category} category={category} limit={5} />
        ))}
      </Stack>
    </PageLayout>
  );
}
